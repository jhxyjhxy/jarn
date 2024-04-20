import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ECamera from "./ECamera";

export default function App() {
  return (
    // <ECamera/>
    <View style={styles.container}>
      {/* <Text>Welcome to NatureQuest!</Text> */}
      <ECamera/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C5E99B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});