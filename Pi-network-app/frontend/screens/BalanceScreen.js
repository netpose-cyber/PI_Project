
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BalanceScreen = ({ userId }) => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/balance/${userId}`);
                setBalance(response.data.balance);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    return (
        <View>
            <Text>내 Pi 코인 잔액</Text>
            {loading ? <ActivityIndicator size="large" /> : <Text>{balance} Pi</Text>}
        </View>
    );
};
