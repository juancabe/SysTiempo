import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { getEspData } from "./lib/espdata";

const icon = require("./assets/icon.png");

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getEspData().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {data ? (
        <>
          <Text style={{ color: "#fff" }}>
            Temperatura fuera: {data.fuera[0].temp}ºC
          </Text>
          <Text style={{ color: "#fff" }}>
            Humedad fuera: {data.fuera[0].hum}%
          </Text>
          <Text style={{ color: "#fff" }}>
            Temperatura dentro: {data.dentro[0].temp}ºC
          </Text>
          <Text style={{ color: "#fff" }}>
            Humedad dentro: {data.dentro[0].hum}%
          </Text>
        </>
      ) : (
        <Text style={{ color: "#fff" }}>Cargando...</Text>
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
