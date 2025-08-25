import {
  StatusBar,
  Text,
  ActivityIndicator,
  View,
  AppState,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import { initDB } from '@/shared/lib/utils/dbInit';
import React, { useEffect, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeModules } from 'react-native';

import { RootStackParamList, TabParamList } from '@/shared/types/navigaiton';
import { BlockingProvider, useBlocking } from './BlockingContext';
import PermissionsGuideScreen from '@/pages/PermissionSetup';
import BlockScreen from '@/pages/BlockScreen';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import AddWordPage from '@/pages/add-word/';
import LearningStatsScreen from '@/pages/stats';
import DevelopmentSettings from './src/pages/DevelopmentSettings';
import WordPage from '@/pages/word/ui/WordPage';
import { WordRepository } from '@/entity/word/repository';

const { AppBlocker } = NativeModules;
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: theme.colors.background },
    }}
  >
    <Tab.Screen
      name="DictionaryPage"
      component={DictionaryPage}
      options={{ title: 'Dictionary', tabBarIcon: () => <Text>📖</Text> }}
    />
    <Tab.Screen
      name="AddWordPage"
      component={AddWordPage}
      options={{ title: 'Add Word', tabBarIcon: () => <Text>➕</Text> }}
    />
    <Tab.Screen
      name="Stats"
      component={LearningStatsScreen}
      options={{ tabBarIcon: () => <Text>📊</Text> }}
    />
    <Tab.Screen
      name="DevelopmentSettings"
      component={DevelopmentSettings}
      options={{ title: 'Settings', tabBarIcon: () => <Text>⚙️</Text> }}
    />
  </Tab.Navigator>
);

const MainApp = () => {
  const { isBlocked, stopBlocking } = useBlocking();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const showBlockScreen = async () => {
      if (isBlocked) {
        console.log('isBlocked is true inside MainApp, navigating...');
        const randomWord = await WordRepository.getRandomUnlearnedWord();
        if (randomWord) {
          navigation.navigate('BlockScreen', { word: randomWord });
        } else {
          console.error('Could not fetch a word for blocking screen.');
          stopBlocking();
        }
      }
    };
    showBlockScreen();
  }, [isBlocked, navigation, stopBlocking]);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={TabNavigator} />
      <RootStack.Screen name="WordPage" component={WordPage} />
      <RootStack.Screen
        name="BlockScreen"
        component={BlockScreen}
        options={{ presentation: 'modal', gestureEnabled: false }}
      />
    </RootStack.Navigator>
  );
};

const AppGatekeeper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAllPermissions, setHasAllPermissions] = useState(false);

  const checkPermissions = useCallback(async () => {
    try {
      const overlay = await AppBlocker.checkOverlayPermission();
      const usage = await AppBlocker.checkUsageStatsPermission();
      let notifications = true;
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        notifications = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      setHasAllPermissions(overlay && usage && notifications);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasAllPermissions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGrantPermissions = useCallback(async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    await AppBlocker.requestOverlayPermission();
    await AppBlocker.requestUsageStatsPermission();
  }, []);

  useEffect(() => {
    checkPermissions();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });
    return () => subscription.remove();
  }, [checkPermissions]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!hasAllPermissions) {
    return <PermissionsGuideScreen onGrant={handleGrantPermissions} />;
  }

  return <MainApp />;
};

export default function App() {
  useEffect(() => {
    initDB().catch(error => console.error('DB init failed:', error));
  }, []);

  return (
    <SafeAreaProvider>
      <BlockingProvider>
        <NavigationContainer>
          <StatusBar
            backgroundColor={theme.colors.background}
            barStyle="light-content"
          />
          <AppGatekeeper />
        </NavigationContainer>
      </BlockingProvider>
    </SafeAreaProvider>
  );
}
