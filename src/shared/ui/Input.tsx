import React from 'react';
import {
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '../constants/theme';

interface InputProps extends TextInputProps {
  placeholder: string;
  onChangeText?: (text: string) => void;
  value?: string;
  style?: StyleProp<ViewStyle>;
}
const Input = ({
  placeholder,
  onChangeText,
  value,
  style,
  ...props
}: InputProps) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      {...props}
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
