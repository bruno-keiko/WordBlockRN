import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { theme } from '../constants/theme';

interface InputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
}
const Input = ({ placeholder, onChangeText, value }: InputProps) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    padding: 20,
    color: theme.colors.foreground,
  },
});

export default Input;
