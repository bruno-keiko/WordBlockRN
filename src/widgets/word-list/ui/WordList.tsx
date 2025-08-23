import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { WordCard } from '../../../shared/ui';
import { Word } from '@/entity/word/interface';
import { theme } from '@/shared/constants/theme';

const ListFooterComponent = () => {
  return <View style={styles.footer} />;
};

const ListEmptyComponent = () => {
  return <View style={styles.empty} />;
};

const Separator = () => {
  return <View style={styles.separator} />;
};

const WordList = ({ words }: { words: Word[] }) => {
  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard word={item.word} onPress={() => {}} />
  );

  const keyExtractor = (item: Word) => item.id.toString();

  const handleEndReached = () => {
    console.log('End reached');
  };

  return (
    <FlatList
      data={words}
      contentContainerStyle={styles.container}
      renderItem={renderWordItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={Separator}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  footer: {
    height: 50,
  },
  empty: {
    height: 50,
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.backgroundSecondary,
  },
});

export default WordList;
