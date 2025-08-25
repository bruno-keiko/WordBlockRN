import { LocaleDirContext } from '@react-navigation/native';
import { useBlocking } from '../../BlockingContext';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DevelopmentSettings = () => {
  const { isServiceActive, remainingSeconds, startBlocking, stopBlocking } =
    useBlocking();
  const [delayMinutes, setDelayMinutes] = useState('15');

  useEffect(() => {
    AsyncStorage.getItem('delayMinutes').then(value => {
      if (value !== null) {
        setDelayMinutes(value);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Blocker Settings</Text>

      {isServiceActive ? (
        <View style={styles.timerContainer}>
          <Text style={styles.statusText}>Service is active!</Text>
          <Text style={styles.timerText}>
            Blocking in: {formatTime(remainingSeconds)}
          </Text>
          <Button title="Stop Service" onPress={stopBlocking} color="#c0392b" />
        </View>
      ) : (
        <View style={styles.controlsContainer}>
          <Text style={styles.label}>Block after (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={delayMinutes}
            onChangeText={value => {
              setDelayMinutes(value);
              AsyncStorage.setItem('delayMinutes', value);
            }}
          />
          <Button
            title="Start Blocking Service"
            onPress={() => startBlocking(parseInt(delayMinutes, 10))}
          />
        </View>
      )}

      <Text style={styles.info}>
        Note: You must grant all required permissions for this to work.
      </Text>
    </View>
  );
};

// Add some basic styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  timerContainer: { alignItems: 'center' },
  statusText: { fontSize: 18, color: 'green', marginBottom: 10 },
  timerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  controlsContainer: { width: '100%', alignItems: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    height: 40,
    width: '50%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  info: { marginTop: 30, textAlign: 'center', color: '#666' },
});

export default DevelopmentSettings;
