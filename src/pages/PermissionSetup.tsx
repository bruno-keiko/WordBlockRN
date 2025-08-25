import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { theme } from '@/shared/constants/theme';

interface PermissionsGuideScreenProps {
  onGrant: () => void;
}

const PermissionsGuideScreen: React.FC<PermissionsGuideScreenProps> = ({ onGrant }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🔒</Text>
      <Text style={styles.title}>Permissions Required</Text>
      <Text style={styles.subtitle}>
        To enable the app blocking feature, we need a few special permissions.
      </Text>

      <View style={styles.permissionItem}>
        <Text style={styles.permissionTitle}>1. Display Over Other Apps</Text>
        <Text style={styles.permissionDesc}>
          This allows the app to show the "Time to Learn!" screen on top of other applications when your time is up.
        </Text>
      </View>

      <View style={styles.permissionItem}>
        <Text style={styles.permissionTitle}>2. Usage Access</Text>
        <Text style={styles.permissionDesc}>
          This is required to detect which app you are currently using, so we know when to trigger the learning screen.
        </Text>
      </View>

      <View style={styles.permissionItem}>
        <Text style={styles.permissionTitle}>3. Notifications</Text>
        <Text style={styles.permissionDesc}>
          A persistent notification is required by Android for the service to run reliably in the background.
        </Text>
      </View>

      <Button
        title="Grant Permissions"
        onPress={onGrant}
        color={theme.colors.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  permissionItem: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  permissionDesc: {
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: 20,
  },
});

export default PermissionsGuideScreen;