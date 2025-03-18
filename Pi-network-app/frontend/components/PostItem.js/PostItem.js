import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// 기본 스타일
const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postLikes: {
    fontSize: 14,
    color: '#007BFF',
  },
  postButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const PostItem = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
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
    <View style={styles.postContainer}>
      {/* 게시글 헤더 (작성자, 날짜 등) */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.userAvatar }}
          style={styles.postUserAvatar}
        />
        <Text style={styles.postUserName}>{post.userName}</Text>
        <Text style={styles.postDate}>{post.date}</Text>
      </View>

      {/* 게시글 내용 */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* 게시글 하단 (좋아요, 댓글 버튼 등) */}
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.postLikes}>
            {liked ? `❤️ ${likes}` : `🤍 ${likes}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postButton} onPress={() => alert('댓글을 추가하세요!')}>
          <Text style={styles.postButtonText}>댓글 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItem;
