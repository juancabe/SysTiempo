import { useState } from "react";
import { getEspData } from "../lib/espdata";
import { View } from "react-native";
import { StyleSheet, Text, Button } from "react-native";

export function FirstView(args) {
  const urlFuera = args.urlFuera;
  const urlDentro = args.urlDentro;
  const dataFuera = args.dataFuera;
  const dataDentro = args.dataDentro;
  const setDataFuera = args.setDataFuera;
  const setDataDentro = args.setDataDentro;

  return (
    <View style={styles.container}>
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
              Temp: {dataFuera[dataFuera.length - 1].temp}ºC
            </Text>
            <Text style={[styles.paragraph]}>
              Hum: {dataFuera[dataFuera.length - 1].hum}%
            </Text>
            <Text style={[styles.paragraph]}>
              Updated:{" "}
              {new Date(dataFuera[dataFuera.length - 1].time * 1000)
                .toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour12: false, // Use 24-hour format
                })
                .replace(",", "")}
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
              Temp: {dataDentro[dataDentro.length - 1].temp}ºC
            </Text>
            <Text style={[styles.paragraph]}>
              Hum: {dataDentro[dataDentro.length - 1].hum}%
            </Text>
            <Text style={[styles.paragraph]}>
              Updated:{" "}
              {new Date(dataDentro[dataDentro.length - 1].time * 1000)
                .toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour12: false, // Use 24-hour format
                })
                .replace(",", "")}
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
