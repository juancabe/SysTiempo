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
  const [availableKeysFuera, setAvailableKeysFuera] = useState(
    getAvailableKeys("esp8266fuera"),
  );
  const [availableKeysDentro, setAvailableKeysDentro] = useState(
    getAvailableKeys("esp8266dentro"),
  );
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <AppContext.Provider
      value={{
        dataFuera,
        setDataFuera,
        dataDentro,
        setDataDentro,
        saveData,
        availableKeysFuera,
        setAvailableKeysFuera,
        availableKeysDentro,
        setAvailableKeysDentro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
