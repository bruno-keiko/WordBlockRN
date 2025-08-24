import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@/shared/ui';
import WordList from '@widgets/word-list/ui/WordList';
import { theme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';
import { useWordFetching } from '@/entity/word/useWordFetching';
import Filter from './Filter';
import RandomWordButton from './RandomWordButton';
import { AddWordButton } from '@/feature/add-word';

const DictionaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'learned' | 'notLearned'
  >('all');
  const { words, loadMore, loading } = useWordFetching({
    query: searchQuery,
    filter: activeFilter,
  });

  return (
    <View style={styles.container}>
      <Input
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <WordList
        words={words}
        onEndReached={loadMore}
        loading={loading}
        hasMore={true}
      />
      <View style={styles.buttonContainer}>
        <RandomWordButton />
        <AddWordButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
});

export default DictionaryPage;
