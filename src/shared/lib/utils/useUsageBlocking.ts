import React, { use, useEffect } from 'react';
import UsageStatsService, {
  UsageStats,
} from '@/shared/lib/utils/UsageStatsService';
import { Word } from '@/entity/word/interface';

const checkPermission = async () => {
  const hasPermission = await UsageStatsService.hasPermission();
  return hasPermission;
};

export const useUsageBlocking = ({
  words,
  onWordLearned,
  onBlockTriggered,
}: {
  words: Word[];
  onWordLearned: (wordId: number) => void;
  onBlockTriggered: () => void;
}) => {
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [currentBlockWord, setCurrentBlockWord] = React.useState<Word | null>(
    null,
  );
  const [hasPermission, setHasPermission] = React.useState(false);
  const [usageStats, setUsageStats] = React.useState<UsageStats | null>(null);

  useEffect(() => {
    requestPermission();
    getRandomWord();
  }, []);

  const requestPermission = async () => {
    const hasPermission = await checkPermission();
    if (!hasPermission) {
      UsageStatsService.requestPermission().then(() => {
        checkPermission().then(permission => {
          setHasPermission(permission);
        });
      });
    }
    setHasPermission(hasPermission);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateUsageStats();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateUsageStats = async () => {
    const usageStats = await UsageStatsService.getCurrentUsage();
    setUsageStats(usageStats);
    if (usageStats.shouldBlock) {
      onBlockTriggered();
      setIsBlocked(true);
    }
  };

  const getRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentBlockWord(randomWord);
  };

  const completeLearningSesssion = () => {
    setIsBlocked(false);
    getRandomWord();
    UsageStatsService.resetUsageTracking();
  };

  const setBlockingInterval = (interval: number) => {
    UsageStatsService.setDevelopmentMode(true, interval);
  };

  const enableDevelopmentMode = (enabled: boolean, interval: number = 5) => {
    UsageStatsService.setDevelopmentMode(enabled, interval);
  };

  console.log('isBlocked', isBlocked);
  console.log('currentBlockWord', currentBlockWord);
  console.log('hasPermission', hasPermission);
  console.log('usageStats', usageStats);

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
