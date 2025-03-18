import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, Button, View, StatusBar } from 'react-native';
import axios from 'axios';

// 화면 임포트
import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import FollowScreen from './screens/FollowScreen';
import RewardScreen from './screens/RewardScreen';

const Stack = createStackNavigator();

export default function App() {
  const [userAddress, setUserAddress] = useState(null);

  // 앱 시작 시 사용자의 Pi 주소 불러오기 (예시: 로컬 스토리지나 서버에서)
  useEffect(() => {
    const fetchUserAddress = async () => {
      // 사용자 Pi 주소를 로컬 저장소나 API에서 가져옵니다.
      try {
        // 예시로 서버에서 불러옴
        const response = await axios.get('http://localhost:5000/user/address');
        setUserAddress(response.data.address);  // 서버에서 사용자 주소를 받아옵니다.
      } catch (error) {
        console.error('User address fetch error:', error);
      }
    };
    fetchUserAddress();
  }, []);

  // 사용자 주소가 없으면 로딩 상태 표시
  if (!userAddress) {
    return (
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Follow" component={FollowScreen} />
          <Stack.Screen name="Reward">
            {(props) => <RewardScreen {...props} userAddress={userAddress} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
