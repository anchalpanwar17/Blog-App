const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    coverImageUrl: {
        type: String,
    },
    category: {
        type: String,
        enum: ["Art", "Science", "Technology", "Cinema", "Design", "Food", "Lifestyle"],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
}, { timestamps: true });

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;