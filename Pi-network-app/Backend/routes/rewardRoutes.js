const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 사용자 모델
const Reward = require('../models/Reward'); // 보상 모델

// 보상 조회 (GET /rewards/:userId)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 사용자의 보상 내역 조회
    const rewards = await Reward.find({ userId }).sort({ createdAt: -1 }); // 최신 보상 순으로 조회
    if (!rewards) {
      return res.status(404).json({ message: '보상 내역을 찾을 수 없습니다.' });
    }
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: '보상 내역을 불러오는 데 실패했습니다.' });
  }
});

// 보상 적립 (POST /rewards/earn)
router.post('/earn', async (req, res) => {
  const { userId, amount, description } = req.body;

  try {
    // 사용자가 존재하는지 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 보상 정보 생성
    const newReward = new Reward({
      userId,
      amount,
      description,
      createdAt: new Date(),
    });

    // 보상 저장
    await newReward.save();

    // 사용자 보상 합산
    user.rewardBalance = (user.rewardBalance || 0) + amount;
    await user.save();

    res.status(201).json({ message: '보상 적립 성공!', reward: newReward });
  } catch (error) {
    res.status(500).json({ message: '보상 적립에 실패했습니다.' });
  }
});

// 보상 사용 (POST /rewards/redeem)
router.post('/redeem', async (req, res) => {
  const { userId, amount, description } = req.body;

  try {
    // 사용자가 존재하는지 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자가 충분한 보상을 보유하고 있는지 확인
    if (user.rewardBalance < amount) {
      return res.status(400).json({ message: '보상 잔액이 부족합니다.' });
    }

    // 보상 정보 생성
    const newReward = new Reward({
      userId,
      amount: -amount, // 사용한 보상은 마이너스
      description,
      createdAt: new Date(),
    });

    // 보상 저장
    await newReward.save();

    // 사용자 보상 잔액 차감
    user.rewardBalance -= amount;
    await user.save();

    res.status(200).json({ message: '보상 사용 성공!', reward: newReward });
  } catch (error) {
    res.status(500).json({ message: '보상 사용에 실패했습니다.' });
  }
});

// 보상 활동 기록 삭제 (DELETE /rewards/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 보상 기록 삭제
    const deletedReward = await Reward.findByIdAndDelete(id);
    if (!deletedReward) {
      return res.status(404).json({ message: '보상 기록을 찾을 수 없습니다.' });
    }

    // 해당 보상 기록에 대한 사용자 보상 잔액 수정
    const user = await User.findById(deletedReward.userId);
    user.rewardBalance -= deletedReward.amount;
    await user.save();

    res.status(200).json({ message: '보상 기록이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '보상 기록 삭제에 실패했습니다.' });
  }
});

module.exports = router;
