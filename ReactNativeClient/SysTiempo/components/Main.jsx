import { useState } from "react";
import { getEspData } from "../lib/espdata";
import { View } from "react-native";
import { StyleSheet, Text, Button } from "react-native";
import { FirstView } from "./FirstView";

export function Main() {
  const urlFuera = "esp8266fuera";
  const urlDentro = "esp8266dentro";
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <FirstView
      urlFuera={urlFuera}
      urlDentro={urlDentro}
      dataFuera={dataFuera}
      dataDentro={dataDentro}
      setDataFuera={setDataFuera}
      setDataDentro={setDataDentro}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginVertical: 5,
  },
  paragraph: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
  },
});
