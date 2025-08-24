import React from 'react';
import { Button } from '@/shared/ui';
import { StyleSheet } from 'react-native';
import { theme } from '@/shared/constants/theme';
import { useNavigation } from '@react-navigation/native';

const AddWordButton = () => {
  const navigation = useNavigation();
  return (
    <Button
      titleStyle={styles.titleStyle}
      title="+"
      onPress={() => navigation.navigate('AddWordPage')}
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
