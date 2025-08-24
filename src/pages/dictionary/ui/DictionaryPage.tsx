import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Input } from '@/shared/ui';
import WordList from '@widgets/word-list/ui/WordList';
import { theme } from '@/shared/constants/theme';
import { StyleSheet } from 'react-native';
import { useWordFetching } from '@/entity/word/useWordFetching';
import Filter from './Filter';
import RandomWordButton from './RandomWordButton';
import { AddWordButton } from '@/feature/add-word';
import { useUsageBlocking } from '@/shared/lib/utils/useUsageBlocking';
import BlockScreen from '../../BlockScreen';
import PermissionSetup from '../../PermissionSetup';
import BlockingSettings from '../../BlockingSettings';
import { updateLearned } from '@/feature/learn-word';

const DictionaryPage = () => {
  const [currentScreen, setCurrentScreen] = useState<
    'permission' | 'main' | 'settings'
  >('permission');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'learned' | 'notLearned'
  >('all');

  const { words, loadMore, loading } = useWordFetching({
    query: searchQuery,
    filter: activeFilter,
  });

  // Memoize the callback functions to prevent unnecessary re-renders
  const handleWordLearned = React.useCallback((wordId: number) => {
    console.log('Word learned:', wordId);
    // Add your word learning logic here if needed
    updateLearned(wordId, true);
  }, []);

  const handleBlockTriggered = React.useCallback(() => {
    console.log('Screen time block triggered');

    // Add any additional logic when block is triggered
  }, []);

  const {
    isBlocked,
    currentBlockWord,
    hasPermission,
    usageStats,
    requestPermission,
    completeLearningSesssion,
    setBlockingInterval,
    enableDevelopmentMode,
  } = useUsageBlocking({
    words,
    onWordLearned: handleWordLearned,
    onBlockTriggered: handleBlockTriggered,
  });

  console.log('Usage stats:', isBlocked);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const initializeDevelopmentMode = () => {
      try {
        timeoutId = setTimeout(() => {
          enableDevelopmentMode(true, 10);
          console.log('Development mode initialized');
        }, 1000);
      } catch (error) {
        console.error('Error initializing development mode:', error);
      }
    };

    initializeDevelopmentMode();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handlePermissionGranted = React.useCallback(() => {
    setTimeout(() => {
      if (hasPermission) {
        setCurrentScreen('main');
      } else {
        Alert.alert(
          'Permission not detected',
          'Please make sure you granted the permission.',
        );
      }
    }, 500);
  }, [hasPermission]);

  if (isBlocked && currentBlockWord) {
    return (
      <BlockScreen
        onWordLearned={completeLearningSesssion}
        currentWord={currentBlockWord}
      />
    );
  }

  if (!hasPermission && currentScreen === 'permission') {
    return (
      <PermissionSetup
        onPermissionGranted={handlePermissionGranted}
        onRequestPermission={requestPermission}
        hasPermission={hasPermission}
      />
    );
  }

  if (currentScreen === 'settings') {
    return (
      <View style={styles.container}>
        <BlockingSettings
          onIntervalChange={setBlockingInterval}
          onDevelopmentModeChange={enableDevelopmentMode}
          usageStats={usageStats}
        />

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('main')}
          >
            <Text style={styles.backButtonText}>← Back to Dictionary</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Search words..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setCurrentScreen('settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <WordList
        words={words}
        onEndReached={loadMore}
        loading={loading}
        hasMore={true}
        activeFilter={activeFilter}
      />

      <View style={styles.buttonContainer}>
        <RandomWordButton />
        <AddWordButton />
      </View>

      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Debug: {isBlocked ? 'BLOCKED' : 'ACTIVE'} | Permission:{' '}
            {hasPermission ? 'YES' : 'NO'} | Words: {words.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  navigationContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default DictionaryPage;
