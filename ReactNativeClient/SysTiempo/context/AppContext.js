import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext();

// Keys for AsyncStorage are formed by the server name and the epoch time of the reading
// e.g. "esp8266fuera-1630350000"

function getAvailableKeys(serverName) {
  let availableKeys = [];
  AsyncStorage.getAllKeys((err, keys) => {
    if (err) {
      console.log("[getInitialData]AsyncStorage error: ", err);
    } else {
      availableKeys = keys.filter((key) => key.includes(serverName));
      console.log("[getInitialData]availableKeys: ", availableKeys);
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
  let availableKeysFuera = getAvailableKeys("esp8266fuera");
  let availableKeysDentro = getAvailableKeys("esp8266dentro");
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
        availableKeysFuera,
        availableKeysDentro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
