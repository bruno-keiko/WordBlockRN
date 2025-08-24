// src/components/DevelopmentSettings.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import UsageStatsService from '@/shared/lib/utils/UsageStatsService';

const DevelopmentSettings: React.FC = () => {
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState(5);
  const [currentUsage, setCurrentUsage] = useState<any>(null);

  useEffect(() => {
    // Enable development mode by default
    UsageStatsService.setDevelopmentMode(true, 5);
    
    // Check usage every second in development mode
    const interval = setInterval(checkUsage, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkUsage = async () => {
    try {
      const usage = await UsageStatsService.getCurrentUsage();
      setCurrentUsage(usage);
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  };

  const handleDevelopmentModeToggle = (value: boolean) => {
    setIsDevelopmentMode(value);
    
    if (value) {
      UsageStatsService.setDevelopmentMode(true, selectedInterval);
      Alert.alert(
        'Development Mode Enabled',
        `App will block after ${selectedInterval} seconds of usage.`,
        [{ text: 'OK' }]
      );
    } else {
      UsageStatsService.setDevelopmentMode(false);
      Alert.alert(
        'Development Mode Disabled',
        'App will use real usage stats with 15+ minute intervals.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleIntervalChange = (seconds: number) => {
    setSelectedInterval(seconds);
    if (isDevelopmentMode) {
      UsageStatsService.setDevelopmentMode(true, seconds);
    }
  };

  const handleResetUsage = () => {
    UsageStatsService.resetUsageTracking();
    Alert.alert('Usage Reset', 'Usage timer has been reset!');
  };

  const developmentIntervals = UsageStatsService.getDevelopmentIntervals();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Development Settings</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Development Mode</Text>
        <Switch
          value={isDevelopmentMode}
          onValueChange={handleDevelopmentModeToggle}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={isDevelopmentMode ? '#fff' : '#f4f3f4'}
        />
      </View>

      {isDevelopmentMode && (
        <>
          <Text style={styles.sectionTitle}>Block Interval (Development)</Text>
          {developmentIntervals.map((interval) => (
            <TouchableOpacity
              key={interval.value}
              style={[
                styles.intervalButton,
                selectedInterval === interval.value && styles.intervalButtonSelected
              ]}
              onPress={() => handleIntervalChange(interval.value)}
            >
              <Text style={[
                styles.intervalButtonText,
                selectedInterval === interval.value && styles.intervalButtonTextSelected
              ]}>
                {interval.label}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {currentUsage && (
        <View style={styles.usageInfo}>
          <Text style={styles.usageTitle}>Current Usage</Text>
          {currentUsage.isDevelopmentMode ? (
            <>
              <Text style={styles.usageText}>
                Usage: {Math.floor(currentUsage.usageSeconds)}s / {currentUsage.thresholdSeconds}s
              </Text>
              <Text style={styles.usageText}>
                Status: {currentUsage.shouldBlock ? '🔴 BLOCKED' : '🟢 ACTIVE'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.usageText}>
                Usage: {Math.floor(currentUsage.usageMinutes)}m / {currentUsage.thresholdMinutes}m
              </Text>
              <Text style={styles.usageText}>
                Status: {currentUsage.shouldBlock ? '🔴 BLOCKED' : '🟢 ACTIVE'}
              </Text>
            </>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={handleResetUsage}>
        <Text style={styles.resetButtonText}>Reset Usage Timer</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Development mode uses a simple timer instead of Android's UsageStatsManager.
          This allows for testing with intervals as short as 5 seconds.
        </Text>
        <Text style={styles.infoText}>
          📱 Production mode requires 15+ minute intervals due to Android system limitations.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
  },
  intervalButton: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  intervalButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  intervalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  intervalButtonTextSelected: {
    fontWeight: 'bold',
  },
  usageInfo: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usageText: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 5,
  },
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 10,
  },
});

export default DevelopmentSettings;