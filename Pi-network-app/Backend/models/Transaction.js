
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: String,
    type: String, // "send" or "receive"
    amount: Number,
    memo: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
