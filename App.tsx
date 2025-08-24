import { StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import { initDB } from '@/shared/lib/utils/dbInit';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordPage from '@/pages/word/ui/WordPage';
import { RootStackParamList } from '@/shared/types/navigaiton';
import AddWordPage from '@/pages/add-word/';
import { NativeModules } from 'react-native';
import DevelopmentSettings from './src/pages/DevelopmentSettings';
import UsageStatsErrorBoundary from '@/shared/ui/UsageStatsErrorBoundary';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LearningStatsScreen from '@/pages/stats';

const isUsageStatsAvailable = !!NativeModules.UsageStatsModule;


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tab.Screen
        name="DictionaryPage"
        component={DictionaryPage}
        options={{
          headerShown: false,
          title: 'Dictionary',
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: 20 }}>📖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AddWordPage"
        component={AddWordPage}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>➕</Text>,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={LearningStatsScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="DevelopmentSettings"
        component={DevelopmentSettings}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text>,
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WordPage"
        component={WordPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDB();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <UsageStatsErrorBoundary>
      <SafeAreaProvider>
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle="light-content"
        />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </UsageStatsErrorBoundary>
  );
}
