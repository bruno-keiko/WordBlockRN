// src/screens/BlockScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import UsageStatsService from '@/shared/lib/utils/UsageStatsService';
import { Word } from '@/entity/word/interface';
import { theme } from '@/shared/constants/theme';
import { LearningStatsRepository } from '@/entity/statistics/repository';

interface BlockScreenProps {
  onWordLearned: () => void;
  currentWord: Word;
}

const BlockScreen: React.FC<BlockScreenProps> = ({
  onWordLearned,
  currentWord,
}) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Prevent back button from bypassing the block
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Learning Required',
          'You must complete the learning session to continue using the app.',
          [{ text: 'OK' }],
        );
        return true; // Prevent default back action
      },
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // Timer to track time spent on learning screen
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(elapsed);

      // Enable proceed button after 20 seconds
      if (elapsed >= 20) {
        setCanProceed(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleLearningComplete = () => {
    if (!canProceed) {
      Alert.alert(
        'Please wait',
        `You need to spend at least 20 seconds learning this word. ${
          20 - timeSpent
        } seconds remaining.`,
        [{ text: 'OK' }],
      );
      return;
    }

    // Reset usage tracking
    UsageStatsService.resetUsageTracking();
    
    LearningStatsRepository.incrementLearnedWord(
      timeSpent,
      new Date().toISOString(),
    );

    onWordLearned();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⏰ Time to Learn!</Text>
        <Text style={styles.subtitle}>
          You've reached your screen time limit. Learn a word to continue.
        </Text>
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.word}>{currentWord.word}</Text>
        <Text style={styles.definition}>{currentWord.definition}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Time spent learning:</Text>
        <Text style={styles.timer}>{formatTime(timeSpent)}</Text>
        <Text style={styles.requirement}>
          {canProceed
            ? '✅ Minimum time reached!'
            : `⏳ ${20 - timeSpent}s remaining`}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          canProceed ? styles.buttonEnabled : styles.buttonDisabled,
        ]}
        onPress={handleLearningComplete}
        disabled={!canProceed}
      >
        <Text
          style={[
            styles.buttonText,
            canProceed ? styles.buttonTextEnabled : styles.buttonTextDisabled,
          ]}
        >
          I learned it!
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Take your time to really understand the word meaning
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  wordCard: {
    backgroundColor: '#2a2a2a',
    padding: 30,
    borderRadius: 15,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  definition: {
    fontSize: 18,
    color: `${theme.colors.white}`,
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerLabel: {
    fontSize: 16,
    color: theme.colors.white,
    marginBottom: 5,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 10,
  },
  requirement: {
    fontSize: 14,
    color: theme.colors.yellow,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonEnabled: {
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextEnabled: {
    color: theme.colors.black,
  },
  buttonTextDisabled: {
    color: theme.colors.white,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.white,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default BlockScreen;
