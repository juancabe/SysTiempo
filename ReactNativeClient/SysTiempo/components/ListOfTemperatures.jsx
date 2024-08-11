import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AppContext } from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ShowListOfTemperatures({ data }) {
  console.log(data);
  let toSend = (
    <FlatList
      data={data}
      keyExtractor={(item) => item.time.toString()}
      renderItem={({ item }) => (
        <Text className="text-white text-lg pb-1 text-center">
          {item.temp}ºC - {new Date(item.time * 1000).toLocaleString()}
        </Text>
      )}
    />
  );

  return toSend;
}

export function ListOfTemperatures() {
  const [dataDentro, setDataDentro] = useState([]);
  const [dataFuera, setDataFuera] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga

  async function fillData(serverName, setData) {
    let availableKeys = [];
    await AsyncStorage.getAllKeys().then((keys) => {
      availableKeys = keys.filter((key) => key.includes(serverName));
      if (availableKeys.length > 0) availableKeys.sort();
      const promises = availableKeys.map((key) =>
        AsyncStorage.getItem(key).then((value) => JSON.parse(value)),
      );
      Promise.all(promises).then((values) => {
        setData(values);
      });
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await fillData("esp8266fuera", setDataFuera);
      await fillData("esp8266dentro", setDataDentro);
      setIsLoading(false); // Indicar que la carga ha terminado
    };

    fetchData();
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
    <View className="flex-1 bg-black justify-around">
      {dataFuera.length > 0 ? (
        <>
          <Text className="text-white text-3xl text-center p-3">
            Datos fuera
          </Text>
          <ShowListOfTemperatures data={dataFuera} />
        </>
      ) : (
        <Text className="text-white text-3xl text-center p-3">
          No hay datos fuera
        </Text>
      )}
      {dataDentro.length > 0 ? (
        <>
          <Text className="text-white text-3xl text-center p-3">
            Datos dentro
          </Text>
          <ShowListOfTemperatures data={dataDentro} />
        </>
      ) : (
        <Text className="text-white text-3xl text-center p-3">
          No hay datos dentro
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
  },
});
