import React from 'react';
import { StyleProp, ViewStyle, StyleSheet, Pressable } from 'react-native';
import { theme } from '../constants/theme';
import { Typography } from './Typography';

interface ButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  title: string;
  backgroundColor?: string;
  height?: number;
  borderRadius?: number;
  marginHorizontal?: number;
  marginTop?: number;
  disabled?: boolean;
}

const Button = ({
  onPress,
  style,
  disabled,
  title,
  backgroundColor = theme.colors.white,
  height = 54,
  borderRadius = 16,
  marginHorizontal,
  marginTop = 20,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor,
          height,
          borderRadius,
          marginHorizontal,
          marginTop,
        },
        style,
      ]}
    >
      <Typography family="bold" size={16} color="black">
        {title}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 32,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.foregroundSecondary,
  },
});

export default Button;
