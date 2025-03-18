
const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
    userId: String,
    activity: String,  // 예: "post", "comment", "like"
    amount: Number,  
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reward', RewardSchema);
