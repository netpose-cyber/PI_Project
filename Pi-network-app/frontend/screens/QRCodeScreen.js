
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import axios from 'axios';

const QRCodeScreen = () => {
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [qrCode, setQrCode] = useState(null);

    const generateQRCode = async () => {
        try {
            const response = await axios.post('http://localhost:5000/generate-qr', {
                amount,
                memo,
            });

            setQrCode(response.data.qrCodeUrl);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Text>Pi 코인 결제 QR 코드 생성</Text>
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
            <Button title="QR 코드 생성" onPress={generateQRCode} />
            {qrCode && <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />}
        </View>
    );
};
