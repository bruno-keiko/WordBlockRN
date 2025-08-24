import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Word } from '@/entity/word/interface';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/ui';
import { theme } from '@/shared/constants/theme';

type RootStackParamList = {
  Dictionary: undefined;
  WordPage: { word: Word };
};

type WordPageRouteProp = RouteProp<RootStackParamList, 'WordPage'>;

const WordPage = () => {
  const route = useRoute<WordPageRouteProp>();
  const { word } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.card}>
        <View style={styles.wordHeader}>
          <Text style={styles.wordTitle}>{word.word}</Text>
        </View>

        <View style={styles.definitionSection}>
          <Text style={styles.sectionLabel}>Definition</Text>
          <Text style={styles.definition}>{word.definition}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.learnButton}
          title="Start Learning"
          onPress={() => {
            // Add your learn functionality here
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  wordHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  wordTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  definitionSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  definition: {
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.white,
    textAlign: 'left',
  },
  buttonContainer: {
    paddingHorizontal: 4,
  },
  backButton: {
    height: 60,
    width: 60,
    borderRadius: 40,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  learnButton: {
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default WordPage;
