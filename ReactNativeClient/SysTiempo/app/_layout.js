import { View, Text } from "react-native";
import { Slot } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const insets = useSafeAreaInsets();
  console.log("insetsPaddingTop", insets.top);
  console.log("insetsPaddingBottom", insets.bottom);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View
        className="flex-1 bg-black"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Slot></Slot>
      </View>
    </SafeAreaProvider>
  );
}
