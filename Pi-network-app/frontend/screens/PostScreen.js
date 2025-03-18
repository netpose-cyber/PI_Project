
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const PostScreen = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts');
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    const handlePost = async () => {
        try {
            await axios.post('http://localhost:5000/post', { userId, content });
            setContent("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Text>게시판</Text>
            <TextInput placeholder="게시글 작성" value={content} onChangeText={setContent} />
            <Button title="작성" onPress={handlePost} />
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.content} - 좋아요 {item.likes}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default PostScreen;
