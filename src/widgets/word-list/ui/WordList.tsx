import React, { useRef } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { WordCard, Typography } from '../../../shared/ui';
import { Word } from '@/entity/word/interface';
import { theme } from '@/shared/constants/theme';
import { useNavigation } from '@react-navigation/native';

const ListEmptyComponent = ({
  activeFilter,
}: {
  activeFilter: 'all' | 'learned' | 'notLearned';
}) => {
  const message =
    activeFilter === 'notLearned'
      ? 'You have no unlearned words. Add new words or review learned words.'
      : 'No words found. Try a different filter or add new words.';
  return (
    <View style={styles.empty}>
      <Typography>{message}</Typography>
    </View>
  );
};

const ListFooterComponent = () => {
  return <View style={styles.footer} />;
};

const Separator = () => {
  return <View style={styles.separator} />;
};

const WordList = ({
  words,
  onEndReached,
  loading,
  activeFilter,
}: {
  words: Word[];
  onEndReached: () => void;
  loading: boolean;
  hasMore: boolean;
  activeFilter: 'all' | 'learned' | 'notLearned';
}) => {
  const onEndReachedCalledDuringMomentum = useRef(true);
  const navigation = useNavigation();

  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard
      word={item.id + ') ' + item.word}
      onPress={() => {
        navigation.navigate('WordPage', { word: item });
      }}
    />
  );

  const keyExtractor = (item: Word) => item.id.toString();

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum.current && !loading) {
      onEndReached();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  return (
    <FlatList
      data={words}
      contentContainerStyle={styles.container}
      renderItem={renderWordItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => {
        onEndReachedCalledDuringMomentum.current = false;
      }}
      ListFooterComponent={loading ? ListFooterComponent : null}
      ListEmptyComponent={
        !loading ? <ListEmptyComponent activeFilter={activeFilter} /> : null
      }
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 2,
    backgroundColor: theme.colors.backgroundSecondary,
  },
});

export default WordList;
