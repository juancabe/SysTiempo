import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { FirstView } from "./FirstView";
import { ListOfTemperatures } from "./ListOfTemperatures";
import { Logo } from "./Logo";
import Feather from "@expo/vector-icons/Feather";
import { styled } from "nativewind";

export function Main() {
  const [firstViewColor, setFirstViewColor] = useState("bg-white");
  const [tempListColor, setTempListColor] = useState("bg-white");
  const [graphColor, setGraphColor] = useState("bg-white");

  return (
    <View className="flex-1 items-center justify-around">
      <View>
        <Link asChild href="/loadFirstView">
          <Pressable
            className={"p-4 rounded-md " + firstViewColor}
            onPressIn={() => {
              setFirstViewColor("bg-neutral-600");
            }}
            onPressOut={() => {
              setFirstViewColor("bg-white");
            }}
          >
            <Feather name="download" size={70} color="black" />
          </Pressable>
        </Link>
      </View>
      <View>
        <Link asChild href="/loadListTemperatures">
          <Pressable
            className={"p-4 rounded-md " + tempListColor}
            onPressIn={() => {
              setTempListColor("bg-neutral-600");
            }}
            onPressOut={() => {
              setTempListColor("bg-white");
            }}
          >
            <Feather name="list" size={70} color="black" />
          </Pressable>
        </Link>
      </View>
      <View>
        <Link asChild href="/loadGraph">
          <Pressable
            className={"p-4 rounded-md " + graphColor}
            onPressIn={() => {
              setGraphColor("bg-neutral-600");
            }}
            onPressOut={() => {
              setGraphColor("bg-white");
            }}
          >
            <Feather name="activity" size={70} color="black" />
          </Pressable>
        </Link>
      </View>
      <View>
        <Link asChild href="/loadBackgroundFetch">
          <Pressable
            className={"p-4 rounded-md " + graphColor}
            onPressIn={() => {
              setGraphColor("bg-neutral-600");
            }}
            onPressOut={() => {
              setGraphColor("bg-white");
            }}
          >
            <Feather name="sliders" size={70} color="black" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
