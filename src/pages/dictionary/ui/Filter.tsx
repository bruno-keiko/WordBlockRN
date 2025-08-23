import React from 'react';
import { Button } from '@/shared/ui';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/shared/constants/theme';

const Filter = ({
  activeFilter = 'all',
  setActiveFilter,
}: {
  activeFilter: 'all' | 'learned' | 'notLearned';
  setActiveFilter: (filter: 'all' | 'learned' | 'notLearned') => void;
}) => {
  return (
    <View style={styles.container}>
      <Button
        style={activeFilter === 'all' ? styles.buttonActive : styles.button}
        title="All"
        onPress={() => setActiveFilter('all')}
      />
      <Button
        style={activeFilter === 'learned' ? styles.buttonActive : styles.button}
        title="Learned"
        onPress={() => setActiveFilter('learned')}
      />
      <Button
        style={
          activeFilter === 'notLearned' ? styles.buttonActive : styles.button
        }
        title="Not learned"
        onPress={() => setActiveFilter('notLearned')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    height: 36,
    width: '30%',
    backgroundColor: `${theme.colors.white}90`,
  },
  buttonActive: {
    height: 36,
    width: '30%',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
  },
});

export default Filter;
