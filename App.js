import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import WebpConverter from './app/webp-converter';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <WebpConverter />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
