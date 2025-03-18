import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// 기본 스타일 정의
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  disabledText: {
    color: '#ccc',
  },
});

const Button = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
