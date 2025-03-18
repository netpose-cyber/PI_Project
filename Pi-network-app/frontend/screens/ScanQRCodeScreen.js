
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';

const ScanQRCodeScreen = ({ navigation }) => {
    const [scannedData, setScannedData] = useState(null);

    const handleBarCodeRead = async ({ data }) => {
        setScannedData(data);
        const { amount, memo } = JSON.parse(data);

        try {
            const response = await axios.post('http://localhost:5000/create-payment', {
                amount,
                memo,
                metadata: { user: 'payer_user' },
            });

            Alert.alert('결제 성공', `결제 ID: ${response.data.identifier}`);
            navigation.goBack();
        } catch (error) {
            Alert.alert('오류 발생', error.message);
        }
    };

    return (
        <View>
            <Text>QR 코드 스캔하여 결제</Text>
            <RNCamera
                style={{ width: '100%', height: 400 }}
                onBarCodeRead={scannedData ? undefined : handleBarCodeRead}
            />
            <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
        </View>
    );
};
