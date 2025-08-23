import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@/shared/ui';
import WordList from '@widgets/word-list/ui/WordList';
import { theme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';
import { useWordFetching } from '@/entity/word/useWordFetching';

const DictionaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { words } = useWordFetching();

  console.log('words', words);
  return (
    <View style={styles.container}>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <WordList words={words} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
});

export default DictionaryPage;
