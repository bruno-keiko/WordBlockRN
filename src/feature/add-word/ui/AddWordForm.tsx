import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, Input } from '@/shared/ui';
import { createWord } from '../model/createWord';
import { theme } from '@/shared/constants/theme';
import { Keyboard } from 'react-native';

const AddWordForm = () => {
  const [word, setWord] = React.useState('');
  const [definition, setDefinition] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    word?: string;
    definition?: string;
  }>({});

  const handleAddWord = async () => {
    let valid = true;
    let newErrors: { word?: string; definition?: string } = {};
    if (!word.trim()) {
      newErrors.word = 'Word is required';
      valid = false;
    }
    if (!definition.trim()) {
      newErrors.definition = 'Definition is required';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);
    setLoading(true);
    try {
      await createWord(word, definition);
      Alert.alert('Success', 'Word added successfully!');
    } catch (error) {
      console.error('Failed to add word:', error);
      Alert.alert('Error', 'Failed to add word');
    } finally {
      setLoading(false);
      setWord('');
      setDefinition('');
      setErrors({});
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add a New Word</Text>

        <Input value={word} onChangeText={setWord} placeholder="Enter word" />
        {errors.word && <Text style={styles.error}>{errors.word}</Text>}

        <Input
          value={definition}
          onChangeText={setDefinition}
          placeholder="Enter definition"
          style={{ height: 100, textAlignVertical: 'top' }}
          multiline
        />
        {errors.definition && (
          <Text style={styles.error}>{errors.definition}</Text>
        )}

        <Button title="Add Word" onPress={handleAddWord} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
  },
  error: {
    color: theme.colors.red,
    marginBottom: 10,
  },
});

export default AddWordForm;
