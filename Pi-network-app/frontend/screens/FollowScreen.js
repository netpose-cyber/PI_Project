
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const FollowScreen = ({ userId }) => {
    const [followingId, setFollowingId] = useState("");

    const handleFollow = async () => {
        try {
            await axios.post('http://localhost:5000/follow', { followerId: userId, followingId });
            setFollowingId("");
            alert("팔로우 성공!");
        } catch (error) {
            alert("팔로우 실패");
        }
    };

    return (
        <View>
            <Text>사용자 팔로우</Text>
            <TextInput placeholder="팔로우할 사용자 ID" value={followingId} onChangeText={setFollowingId} />
            <Button title="팔로우" onPress={handleFollow} />
        </View>
    );
};

export default FollowScreen;
