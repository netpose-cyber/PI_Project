
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
