import { useBlocking } from '../../BlockingContext';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DevelopmentSettings = () => {
  const { isServiceActive, remainingSeconds, startBlocking, stopBlocking } =
    useBlocking();
  const [selectedMinutes, setSelectedMinutes] = useState(15);

  const timePresets = [
    { label: '1 min', value: 1 },
    { label: '15 mins', value: 15 },
    { label: '20 mins', value: 20 },
    { label: '30 mins', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1 day', value: 1440 }
  ];

  useEffect(() => {
    AsyncStorage.getItem('delayMinutes').then(value => {
      if (value !== null) {
        setSelectedMinutes(parseInt(value, 10));
      }
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTimeSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    AsyncStorage.setItem('delayMinutes', minutes.toString());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>App Blocker</Text>
        <Text style={styles.subtitle}>Stay focused and productive</Text>
      </View>

      {isServiceActive ? (
        <View style={styles.activeCard}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Service Active</Text>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {formatTime(remainingSeconds)}
            </Text>
            <Text style={styles.timerLabel}>until blocking starts</Text>
          </View>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopBlocking}
            activeOpacity={0.8}
          >
            <Text style={styles.stopButtonText}>Stop Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.setupCard}>
          <Text style={styles.sectionTitle}>Choose blocking delay</Text>
          
          <View style={styles.presetsContainer}>
            {timePresets.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.presetButton,
                  selectedMinutes === preset.value && styles.presetButtonSelected
                ]}
                onPress={() => handleTimeSelect(preset.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedMinutes === preset.value && styles.presetTextSelected
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.selectedTimeContainer}>
            <Text style={styles.selectedTimeLabel}>Selected delay:</Text>
            <Text style={styles.selectedTimeValue}>
              {selectedMinutes < 60
                ? `${selectedMinutes} minute${selectedMinutes !== 1 ? 's' : ''}`
                : selectedMinutes === 60
                ? '1 hour'
                : '1 day'
              }
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => startBlocking(selectedMinutes)}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Blocking Service</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          💡 Make sure to grant all required permissions for the app blocker to work effectively.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '700',
    marginBottom: 24,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  setupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  presetButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: 80,
    alignItems: 'center',
  },
  presetButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  presetTextSelected: {
    color: '#ffffff',
  },
  selectedTimeContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedTimeLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedTimeValue: {
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '700',
  },
  startButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default DevelopmentSettings;