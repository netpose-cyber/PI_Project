const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 사용자 모델
const Payment = require('../models/Payment'); // 결제 모델

// 결제 내역 조회 (GET /payments/:userId)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 사용자의 결제 내역 조회
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }); // 최신 결제 순으로 조회
    if (!payments) {
      return res.status(404).json({ message: '결제 내역을 찾을 수 없습니다.' });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: '결제 내역을 불러오는 데 실패했습니다.' });
  }
});

// 결제 생성 (POST /payments/create)
router.post('/create', async (req, res) => {
  const { userId, amount, method, description } = req.body;

  try {
    // 사용자가 존재하는지 확인
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 결제 정보 생성
    const newPayment = new Payment({
      userId,
      amount,
      method,
      description,
      createdAt: new Date(),
    });

    // 결제 정보 저장
    await newPayment.save();

    // 사용자의 결제 잔액 업데이트 (예시: 결제 후 잔액 차감)
    user.balance = (user.balance || 0) - amount; // 결제 시 잔액 차감
    await user.save();

    res.status(201).json({ message: '결제 성공!', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: '결제 생성에 실패했습니다.' });
  }
});

// 결제 취소 (POST /payments/cancel)
router.post('/cancel', async (req, res) => {
  const { paymentId } = req.body;

  try {
    // 결제 내역 확인
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: '결제 내역을 찾을 수 없습니다.' });
    }

    // 결제 취소 (사용자의 결제 잔액을 원래대로 복구)
    const user = await User.findById(payment.userId);
    user.balance += payment.amount; // 결제 금액을 잔액에 더함
    await user.save();

    // 결제 내역 삭제
    await Payment.findByIdAndDelete(paymentId);

    res.status(200).json({ message: '결제 취소 성공!' });
  } catch (error) {
    res.status(500).json({ message: '결제 취소에 실패했습니다.' });
  }
});

// 결제 정보 수정 (PUT /payments/:paymentId)
router.put('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  const { amount, method, description } = req.body;

  try {
    // 결제 내역 확인
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: '결제 내역을 찾을 수 없습니다.' });
    }

    // 결제 정보 수정
    payment.amount = amount || payment.amount;
    payment.method = method || payment.method;
    payment.description = description || payment.description;

    await payment.save();

    res.status(200).json({ message: '결제 정보 수정 성공!', payment });
  } catch (error) {
    res.status(500).json({ message: '결제 정보 수정에 실패했습니다.' });
  }
});

module.exports = router;
