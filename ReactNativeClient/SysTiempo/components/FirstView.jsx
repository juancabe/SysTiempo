import { useState } from "react";
import { getEspData } from "../lib/espdata";
import { View } from "react-native";
import { StyleSheet, Text, Button, ActivityIndicator } from "react-native";

export function FirstView({
  urlFuera,
  urlDentro,
  dataFuera,
  dataDentro,
  setDataFuera,
  setDataDentro,
}) {
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

  return (
    <View className="ease-in pt-6">
      <Button
        title={cargandoData ? "Cargando " + placeName : "Cargar " + placeName}
        onPress={() => {
          if (cargandoData) return;
          setCargandoData(true);
          getEspData(url).then((data) => {
            setData(data);
            setCargandoData(false);
          });
        }}
      />
      {cargandoData ? (
        <ActivityIndicator className="pt-6" />
      ) : data ? (
        data === "No data" || data === "No ESP8266 device found" ? (
          <Text className="text-red-500 text-lg py-3 text-left">{data}</Text>
        ) : (
          <>
            <Text className="text-white text-xl py-5 font-bold text-center">
              {placeName}
            </Text>
            <View>
              <Text className="text-white text-lg py-1 text-left">
                Temp: {data[data.length - 1].temp}ºC
              </Text>
              <Text className="text-white text-lg py-1 text-left">
                Hum: {data[data.length - 1].hum}%
              </Text>
              <Text className="text-white text-lg py-1 text-left">
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
        <Text className="text-white">Sin datos de {placeName}.</Text>
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
