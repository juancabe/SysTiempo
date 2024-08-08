import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { getEspData } from "./lib/espdata";

const icon = require("./assets/icon.png");

const urlFuera = "esp8266fuera";
const urlDentro = "esp8266dentro";

export default function App() {
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  useEffect(() => {
    getEspData(urlFuera).then((data) => {
      setDataFuera(data);
    });
  }, []);

  useEffect(() => {
    getEspData(urlDentro).then((data) => {
      setDataDentro(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {dataFuera ? (
        <>
          <Text style={{ color: "#fff" }}>Fuera</Text>
          <Text style={{ color: "#fff" }}>
            Temperatura: {dataFuera[dataFuera.length - 1].temp}ºC
          </Text>
          <Text style={{ color: "#fff" }}>
            Humedad: {dataFuera[dataFuera.length - 1].hum}%
          </Text>
          <Text style={{ color: "#fff" }}>
            Última actualización:{" "}
            {new Date(
              dataFuera[dataFuera.length - 1].time * 1000,
            ).toLocaleString()}
          </Text>
        </>
      ) : (
        <Text style={{ color: "#fff" }}>Cargando data fuera...</Text>
      )}
      <Button
        title="Recargar"
        onPress={() => {
          getEspData(urlDentro).then((data) => {
            setDataDentro(data);
          });
        }}
      />
      {dataDentro ? (
        <>
          <Text style={{ color: "#fff" }}>Dentro</Text>
          <Text style={{ color: "#fff" }}>
            Temperatura: {dataDentro[dataDentro.length - 1].temp}ºC
          </Text>
          <Text style={{ color: "#fff" }}>
            Humedad: {dataDentro[dataDentro.length - 1].hum}%
          </Text>
          <Text style={{ color: "#fff" }}>
            Última actualización:{" "}
            {new Date(
              dataDentro[dataDentro.length - 1].time * 1000,
            ).toLocaleString()}
          </Text>
        </>
      ) : (
        <Text style={{ color: "#fff" }}>Cargando data dentro...</Text>
      )}
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
