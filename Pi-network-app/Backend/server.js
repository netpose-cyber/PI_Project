require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Web3 = require('web3');

// Models
const Transaction = require('./models/Transaction');
const Reward = require('./models/Reward');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Follow = require('./models/Follow');
const contractABI = require('./build/PiRewardContract.abi.json');

const app = express();
app.use(cors());
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 5000;
const PI_API_KEY = process.env.PI_API_KEY;
const BASE_URL = 'https://api.minepi.com/v2/transactions';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pi-wallet';
const PI_NETWORK_NODE_URL = process.env.PI_NETWORK_NODE_URL || 'https://pi-network-node-url';
const DEPLOYED_CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Web3 Setup
const web3 = new Web3(PI_NETWORK_NODE_URL);
const contract = new web3.eth.Contract(contractABI, DEPLOYED_CONTRACT_ADDRESS);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// API Endpoints

// Pi Payment Request API
app.post('/create-payment', async (req, res) => {
  try {
    const { amount, memo, metadata, userId } = req.body;
    await Transaction.create({ userId, type: 'send', amount, memo });
    res.json({ success: true, message: '결제 완료' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// QR Code Generation API
app.post('/generate-qr', async (req, res) => {
  try {
    const { amount, memo } = req.body;
    const paymentData = JSON.stringify({ amount, memo });
    const qrCodeUrl = await QRCode.toDataURL(paymentData);
    res.json({ qrCodeUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Balance Inquiry API
app.get('/balance/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ userId });
    const balance = transactions.reduce((total, tx) => (tx.type === 'receive' ? total + tx.amount : total - tx.amount), 0);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction History Inquiry API
app.get('/transactions/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reward Issuance API (MongoDB)
app.post('/reward', async (req, res) => {
  try {
    const { userId, activity } = req.body;
    const rewardAmounts = { post: 1.0, comment: 0.5, like: 0.2, share: 0.8 };
    const amount = rewardAmounts[activity] || 0;
    if (amount === 0) {
      return res.status(400).json({ error: '잘못된 활동 유형' });
    }
    await Reward.create({ userId, activity, amount });
    res.json({ success: true, message: `보상 지급 완료: ${amount} Pi` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User's Total Rewards Inquiry API
app.get('/reward/:userId', async (req, res) => {
  try {
    const rewards = await Reward.find({ userId });
    const totalRewards = rewards.reduce((total, reward) => total + reward.amount, 0);
    res.json({ totalRewards, rewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post Creation API
app.post('/post', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const newPost = await Post.create({ userId, content });
    res.json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post List Inquiry API
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment Addition API
app.post('/comment', async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const newComment = await Comment.create({ postId, userId, content });
    res.json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Specific Post's Comment Inquiry API
app.get('/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post Like API
app.post('/like', async (req, res) => {
  try {
    const { postId } = req.body;
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
    res.json({ success: true, message: '좋아요 추가됨' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow API
app.post('/follow', async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    const follow = await Follow.create({ followerId, followingId });
    res.json({ success: true, follow });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reward Issuance API (Smart Contract)
app.post('/contract-reward', async (req, res) => {
  try {
    const { userAddress, amount } = req.body;
    await contract.methods.issueReward(userAddress, amount).send({ from: account.address, gas: 300000 });
    res.json({ success: true, message: '보상 지급 완료' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reward Withdrawal API (Smart Contract)
app.post('/withdraw', async (req, res) => {
  try {
    await contract.methods.withdrawReward().send({ from: req.body.userAddress, gas: 30000 });
    res.json({ success: true, message: '출금 완료' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});