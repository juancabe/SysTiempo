import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { FirstView } from "./FirstView";
import { ListOfTemperatures } from "./ListOfTemperatures";
import { Logo } from "./Logo";

export function Main() {
  const urlFuera = "esp8266fuera";
  const urlDentro = "esp8266dentro";
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <View className="flex-1">
      <View className="flex-row justify-between">
        <Link asChild href="/about">
          <Pressable>
            <Text className="text-blue-500 text-lg">Ir al about</Text>
          </Pressable>
        </Link>
        <Logo />
        <View>
          <Text className="text-black text-lg">Ir al about</Text>
        </View>
      </View>

      <FirstView
        urlFuera={urlFuera}
        urlDentro={urlDentro}
        dataFuera={dataFuera}
        dataDentro={dataDentro}
        setDataFuera={setDataFuera}
        setDataDentro={setDataDentro}
      />
    </View>
  );
}
