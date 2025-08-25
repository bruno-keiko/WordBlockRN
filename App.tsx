import { StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import { initDB } from '@/shared/lib/utils/dbInit';
import { RootStackParamList, TabParamList } from '@/shared/types/navigaiton';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordPage from '@/pages/word/ui/WordPage';
import AddWordPage from '@/pages/add-word/';
import DevelopmentSettings from './src/pages/DevelopmentSettings';
import UsageStatsErrorBoundary from '@/shared/ui/UsageStatsErrorBoundary';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import LearningStatsScreen from '@/pages/stats';

import { BlockingProvider, useBlocking } from './BlockingContext';
import { Word } from '@/entity/word/interface';
import { WordRepository } from '@/entity/word/repository';
import BlockScreen from '@/pages/BlockScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isBlocked, stopBlocking } = useBlocking();
  console.log(isBlocked);
  const navigation = useNavigation();
  const [blockingWord, setBlockingWord] = useState<Word | null>(null);

  useEffect(() => {
    const showBlockScreen = async () => {
      if (isBlocked) {
        // Fetch a random word to show on the block screen
        const randomWord = await WordRepository.getRandomUnlearnedWord(); // IMPORTANT: Replace with your actual logic
        if (randomWord) {
          setBlockingWord(randomWord);
          navigation.navigate('BlockScreen', { word: randomWord });
        } else {
          // Handle case where no word could be fetched
          console.error('Could not fetch a word for blocking screen.');
          stopBlocking(); // Stop blocking if we can't show a word
        }
      }
    };

    showBlockScreen();
  }, [isBlocked, navigation]);

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
      {/* Add BlockScreen to the Root Stack */}
      <Stack.Screen
        name="BlockScreen"
        component={BlockScreen}
        options={{
          headerShown: false,
          presentation: 'modal', // This makes it appear on top of everything
          gestureEnabled: false, // Prevent swiping it away
        }}
      />
    </Stack.Navigator>
  );
};

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
    <BlockingProvider>
      <UsageStatsErrorBoundary>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor={theme.colors.background}
            barStyle="light-content"
          />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </UsageStatsErrorBoundary>
    </BlockingProvider>
  );
}
