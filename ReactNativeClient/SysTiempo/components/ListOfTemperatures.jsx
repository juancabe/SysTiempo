import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ListOfTemperatures({ data }) {
  const insets = useSafeAreaInsets();
  console.log(data);
  let toSend = (
    <View style={{ paddingTop: insets.top }}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item) => item.time.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.temp}ºC - {new Date(item.time * 1000).toLocaleString()}
          </Text>
        )}
      />
    </View>
  );

  return toSend;
}

const styles = StyleSheet.create({
  flatList: {
    backgroundColor: "#000",
  },
  item: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
  },
});
