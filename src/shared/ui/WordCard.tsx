import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Typography } from './Typography';

const WordCard = ({
  word,
  onPress,
}: {
  word: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.wordCard}>
      <Typography family="semiBold" size={22} color="white" onPress={onPress}>
        {word}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wordCard: {
    padding: 16,
    height: 60,
    justifyContent: 'center',
  },
});

export default WordCard;
