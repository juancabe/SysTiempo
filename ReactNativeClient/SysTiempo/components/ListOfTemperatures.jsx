import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AppContext } from "../context/AppContext";

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
  const { dataFuera, dataDentro } = useContext(AppContext);

  return (
    <View className="flex-1 bg-black justify-around">
      {dataDentro && dataDentro.length > 0 ? (
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
      {dataFuera && dataFuera.length > 0 ? (
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
