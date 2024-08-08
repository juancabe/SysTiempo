import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { getEspData } from "./lib/espdata";

const urlFuera = "esp8266fuera";
const urlDentro = "esp8266dentro";

export default function App() {
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Botón para cargar datos de fuera */}
      <Button
        title="Cargar Fuera"
        onPress={() => {
          getEspData(urlFuera).then((data) => {
            setDataFuera(data); // Se actualiza el estado
          });
        }}
      />

      {/* Mostrar datos de fuera */}
      {dataFuera ? (
        <>
          <Text style={[styles.title, { fontWeight: "bold" }]}>Fuera</Text>
          <View style={{ textAlign: "left" }}>
            <Text style={[styles.paragraph]}>
              Temperatura: {dataFuera[dataFuera.length - 1].temp}ºC
            </Text>
            <Text style={[styles.paragraph]}>
              Humedad: {dataFuera[dataFuera.length - 1].hum}%
            </Text>
            <Text style={[styles.paragraph]}>
              Última actualización:{" "}
              {new Date(
                dataFuera[dataFuera.length - 1].time * 1000,
              ).toLocaleString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ color: "#fff" }}>Sin datos de fuera.</Text>
      )}

      {/* Botón para cargar datos de dentro */}
      <Button
        title="Cargar Dentro"
        onPress={() => {
          getEspData(urlDentro).then((data) => {
            setDataDentro(data); // Se actualiza el estado
          });
        }}
      />

      {/* Mostrar datos de dentro */}
      {dataDentro ? (
        <>
          <Text style={[styles.title, { fontWeight: "bold" }]}>Dentro</Text>
          <View style={{ textAlign: "left" }}>
            <Text style={[styles.paragraph]}>
              Temperatura: {dataDentro[dataDentro.length - 1].temp}ºC
            </Text>
            <Text style={[styles.paragraph]}>
              Humedad: {dataDentro[dataDentro.length - 1].hum}%
            </Text>
            <Text style={[styles.paragraph]}>
              Última actualización:{" "}
              {new Date(
                dataDentro[dataDentro.length - 1].time * 1000,
              ).toLocaleString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ color: "#fff" }}>Sin datos de dentro.</Text>
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
