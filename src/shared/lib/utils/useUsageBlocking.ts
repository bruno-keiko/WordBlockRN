import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppState } from 'react-native';
import UsageStatsService from './UsageStatsService';
import { Word } from '@/entity/word/interface';
import { UsageStats } from './UsageStatsService';

interface UseUsageBlockingProps {
  words: Word[];
  onWordLearned: (wordId: number) => void;
  onBlockTriggered: () => void;
}

interface UseUsageBlockingReturn {
  isBlocked: boolean;
  currentBlockWord: Word | null;
  hasPermission: boolean;
  usageStats: UsageStats | null;
  requestPermission: () => Promise<void>;
  completeLearningSesssion: () => void;
  setBlockingInterval: (seconds: number) => void;
  enableDevelopmentMode: (enabled: boolean, seconds?: number) => void;
}

export const useUsageBlocking = ({
  words,
  onWordLearned,
  onBlockTriggered,
}: UseUsageBlockingProps): UseUsageBlockingReturn => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentBlockWord, setCurrentBlockWord] = useState<Word | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);

  // Memoize unlearned words to prevent frequent changes
  const unlearnedWords = useMemo(() => {
    return words.filter(word => !word.learned);
  }, [words]);

  // Use refs to prevent infinite loops
  const usageCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const blockEventListener = useRef<(() => void) | null>(null);
  const isBlockingInProgress = useRef(false);
  const selectedWordRef = useRef<Word | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Set up usage monitoring when permission is granted
  useEffect(() => {
    if (hasPermission && !isBlockingInProgress.current) {
      startUsageMonitoring();
    } else {
      stopUsageMonitoring();
    }

    return () => {
      stopUsageMonitoring();
    };
  }, [hasPermission]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && hasPermission && !isBlocked) {
        // Small delay to let the app fully activate
        setTimeout(checkUsageAndBlock, 500);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [hasPermission, isBlocked]);

  const checkPermission = async () => {
    try {
      const permission = await UsageStatsService.hasPermission();
      setHasPermission(permission);
      console.log('Permission status:', permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      setHasPermission(false);
    }
  };

  const requestPermission = useCallback(async () => {
    try {
      await UsageStatsService.requestPermission();
      // Check again after user returns from settings
      setTimeout(checkPermission, 2000);
    } catch (error) {
      console.error('Error requesting permission:', error);
      throw error;
    }
  }, []);

  const startUsageMonitoring = useCallback(() => {
    console.log('Starting usage monitoring...');

    // Clear any existing intervals
    stopUsageMonitoring();

    // Start periodic usage checking
    usageCheckInterval.current = setInterval(() => {
      if (!isBlockingInProgress.current) {
        checkUsageAndBlock();
      }
    }, 3000); // Check every 3 seconds

    // Listen for native block events
    blockEventListener.current = UsageStatsService.onShouldShowBlockScreen(
      data => {
        console.log('Native block event received:', data);
        if (!isBlockingInProgress.current) {
          triggerBlock();
        }
      },
    );

    // Start native monitoring
    try {
      UsageStatsService.startMonitoring();
    } catch (error) {
      console.error('Error starting native monitoring:', error);
    }
  }, []);

  const stopUsageMonitoring = useCallback(() => {
    console.log('Stopping usage monitoring...');

    if (usageCheckInterval.current) {
      clearInterval(usageCheckInterval.current);
      usageCheckInterval.current = null;
    }

    if (blockEventListener.current) {
      try {
        blockEventListener.current();
        blockEventListener.current = null;
      } catch (error) {
        console.error('Error removing listener:', error);
      }
    }
  }, []);

  const checkUsageAndBlock = async () => {
    if (isBlockingInProgress.current) {
      return;
    }

    try {
      const stats = await UsageStatsService.getCurrentUsage();
      setUsageStats(stats);

      if (stats.shouldBlock && !isBlocked) {
        console.log('Usage threshold exceeded, triggering block...');
        triggerBlock();
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const triggerBlock = useCallback(() => {
    if (isBlockingInProgress.current || isBlocked) {
      console.log('Block already in progress, skipping...');
      return;
    }

    if (unlearnedWords.length === 0) {
      console.log('No unlearned words available for blocking');
      return;
    }

    console.log(
      'Triggering block with',
      unlearnedWords.length,
      'unlearned words',
    );

    // Set blocking flag
    isBlockingInProgress.current = true;

    // Select a word only if we don't have one already
    if (!selectedWordRef.current) {
      const randomIndex = Math.floor(Math.random() * unlearnedWords.length);
      selectedWordRef.current = unlearnedWords[randomIndex];
    }

    setCurrentBlockWord(selectedWordRef.current);
    setIsBlocked(true);
    onBlockTriggered();

    console.log('Block triggered for word:', selectedWordRef.current?.word);
  }, [unlearnedWords, isBlocked, onBlockTriggered]);

  const completeLearningSesssion = useCallback(() => {
    console.log('Completing learning session...');

    if (currentBlockWord || selectedWordRef.current) {
      const wordToLearn = currentBlockWord || selectedWordRef.current;

      // Mark word as learned
      if (wordToLearn) {
        onWordLearned(wordToLearn.id);
        console.log('Word learned:', wordToLearn.word);
      }

      // Reset usage tracking
      try {
        UsageStatsService.resetUsageTracking();
      } catch (error) {
        console.error('Error resetting usage:', error);
      }

      // Clear blocking state
      setCurrentBlockWord(null);
      setIsBlocked(false);
      selectedWordRef.current = null;
      isBlockingInProgress.current = false;

      // Restart monitoring after a short delay
      setTimeout(() => {
        if (hasPermission) {
          startUsageMonitoring();
        }
      }, 1000);
    }
  }, [currentBlockWord, onWordLearned, hasPermission, startUsageMonitoring]);

  const setBlockingInterval = useCallback((seconds: number) => {
    try {
      if (seconds < 60) {
        // Development mode for intervals less than 1 minute
        UsageStatsService.setDevelopmentMode(true, seconds);
        console.log('Set development mode:', seconds, 'seconds');
      } else {
        // Production mode for longer intervals
        UsageStatsService.setDevelopmentMode(false);
        UsageStatsService.setBlockThreshold(Math.floor(seconds / 60));
        console.log(
          'Set production mode:',
          Math.floor(seconds / 60),
          'minutes',
        );
      }
    } catch (error) {
      console.error('Error setting blocking interval:', error);
    }
  }, []);

  const enableDevelopmentMode = useCallback(
    (enabled: boolean, seconds: number = 5) => {
      try {
        UsageStatsService.setDevelopmentMode(enabled, seconds);
        console.log('Development mode:', enabled ? `${seconds}s` : 'disabled');
      } catch (error) {
        console.error('Error setting development mode:', error);
      }
    },
    [],
  );

  return {
    isBlocked,
    currentBlockWord,
    hasPermission,
    usageStats,
    requestPermission,
    completeLearningSesssion,
    setBlockingInterval,
    enableDevelopmentMode,
  };
};
