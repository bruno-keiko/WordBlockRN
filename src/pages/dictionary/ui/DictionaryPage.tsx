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
        placeholder="Search words..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <WordList
        words={words}
        onEndReached={loadMore}
        loading={loading}
        hasMore={true}
        activeFilter={activeFilter}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  navigationContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DictionaryPage;
