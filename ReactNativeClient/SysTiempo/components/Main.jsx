import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { FirstView } from "./FirstView";
import { ListOfTemperatures } from "./ListOfTemperatures";
import { Logo } from "./Logo";
import Feather from "@expo/vector-icons/Feather";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

export function Main() {
  const [infoColor, setInfoColor] = useState("white");

  const [firstViewColor, setFirstViewColor] = useState("white");
  return (
    <View className="flex-1 items-center justify-around">
      {/*
      <FirstView
        urlFuera={urlFuera}
        urlDentro={urlDentro}
        dataFuera={dataFuera}
        dataDentro={dataDentro}
        setDataFuera={setDataFuera}
        setDataDentro={setDataDentro}
      />
      */}
      <View>
        <Link asChild href="/loadFirstView">
          <StyledPressable
            className="p-4 bg-sky-800 rounded-md"
            onPressIn={() => {
              setFirstViewColor("grey");
            }}
            onPressOut={() => {
              setFirstViewColor("white");
            }}
          >
            <Text className="text-white text-4xl">Cargar</Text>
          </StyledPressable>
        </Link>
      </View>
      <View>
        <Link asChild href="/loadListTemperatures">
          <StyledPressable
            className="p-4 bg-sky-800 rounded-md"
            onPressIn={() => {
              setInfoColor("grey");
            }}
            onPressOut={() => {
              setInfoColor("white");
            }}
          >
            <Text className="text-white text-4xl">Lista Temperaturas</Text>
          </StyledPressable>
        </Link>
      </View>
    </View>
  );
}
