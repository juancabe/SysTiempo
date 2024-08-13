import React from "react";
import { View, Pressable } from "react-native";
import { Slot } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { Logo } from "../components/Logo";
import Feather from "@expo/vector-icons/Feather";
import { AppProvider } from "../context/AppContext";
import { useContext } from "react";

import { getEspData } from "../lib/espdata";
import { AppContext } from "../context/AppContext";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [homeColor, setHomeColor] = React.useState("white");
  const [infoColor, setInfoColor] = React.useState("white");

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="grey" />
        <View
          className="flex-1 bg-black"
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <View className="flex-row justify-between items-center pb-3">
            <Link asChild href="/about">
              <Pressable
                onPressIn={() => {
                  setInfoColor("grey");
                }}
                onPressOut={() => {
                  setInfoColor("white");
                }}
              >
                <Feather name="info" size={40} color={infoColor} />
              </Pressable>
            </Link>
            <Link asChild href="/">
              <Pressable>
                <Logo />
              </Pressable>
            </Link>
            <Link asChild href="/loadExportImport">
              <Pressable
                onPressIn={() => {
                  setHomeColor("grey");
                }}
                onPressOut={() => {
                  setHomeColor("white");
                }}
              >
                <Feather name="upload" size={40} color={homeColor} />
              </Pressable>
            </Link>
          </View>
          <Slot></Slot>
        </View>
      </SafeAreaProvider>
    </AppProvider>
  );
}
