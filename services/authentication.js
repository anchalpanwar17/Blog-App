const JWT = require("jsonwebtoken");

const secret = "ThisIsMyBlogPage";

function createToken(user){
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    }
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {createToken, validateToken}
