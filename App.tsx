import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import { initDB } from '@/shared/lib/utils/dbInit';
import { useEffect } from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordPage from '@/pages/word/ui/WordPage';
import { RootStackParamList } from '@/shared/types/navigaiton';
import AddWordPage from '@/pages/add-word/';
import { NativeModules } from 'react-native';
import DevelopmentSettings from './src/pages/DevelopmentSettings';
import BlockScreen from './src/pages/BlockScreen';
import UsageStatsErrorBoundary from '@/shared/ui/UsageStatsErrorBoundary';

// Check if native module is available
const isUsageStatsAvailable = !!NativeModules.UsageStatsModule;
console.log('UsageStatsModule available:', isUsageStatsAvailable);

const RootStack = createNativeStackNavigator({
  screens: {
    DictionaryPage: {
      screen: DictionaryPage,
    },
    WordPage: {
      screen: WordPage,
    },
    AddWordPage: {
      screen: AddWordPage,
    },
    DevelopmentSettings: {
      screen: DevelopmentSettings,
    },
    BlockScreen: {
      screen: BlockScreen,
    },
  },
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'DictionaryPage',
});

const Navigation = createStaticNavigation(RootStack);

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
        <Navigation />
      </SafeAreaProvider>
    </UsageStatsErrorBoundary>
  );
}
