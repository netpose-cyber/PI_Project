
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const PaymentScreen = () => {
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:5000/create-payment', {
                amount,
                memo,
                metadata: { user: 'test_user' },
            });

            Alert.alert('결제 요청 성공', `결제 ID: ${response.data.identifier}`);
        } catch (error) {
            Alert.alert('오류 발생', error.message);
        }
    };

    return (
        <View>
            <Text>Pi 코인 결제</Text>
            <TextInput
                placeholder="금액"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="메모"
                value={memo}
                onChangeText={setMemo}
            />
            <Button title="결제 요청" onPress={handlePayment} />
        </View>
    );
};
