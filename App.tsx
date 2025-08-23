import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/shared/constants/theme';
import DictionaryPage from './src/pages/dictionary/ui/DictionaryPage';

function App() {
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
