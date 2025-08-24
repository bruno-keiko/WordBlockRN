import React, { useRef } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { WordCard } from '../../../shared/ui';
import { Word } from '@/entity/word/interface';
import { theme } from '@/shared/constants/theme';
import { useNavigation } from '@react-navigation/native';

const ListEmptyComponent = () => {
  return <View style={styles.empty} />;
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
}: {
  words: Word[];
  onEndReached: () => void;
  loading: boolean;
  hasMore: boolean;
}) => {
  const onEndReachedCalledDuringMomentum = useRef(true);
  const navigation = useNavigation();

  const renderWordItem = ({ item }: { item: Word }) => (
    <WordCard
      word={item.id + ') ' + item.word}
      onPress={() => {
        navigation.navigate('WordPage');
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
      ListEmptyComponent={!loading ? ListEmptyComponent : null}
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
