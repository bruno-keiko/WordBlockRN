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
