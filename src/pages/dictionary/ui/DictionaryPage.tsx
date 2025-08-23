import React from 'react';
import { View } from 'react-native';
import { Input, Button } from '@/shared/ui';
import WordList from '@widgets/word-list/ui/WordList';
import { theme } from '@/shared/constants/theme';

import { StyleSheet } from 'react-native';

const DictionaryPage = () => {
  return (
    <View style={styles.container}>
      <Input placeholder="Search" onChangeText={() => {}} />
      <WordList />
      <Button title="Button" onPress={() => {}} />
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
