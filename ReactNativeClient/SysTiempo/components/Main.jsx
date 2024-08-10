import { useState } from "react";
import { View } from "react-native";
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
