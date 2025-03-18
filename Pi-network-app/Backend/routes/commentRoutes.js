const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // 댓글 모델 (MongoDB 사용 예시)
const Post = require('../models/Post'); // 게시글 모델 (댓글을 게시글에 연결)

// 댓글 목록 조회 (특정 게시글에 달린 댓글)
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 }); // 최신 댓글 우선
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: '댓글 목록을 불러오는 데 실패했습니다.' });
  }
});

// 댓글 생성 (POST)
router.post('/post/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userName, content, userAvatar } = req.body;

  try {
    // 댓글 생성
    const newComment = new Comment({
      postId,
      userName,
      content,
      userAvatar,
      createdAt: new Date(),
    });

    // 댓글 저장
    await newComment.save();

    // 게시글에 댓글 수 업데이트
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json(newComment); // 새로 생성된 댓글 응답
  } catch (error) {
    res.status(500).json({ message: '댓글 생성에 실패했습니다.' });
  }
});

// 특정 댓글 조회 (GET)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: '댓글 조회에 실패했습니다.' });
  }
});

// 댓글 수정 (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true } // 업데이트된 댓글 반환
    );

    if (!updatedComment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: '댓글 수정에 실패했습니다.' });
  }
});

// 댓글 삭제 (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 댓글 삭제 후 게시글의 댓글 수 감소
    await Post.findByIdAndUpdate(deletedComment.postId, { $inc: { commentCount: -1 } });

    res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '댓글 삭제에 실패했습니다.' });
  }
});

// 댓글 좋아요 추가/취소 (PATCH)
router.patch('/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    }

    // 좋아요 상태 토글
    comment.likes = comment.likes + 1;
    await comment.save();

    res.status(200).json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: '댓글 좋아요 처리에 실패했습니다.' });
  }
});

module.exports = router;
