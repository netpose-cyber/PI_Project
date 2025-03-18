
const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
    followerId: String,
    followingId: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Follow', FollowSchema);
