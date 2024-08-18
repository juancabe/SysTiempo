import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { Feather } from "@expo/vector-icons";

import { useState, useEffect } from "react";
import { DefaultTheme } from "@react-navigation/native";

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
  // Step 1: Create an array with the data
  const data = { fuera: dataFuera, dentro: dataDentro };
  console.log("Data to save and share:", data);
  const jsonString = JSON.stringify(data);
  console.log("JSON string to save and share:", jsonString);

  // Step 3: Define the file path in the app's documents directory
  const fileUri = FileSystem.documentDirectory + "myData.json";

  // Step 4: Write the JSON string to a file
  try {
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    console.log("JSON file has been saved successfully at:", fileUri);

    // Step 5: Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      // Step 6: Share the file
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

const downloadAndSave = async ({ downloadUrl }) => {
  try {
    const response = await fetch(downloadUrl);
    const data = await response.json();
    if (data.fuera && data.dentro) {
      data.fuera.forEach((datum) => {
        AsyncStorage.setItem(
          `esp8266fuera-${datum.time}`,
          JSON.stringify(datum),
        );
      });
      data.dentro.forEach((datum) => {
        AsyncStorage.setItem(
          `esp8266dentro-${datum.time}`,
          JSON.stringify(datum),
        );
      });
      return true;
    } else {
      console.error("JSON file does not contain the expected keys");
      return false;
    }
  } catch (error) {
    console.error("Error downloading and saving the JSON file:", error);
    return false;
  }
};

export function ExportImport() {
  const [shareButton, setShareButton] = useState("bg-gray-800");
  const [isLoadingShare, setIsLoadingShare] = useState(true);

  const [downloadButton, setDownloadButton] = useState("bg-gray-800");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isLoadingDownload, setIsLoadingDownload] = useState(true);

  const [dataFuera, setDataFuera] = useState([]);
  const [dataDentro, setDataDentro] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fillData("esp8266fuera", setDataFuera);
      await fillData("esp8266dentro", setDataDentro);
      setIsLoadingShare(false); // Indicar que la carga ha terminado
      setShareButton("bg-white");
    };

    fetchData();
  }, []);

  useEffect(() => {
    const httpsUrlRegex =
      /^https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/i;

    if (httpsUrlRegex.test(downloadUrl)) {
      setIsLoadingDownload(false);
      setDownloadButton("bg-white");
    } else {
      setIsLoadingDownload(true);
      setDownloadButton("bg-gray-800");
    }
  }, [downloadUrl]);

  return (
    <View className="flex-1 justify-start">
      <View className="items-center py-20">
        <Pressable
          className={`p-4 ${shareButton} rounded-md`}
          onPressIn={() => {
            if (
              shareButton !== "bg-white" &&
              shareButton !== "bg-green-600" &&
              shareButton !== "bg-red-600"
            )
              return;
            if (isLoadingShare) return;
            setShareButton("bg-sky-800");
          }}
          onPressOut={() => {
            if (shareButton !== "bg-sky-800") return;
            setShareButton("bg-orange-400");
            saveAndShareJsonFile({ dataFuera, dataDentro }).then(() => {
              setShareButton("bg-green-600");
            });
          }}
        >
          <Feather name="share-2" size={90} color="black" />
        </Pressable>
      </View>
      <View className="flex-row items-center justify-around py-20">
        <TextInput
          onChangeText={setDownloadUrl}
          className="p-2 bg-white rounded-md text-black w-3/5 text-clip"
          placeholder="ex: https://example.com/data.json"
          value={downloadUrl}
          autoCapitalize="none"
          autoCorrect={false}
          dataDetectorTypes={["link"]}
        ></TextInput>
        <Pressable
          className={`p-4 ${downloadButton} rounded-md`}
          onPressIn={() => {
            if (
              downloadButton !== "bg-white" &&
              downloadButton !== "bg-green-600" &&
              downloadButton !== "bg-red-600"
            )
              return;
            if (isLoadingDownload) return;
            setDownloadButton("bg-sky-800");
          }}
          onPressOut={() => {
            if (downloadButton !== "bg-sky-800") return;
            setDownloadButton("bg-orange-400");
            downloadAndSave({ downloadUrl }).then((resp) => {
              if (resp) setDownloadButton("bg-green-600");
              else setDownloadButton("bg-red-600");
            });
          }}
        >
          <Feather name="download" size={70} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
