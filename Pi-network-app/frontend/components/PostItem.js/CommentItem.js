import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// 기본 스타일 정의
const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  commentContent: {
    fontSize: 13,
    marginBottom: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentLikes: {
    fontSize: 14,
    color: '#007BFF',
  },
  likeButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const CommentItem = ({ comment }) => {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);

  // 좋아요 버튼 클릭 시 동작
  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  return (
    <View style={styles.commentContainer}>
      {/* 댓글 작성자 정보 */}
      <View style={styles.commentHeader}>
        <Image
          source={{ uri: comment.userAvatar }}
          style={styles.commentUserAvatar}
        />
        <Text style={styles.commentUserName}>{comment.userName}</Text>
        <Text style={styles.commentDate}>{comment.date}</Text>
      </View>

      {/* 댓글 내용 */}
      <Text style={styles.commentContent}>{comment.content}</Text>

      {/* 댓글 하단 (좋아요 버튼) */}
      <View style={styles.commentFooter}>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likeButtonText}>
            {liked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.commentLikes}>
          {likes} {likes === 1 ? 'Like' : 'Likes'}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;
