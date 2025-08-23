import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { TColor, TFont, theme } from '../constants/theme';

interface Props extends TextProps {
  children: React.ReactNode;
  uppercase?: boolean;
  family?: TFont;
  color?: TColor;
  size?: number;
  style?: TextProps['style'];
}

export const Typography: React.FC<Props> = ({
  children,
  family = 'medium',
  size = 14,
  color = 'foreground',
  uppercase = false,
  style,
  ...props
}) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: theme.fonts[family],
      fontSize: size,
      color: theme.colors[color],
      textTransform: uppercase ? 'uppercase' : 'none',
      transform: [{ translateY: -1 }],
    },
  });

  return (
    <Text {...props} style={[styles.text, style]}>
      {children}
    </Text>
  );
};
