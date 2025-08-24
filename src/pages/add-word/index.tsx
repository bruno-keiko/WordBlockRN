import AddWordForm from '@/feature/add-word/ui/AddWordForm';
import React from 'react';
import { ScrollView } from 'react-native';
import { theme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';

const AddWordPage = () => {
  return (
    <ScrollView style={styles.container}>
      <AddWordForm />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}); 

export default AddWordPage;
