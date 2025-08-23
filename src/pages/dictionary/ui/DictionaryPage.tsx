import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@/shared/ui';
import WordList from '@widgets/word-list/ui/WordList';
import { theme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';
import { useWordFetching } from '@/entity/word/useWordFetching';
import Filter from './Filter';

const DictionaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'learned' | 'notLearned'>('all');
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
