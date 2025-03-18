
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const TransactionHistoryScreen = ({ userId }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/transactions/${userId}`);
                setTransactions(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <View>
            <Text>거래 내역</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.type === 'receive' ? '받음' : '보냄'}: {item.amount} Pi</Text>
                        <Text>메모: {item.memo}</Text>
                        <Text>날짜: {new Date(item.date).toLocaleString()}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default TransactionHistoryScreen;
