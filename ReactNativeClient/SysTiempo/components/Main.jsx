import { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { FirstView } from "./FirstView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListOfTemperatures } from "./ListOfTemperatures";
import { Logo } from "./Logo";

export function Main() {
  const insets = useSafeAreaInsets();
  const urlFuera = "esp8266fuera";
  const urlDentro = "esp8266dentro";
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logo />
      <Link href="/about" className="text-blue-500 text-lg pt-4">
        Ir al about
      </Link>

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
