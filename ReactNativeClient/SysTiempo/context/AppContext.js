import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getEspData } from "../lib/espdata";

import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

export const AppContext = createContext();

const BACKGROUND_FETCH_TASK = "getEspData";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const getAvailableKeys = async (serverName) => {
    let availableKeys = [];
    await AsyncStorage.getAllKeys().then((keys) => {
      availableKeys = keys.filter((key) => key.includes(serverName));
      if (availableKeys.length > 0) availableKeys.sort();
    });
    return availableKeys;
  };

  function saveDataBg(serverName, data) {
    let key = `${serverName}-${data.time}`;
    AsyncStorage.setItem(key, JSON.stringify(data), (err) => {
      if (err) {
        console.log("[saveData]AsyncStorage error: ", err);
        return -1;
      } else {
        console.log("[saveData]Data saved successfully");
      }
    });
  }
  const keysFuera = await getAvailableKeys("esp8266fuera");
  const keysDentro = await getAvailableKeys("esp8266dentro");
  let lastTimeFuera = -1;
  let lastTimeDentro = -1;
  if (keysFuera.length > 0) {
    lastTimeFuera = keysFuera[keysFuera.length - 1].split("esp8266fuera-")[1];
  }
  if (keysDentro.length > 0) {
    lastTimeDentro =
      keysDentro[keysDentro.length - 1].split("esp8266dentro-")[1];
  }
  let dataFuera = null;
  let dataDentro = null;

  if (lastTimeFuera !== -1) {
    dataFuera = await getEspData({
      Burl: "esp8266fuera",
      lastTime: lastTimeFuera,
    });
  }
  if (lastTimeDentro !== -1) {
    dataDentro = await getEspData({
      Burl: "esp8266dentro",
      lastTime: lastTimeDentro,
    });
  }

  if (dataFuera && typeof dataFuera != "string")
    dataFuera.forEach((element) => {
      saveDataBg("esp8266fuera", element);
    });
  if (dataDentro && typeof dataDentro != "string")
    dataDentro.forEach((element) => {
      saveDataBg("esp8266dentro", element);
    });

  if (
    !dataFuera ||
    (typeof dataFuera === "string" && !dataDentro) ||
    typeof dataDentro === "string"
  ) {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }
  console.log("Data fetched successfully");
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// Keys for AsyncStorage are formed by the server name and the epoch time of the reading
// e.g. "esp8266fuera-1630350000"

export async function getAvailableKeys(serverName) {
  let availableKeys = [];
  await AsyncStorage.getAllKeys((err, keys) => {
    if (err) {
      console.log("[getInitialData]AsyncStorage error: ", err);
    } else {
      availableKeys = keys.filter((key) => key.includes(serverName));
    }
  });
  if (availableKeys.length > 0) availableKeys.sort();
  return availableKeys;
}

export const AppProvider = ({ children }) => {
  function saveData(serverName, data) {
    let key = `${serverName}-${data.time}`;
    AsyncStorage.setItem(key, JSON.stringify(data), (err) => {
      if (err) {
        console.log("[saveData]AsyncStorage error: ", err);
      } else {
        console.log("[saveData]Data saved successfully");
      }
    });
  }
  let dataFuera = [];
  let dataDentro = [];

  function setDataFuera(data) {
    console.log("SETTING DATA esp8266fuera");
    if (data && typeof data != "string")
      data.forEach((element) => {
        saveData("esp8266fuera", element);
      });
  }
  function setDataDentro(data) {
    console.log("SETTING DATA: esp8266dentro");
    data.forEach((element) => {
      saveData("esp8266dentro", element);
    });
  }

  return (
    <AppContext.Provider
      value={{
        dataFuera,
        setDataFuera,
        dataDentro,
        setDataDentro,
        saveData,
        getAvailableKeys,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
