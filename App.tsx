import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import { initDB } from '@/shared/lib/utils/dbInit';
import { useEffect } from 'react';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WordPage from '@/pages/word/ui/WordPage';

const RootStack = createNativeStackNavigator({
  screens: {
    DictionaryPage: {
      screen: DictionaryPage,
    },
    WordPage: {
      screen: WordPage,
    },
  },
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'DictionaryPage',
});

const Navigation = createStaticNavigation(RootStack);
type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function App() {
  useEffect(() => {
    initDB();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />
      <Navigation />
    </SafeAreaProvider>
  );
}
