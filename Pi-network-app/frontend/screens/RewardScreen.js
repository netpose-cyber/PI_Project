import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import axios from 'axios';

// RewardScreen with reward list and total rewards
const RewardListScreen = ({ userId }) => {
  const [rewards, setRewards] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reward/${userId}`);
        setTotalRewards(response.data.totalRewards);
        setRewards(response.data.rewards);
      } catch (error) {
        console.error(error);
        Alert.alert("보상 불러오기 실패", "서버와의 연결을 확인해주세요.");
      }
    };

    fetchRewards();
  }, [userId]);

  return (
    <View>
      <Text>총 보상: {totalRewards} Pi</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.activity} 수행 → +{item.amount} Pi</Text>
            <Text>날짜: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

// RewardScreen with claim reward button
const RewardClaimScreen = ({ userAddress }) => {
  const handleClaimReward = async () => {
    try {
      const response = await axios.post('http://localhost:5000/withdraw', { userAddress });
      Alert.alert("보상 출금 성공", response.data.message);
    } catch (error) {
      Alert.alert("보상 출금 실패", "서버와의 연결을 확인해주세요.");
    }
  };

  return (
    <View>
      <Text>스마트 컨트랙트 기반 보상 시스템</Text>
      <Button title="보상 출금" onPress={handleClaimReward} />
    </View>
  );
};

// Combined RewardScreen for better organization.
const RewardScreen = ({ userId, userAddress, showList }) => {
  return (
    <View>
      {showList ? (
        <RewardListScreen userId={userId} />
      ) : (
        <RewardClaimScreen userAddress={userAddress} />
      )}
    </View>
  );
};

export { RewardScreen, RewardListScreen, RewardClaimScreen };