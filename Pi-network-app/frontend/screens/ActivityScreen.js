
import React from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const ActivityScreen = ({ userId }) => {
    const handleReward = async (activity) => {
        try {
            const response = await axios.post('http://localhost:5000/reward', {
                userId,
                activity,
            });
            alert(response.data.message);
        } catch (error) {
            alert('보상 지급 실패');
        }
    };

    return (
        <View>
            <Text>Pi 코인 보상 활동</Text>
            <Button title="게시글 작성 (1 Pi)" onPress={() => handleReward('post')} />
            <Button title="댓글 작성 (0.5 Pi)" onPress={() => handleReward('comment')} />
            <Button title="좋아요 (0.2 Pi)" onPress={() => handleReward('like')} />
            <Button title="공유 (0.8 Pi)" onPress={() => handleReward('share')} />
        </View>
    );
};

export default ActivityScreen;
