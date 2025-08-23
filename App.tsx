import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@/shared/constants/theme';
import DictionaryPage from '@/pages/dictionary/ui/DictionaryPage';
import { initDB } from '@/shared/lib/utils/dbInit';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    initDB();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />
      <DictionaryPage />
    </SafeAreaProvider>
  );
}

export default App;
