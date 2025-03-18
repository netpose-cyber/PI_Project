const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 사용자 모델 (MongoDB 사용 예시)

// 팔로우 (POST)
router.post('/follow', async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 이미 팔로우하고 있는지 확인
    if (follower.following.includes(followingId)) {
      return res.status(400).json({ message: '이미 팔로우하고 있는 사용자입니다.' });
    }

    // 팔로우 추가
    follower.following.push(followingId);
    following.followers.push(followerId);

    // 변경 사항 저장
    await follower.save();
    await following.save();

    res.status(200).json({ message: '팔로우 성공!' });
  } catch (error) {
    res.status(500).json({ message: '팔로우 처리에 실패했습니다.' });
  }
});

// 언팔로우 (DELETE)
router.delete('/unfollow', async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 팔로우 목록에서 사용자 제거
    if (!follower.following.includes(followingId)) {
      return res.status(400).json({ message: '팔로우하지 않는 사용자입니다.' });
    }

    // 팔로우 취소
    follower.following = follower.following.filter(id => id !== followingId);
    following.followers = following.followers.filter(id => id !== followerId);

    // 변경 사항 저장
    await follower.save();
    await following.save();

    res.status(200).json({ message: '언팔로우 성공!' });
  } catch (error) {
    res.status(500).json({ message: '언팔로우 처리에 실패했습니다.' });
  }
});

// 팔로워 목록 조회 (GET /followers/:userId)
router.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followers', 'userName userAvatar');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: '팔로워 목록을 불러오는 데 실패했습니다.' });
  }
});

// 팔로잉 목록 조회 (GET /following/:userId)
router.get('/following/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following', 'userName userAvatar');
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: '팔로잉 목록을 불러오는 데 실패했습니다.' });
  }
});

module.exports = router;
