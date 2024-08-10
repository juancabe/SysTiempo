import { useState } from "react";
import { getEspData } from "../lib/espdata";
import { View, Pressable } from "react-native";
import { StyleSheet, Text, Button, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export function FirstView() {
  const urlFuera = "esp8266fuera";
  const urlDentro = "esp8266dentro";
  const { dataFuera, setDataFuera, dataDentro, setDataDentro } =
    useContext(AppContext);
  return (
    <View className="flex-1 bg-black align-middle justify-center">
      <ButtonNData
        data={dataFuera}
        setData={setDataFuera}
        placeName="Fuera"
        url={urlFuera}
      />
      <ButtonNData
        data={dataDentro}
        setData={setDataDentro}
        placeName="Dentro"
        url={urlDentro}
      />
    </View>
  );
}

function ButtonNData({ data, setData, placeName, url }) {
  const [cargandoData, setCargandoData] = useState(false);
  const [pressIn, setPressIn] = useState(false);

  return (
    <View className="ease-in pt-6">
      <Pressable
        onPressOut={() => {
          setPressIn(false);
          if (cargandoData) return;
          setCargandoData(true);
          getEspData(url).then((data) => {
            setData(data);
            setCargandoData(false);
          });
        }}
        onPressIn={() => setPressIn(true)}
      >
        {pressIn || cargandoData ? (
          <Text className="text-blue-300 font-bold text-xl py-3 text-center opacity-50">
            {cargandoData ? "Cargando " + placeName : "Cargar " + placeName}
          </Text>
        ) : (
          <Text className="text-blue-300 font-bold text-xl py-3 text-center">
            {cargandoData ? "Cargando " + placeName : "Cargar " + placeName}
          </Text>
        )}
      </Pressable>

      {cargandoData ? (
        <ActivityIndicator className="pt-6" />
      ) : data ? (
        data === "No data" || data === "No ESP8266 device found" ? (
          <Text className="text-red-500 text-lg py-3 text-center">{data}</Text>
        ) : (
          <>
            <Text className="text-white text-xl py-5 font-bold text-center">
              {placeName}
            </Text>
            <View>
              <Text className="text-white text-lg py-1 text-center">
                Temp: {data[data.length - 1].temp}ºC
              </Text>
              <Text className="text-white text-lg py-1 text-center">
                Hum: {data[data.length - 1].hum}%
              </Text>
              <Text className="text-white text-lg py-1 text-center">
                Updated:{" "}
                {new Date(data[data.length - 1].time * 1000)
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
        )
      ) : (
        <Text className="text-white text-center">
          Sin datos de {placeName}.
        </Text>
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
