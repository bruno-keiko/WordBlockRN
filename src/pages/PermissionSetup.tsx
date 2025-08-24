
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

interface PermissionSetupProps {
  onPermissionGranted: () => void;
  onRequestPermission: () => Promise<void>;
  hasPermission: boolean;
}

const PermissionSetup: React.FC<PermissionSetupProps> = ({
  onPermissionGranted,
  onRequestPermission,
  hasPermission,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      await onRequestPermission();
      Alert.alert(
        'Permission Required',
        'Please grant Usage Access permission to WordBlock in the settings that just opened, then return to the app.',
        [
          {
            text: 'I granted permission',
            onPress: onPermissionGranted,
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to open settings. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (Platform.OS !== 'android') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Platform Not Supported</Text>
        <Text style={styles.description}>
          Screen time blocking is currently only available on Android devices.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Screen Time Blocking</Text>
      
      <Text style={styles.description}>
        WordBlock uses screen time monitoring to help you learn vocabulary by 
        periodically blocking your access until you learn a new word.
      </Text>

      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Benefits:</Text>
        <Text style={styles.benefit}>• 🎯 Consistent vocabulary practice</Text>
        <Text style={styles.benefit}>• ⏰ Configurable time intervals</Text>
        <Text style={styles.benefit}>• 📊 Learning progress tracking</Text>
        <Text style={styles.benefit}>• 🧠 Spaced repetition learning</Text>
      </View>

      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>
          {hasPermission ? '✅ Permission Granted' : '⚠️ Permission Required'}
        </Text>
        <Text style={styles.permissionDescription}>
          {hasPermission 
            ? 'Screen time monitoring is active!'
            : 'WordBlock needs Usage Access permission to monitor screen time.'
          }
        </Text>
      </View>

      {!hasPermission && (
        <>
          <TouchableOpacity
            style={[styles.button, isRequesting && styles.buttonDisabled]}
            onPress={handleRequestPermission}
            disabled={isRequesting}
          >
            <Text style={styles.buttonText}>
              {isRequesting ? 'Opening Settings...' : 'Grant Permission'}
            </Text>
          </TouchableOpacity>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>How to grant permission:</Text>
            <Text style={styles.instruction}>1. Tap "Grant Permission" above</Text>
            <Text style={styles.instruction}>2. Find "WordBlock" in the list</Text>
            <Text style={styles.instruction}>3. Toggle the switch to enable access</Text>
            <Text style={styles.instruction}>4. Return to WordBlock app</Text>
          </View>
        </>
      )}

      {hasPermission && (
        <TouchableOpacity style={styles.continueButton} onPress={onPermissionGranted}>
          <Text style={styles.continueButtonText}>Continue to App</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  benefitsContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  benefit: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 8,
    lineHeight: 22,
  },
  permissionContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  permissionDescription: {
    fontSize: 16,
    color: '#aaa',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 15,
  },
  instruction: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default PermissionSetup;