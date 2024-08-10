import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { Main } from "./components/Main";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Logo } from "./components/Logo";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* tailwindcss: className="flex-1 bg-black align-middle justify-center" */}
        <StatusBar style="light" />
        <Main />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
