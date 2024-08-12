import { useState, useEffect } from "react";
import { getEspData } from "../lib/espdata";
import { View, Pressable } from "react-native";
import { StyleSheet, Text, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { getAvailableKeys } from "../context/AppContext";

export function FirstView() {
  const urlFuera = "esp8266fuera";
  const urlDentro = "esp8266dentro";
  const {
    dataFuera,
    setDataFuera,
    dataDentro,
    setDataDentro,
    getAvailableKeys,
  } = useContext(AppContext);

  const [availableKeysFuera, setAvailableKeysFuera] = useState([]);
  const [availableKeysDentro, setAvailableKeysDentro] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAvailableKeys(urlFuera).then((keys) => setAvailableKeysFuera(keys));
    getAvailableKeys(urlDentro).then((keys) => setAvailableKeysDentro(keys));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-around">
        <Text className="text-white text-3xl text-center p-3">
          Cargando datos...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black align-middle justify-center">
      <ButtonNData
        lastHHMM={
          availableKeysFuera
            ? availableKeysFuera.length > 0
              ? new Date(
                  availableKeysFuera[availableKeysFuera.length - 1].split(
                    urlFuera + "-",
                  )[1] * 1000,
                )
                  .toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")
              : -1
            : -1
        }
        numKeys={availableKeysFuera.length}
        data={dataFuera}
        setData={setDataFuera}
        placeName="Fuera"
        url={urlFuera}
        lastTime={
          availableKeysFuera.length > 0
            ? availableKeysFuera[availableKeysFuera.length - 1].split(
                urlFuera + "-",
              )[1]
            : -1
        }
      />
      <ButtonNData
        lastHHMM={
          availableKeysDentro
            ? availableKeysDentro.length > 0
              ? new Date(
                  availableKeysDentro[availableKeysDentro.length - 1].split(
                    urlDentro + "-",
                  )[1] * 1000,
                )
                  .toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")
              : -1
            : -1
        }
        numKeys={availableKeysDentro.length}
        data={dataDentro}
        setData={setDataDentro}
        placeName="Dentro"
        url={urlDentro}
        lastTime={
          availableKeysDentro.length > 0
            ? availableKeysDentro[availableKeysDentro.length - 1].split(
                urlDentro + "-",
              )[1]
            : -1
        }
      />
    </View>
  );
}

function ButtonNData({
  data,
  setData,
  placeName,
  url,
  lastTime,
  numKeys,
  lastHHMM,
}) {
  const [cargandoData, setCargandoData] = useState(false);
  const [pressIn, setPressIn] = useState(false);
  const [dataPintar, setDataPintar] = useState(false);

  return (
    <View className="ease-in pt-6">
      <Pressable
        onPressOut={() => {
          setPressIn(false);
          if (cargandoData) return;
          console.log("Last time:", lastTime);
          setCargandoData(true);
          getEspData({ Burl: url, lastTime: lastTime }).then((dataReturned) => {
            if (
              data &&
              data.length > 0 &&
              !(typeof dataReturned === "string")
            ) {
              data.concat(dataReturned);
            } else {
              data = dataReturned;
            }
            setData(dataReturned);
            if (typeof data === "string") {
              setDataPintar(data);
            } else {
              setDataPintar(data[data.length - 1]);
            }
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
      ) : dataPintar ? (
        dataPintar === "No dataPintar" ||
        dataPintar === "No ESP8266 device found" ? (
          <Text className="text-red-500 text-lg py-3 text-center">
            {dataPintar}
          </Text>
        ) : (
          <>
            <Text className="text-white text-xl py-5 font-bold text-center">
              {placeName}
            </Text>
            <View>
              <Text className="text-white text-lg py-1 text-center">
                Temp: {dataPintar.temp}ºC
              </Text>
              <Text className="text-white text-lg py-1 text-center">
                Hum: {dataPintar.hum}%
              </Text>
              <Text className="text-white text-lg py-1 text-center">
                Updated:{" "}
                {new Date(dataPintar.time * 1000)
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
          {numKeys > 0
            ? "Hay un total de " +
              numKeys +
              " lecturas\nÚltima a las " +
              lastHHMM
            : "No hay datos"}
        </Text>
      )}
    </View>
  );
}
