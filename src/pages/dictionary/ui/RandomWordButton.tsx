import React from 'react';
import { Button } from '@/shared/ui';
import { WordRepository } from '@/entity/word/repository';
import { useNavigation } from '@react-navigation/native';

const RandomWordButton = () => {
  const navigation = useNavigation();
  const handleRandomWord = () => {
    WordRepository.getRandomUnlearnedWord().then(word => {
      console.log(word);
      if (!word) {
        return;
      }
      navigation.navigate('WordPage', { word });
    });
  };
  return (
    <Button
      style={{ flex: 1 }}
      title="Learn random word"
      onPress={handleRandomWord}
    />
  );
};

export default RandomWordButton;
