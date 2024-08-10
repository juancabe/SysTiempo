import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { Main } from "./components/Main";
import { Logo } from "./components/Logo";

export default function App() {
  return (
    <View style={styles.container}>
      {/* tailwindcss: className="flex-1 bg-black align-middle justify-center" */}
      <Main />
    </View>
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
