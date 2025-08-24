import { theme } from '@/shared/constants/theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

interface BlockingSettingsProps {
  onIntervalChange: (seconds: number) => void;
  onDevelopmentModeChange: (enabled: boolean, seconds?: number) => void;
  usageStats: any;
}

const BlockingSettings: React.FC<BlockingSettingsProps> = ({
  onIntervalChange,
  onDevelopmentModeChange,
  usageStats,
}) => {
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState(5);

  const developmentIntervals = [
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '30 seconds', value: 30 },
    { label: '1 minute', value: 60 },
  ];

  const productionIntervals = [
    { label: '15 minutes', value: 15 * 60 },
    { label: '20 minutes', value: 20 * 60 },
    { label: '30 minutes', value: 30 * 60 },
    { label: '60 minutes', value: 60 * 60 },
  ];

  const handleDevelopmentModeToggle = (value: boolean) => {
    setIsDevelopmentMode(value);

    if (value) {
      onDevelopmentModeChange(true, selectedInterval);
      Alert.alert(
        'Development Mode Enabled',
        'Perfect for testing! The app will block after just a few seconds.',
        [{ text: 'OK' }],
      );
    } else {
      onDevelopmentModeChange(false);
      const productionInterval = 15 * 60; // 15 minutes
      setSelectedInterval(productionInterval);
      onIntervalChange(productionInterval);
      Alert.alert(
        'Production Mode Enabled',
        'Using real screen time data with longer intervals.',
        [{ text: 'OK' }],
      );
    }
  };

  const handleIntervalChange = (seconds: number) => {
    setSelectedInterval(seconds);
    onIntervalChange(seconds);

    if (isDevelopmentMode) {
      onDevelopmentModeChange(true, seconds);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const intervals = isDevelopmentMode
    ? developmentIntervals
    : productionIntervals;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Blocking Settings</Text>

      <View style={styles.setting}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Development Mode</Text>
          <Text style={styles.settingDescription}>
            {isDevelopmentMode
              ? 'Use short intervals for testing'
              : 'Use real screen time monitoring'}
          </Text>
        </View>
        <Switch
          value={isDevelopmentMode}
          onValueChange={handleDevelopmentModeToggle}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={isDevelopmentMode ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isDevelopmentMode ? 'Test Intervals' : 'Screen Time Limits'}
        </Text>
        <Text style={styles.sectionDescription}>
          {isDevelopmentMode
            ? 'How long before showing a learning screen (for testing)'
            : 'How much screen time before requiring vocabulary learning'}
        </Text>

        {intervals.map(interval => (
          <TouchableOpacity
            key={interval.value}
            style={[
              styles.intervalButton,
              selectedInterval === interval.value &&
                styles.intervalButtonSelected,
            ]}
            onPress={() => handleIntervalChange(interval.value)}
          >
            <Text
              style={[
                styles.intervalButtonText,
                selectedInterval === interval.value &&
                  styles.intervalButtonTextSelected,
              ]}
            >
              {interval.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {usageStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Current Usage</Text>
          {usageStats.isDevelopmentMode ? (
            <>
              <Text style={styles.statText}>
                ⏱️ Usage: {Math.floor(usageStats.usageSeconds || 0)}s
              </Text>
              <Text style={styles.statText}>
                🎯 Limit: {formatTime(usageStats.thresholdSeconds || 0)}
              </Text>
              <Text
                style={[
                  styles.statText,
                  { color: usageStats.shouldBlock ? '#f44336' : '#4CAF50' },
                ]}
              >
                📊 Status: {usageStats.shouldBlock ? 'WILL BLOCK' : 'ACTIVE'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.statText}>
                ⏱️ Usage: {Math.floor(usageStats.usageMinutes || 0)}m
              </Text>
              <Text style={styles.statText}>
                🎯 Limit: {formatTime((usageStats.thresholdMinutes || 0) * 60)}
              </Text>
              <Text
                style={[
                  styles.statText,
                  { color: usageStats.shouldBlock ? '#f44336' : '#4CAF50' },
                ]}
              >
                📊 Status: {usageStats.shouldBlock ? 'WILL BLOCK' : 'ACTIVE'}
              </Text>
            </>
          )}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>💡 How it works</Text>
        <Text style={styles.infoText}>
          • {isDevelopmentMode ? 'Development mode' : 'Production mode'} tracks
          your {isDevelopmentMode ? 'app session time' : 'daily screen time'}
        </Text>
        <Text style={styles.infoText}>
          • When you reach the limit, you'll see a learning screen
        </Text>
        <Text style={styles.infoText}>
          • Spend 20+ seconds learning a word to continue
        </Text>
        <Text style={styles.infoText}>
          • Your progress is tracked in statistics
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 30,
    textAlign: 'center',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.white,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.white,
    marginBottom: 20,
    lineHeight: 20,
  },
  intervalButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  intervalButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  intervalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  intervalButtonTextSelected: {
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.white,
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    color: theme.colors.yellow,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default BlockingSettings;
