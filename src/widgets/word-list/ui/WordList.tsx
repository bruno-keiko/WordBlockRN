import React from 'react';
import { ScrollView } from 'react-native';
import { WordCard } from '../../../shared/ui';
import { Word } from '@/entity/word/interface';

const WordList = ({ words }: { words: Word[] }) => {
  return (
    <ScrollView>
      {words.map((word, index) => (
        <WordCard key={index} word={word.word} onPress={() => {}} />
      ))}
    </ScrollView>
  );
};

export default WordList;
