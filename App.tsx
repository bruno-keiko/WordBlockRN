import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Typography } from './src/shared/ui/Typography';
import Button from './src/shared/ui/Button';
import Input from './src/shared/ui/Input';
import { theme } from './src/shared/constants/theme';
import WordCard from './src/shared/ui/WordCard';
import WordList from './src/widgets/word-list/ui/WordList';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <Typography>AppContent</Typography>
      <Button title="Button" onPress={() => {}} />
      <Input placeholder="Search" onChangeText={() => {}} />
      <WordCard word="word" onPress={() => {}} />
      <WordList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
});

export default App;
