import React from "react";
import { View, Text, Pressable } from "react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { Feather } from "@expo/vector-icons";

import { styled } from "nativewind";
import { useState, useEffect } from "react";

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

const saveAndShareJsonFile = async ({ dataFuera, dataDentro }) => {
  // Step 2.1: Create an array with the data
  const data = { fuera: dataFuera, dentro: dataDentro };
  console.log("Data to save and share:", data);
  const jsonString = JSON.stringify(data);
  console.log("JSON string to save and share:", jsonString);

  // Step 2.3: Define the file path in the app's documents directory
  const fileUri = FileSystem.documentDirectory + "myData.json";

  // Step 2.4: Write the JSON string to a file
  try {
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    console.log("JSON file has been saved successfully at:", fileUri);

    // Step 2.5: Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      // Step 2.6: Share the file
      await Sharing.shareAsync(fileUri);
      console.log("File shared successfully");
    } else {
      console.log("Sharing is not available on this device");
    }
    return true;
  } catch (error) {
    console.error("Error saving or sharing the JSON file:", error);
    return false;
  }
};

export function ExportImport() {
  const [shareButtonState, setShareButtonState] = useState("bg-gray-800");
  const [dataFuera, setDataFuera] = useState([]);
  const [dataDentro, setDataDentro] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fillData("esp8266fuera", setDataFuera);
      await fillData("esp8266dentro", setDataDentro);
      setIsLoading(false); // Indicar que la carga ha terminado
      setShareButtonState("bg-white");
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 justify-around">
      <View className="items-center">
        <Pressable
          className={`p-4 ${shareButtonState} rounded-md`}
          onPressIn={() => {
            if (
              shareButtonState !== "bg-white" &&
              shareButtonState !== "bg-green-600" &&
              shareButtonState !== "bg-red-600"
            )
              return;
            if (isLoading) return;
            setShareButtonState("bg-sky-800");
          }}
          onPressOut={() => {
            if (shareButtonState !== "bg-sky-800") return;
            setShareButtonState("bg-orange-400");
            saveAndShareJsonFile({ dataFuera, dataDentro }).then(() => {
              setShareButtonState("bg-green-600");
            });
          }}
        >
          <Feather name="share-2" size={90} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
