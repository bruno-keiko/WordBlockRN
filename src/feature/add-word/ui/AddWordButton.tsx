import React from 'react';
import { Button } from '@/shared/ui';
import { StyleSheet } from 'react-native';
import { theme } from '@/shared/constants/theme';

const AddWordButton = () => {
  return (
    <Button
      titleStyle={styles.titleStyle}
      title="+"
      onPress={() => {}}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    width: 54,
    height: 54,
    borderRadius: 54 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 32,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
  },
});

export default AddWordButton;
