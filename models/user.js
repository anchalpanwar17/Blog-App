const mongoose = require("mongoose");
const crypto = require("crypto");
const { createToken } = require("../services/authentication");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/useravatar.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
},{ timestamps: true });

userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) return;
    const salt = crypto.randomBytes(16).toString();
    const hashedPassword = crypto.createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error("User not Found");
    // console.log(user);
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = crypto.createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    const token = createToken(user);
    return {token};
});

const User = mongoose.model("user", userSchema);

module.exports = User;