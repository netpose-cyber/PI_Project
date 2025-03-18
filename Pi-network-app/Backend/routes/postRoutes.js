const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // 게시글 모델 (MongoDB 사용 예시)

// 게시글 목록 조회 (GET)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // 최신 게시글 우선
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: '게시글 목록을 불러오는 데 실패했습니다.' });
  }
});

// 게시글 생성 (POST)
router.post('/', async (req, res) => {
  const { userName, content, userAvatar } = req.body;

  try {
    const newPost = new Post({
      userName,
      content,
      userAvatar,
      likes: 0,
      createdAt: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost); // 새로 생성된 게시글 응답
  } catch (error) {
    res.status(500).json({ message: '게시글 생성에 실패했습니다.' });
  }
});

// 특정 게시글 조회 (GET)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
  }
});

// 게시글 수정 (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content },
      { new: true } // 업데이트된 문서 반환
    );

    if (!updatedPost) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
  }
});

// 게시글 삭제 (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
  }
});

// 게시글 좋아요 추가/취소 (PATCH)
router.patch('/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    // 좋아요 상태 토글
    post.likes = post.likes + 1;
    await post.save();

    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: '좋아요 처리에 실패했습니다.' });
  }
});

module.exports = router;
