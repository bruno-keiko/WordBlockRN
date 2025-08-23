import React from 'react';
import { ScrollView } from 'react-native';
import { WordCard } from '../../../shared/ui';

const WordList = () => {
  return (
    <ScrollView>
      {Array.from({ length: 30 }).map((_, index) => (
        <WordCard key={index} word="word" onPress={() => {}} />
      ))}
    </ScrollView>
  );
};

export default WordList;
