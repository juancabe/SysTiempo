import React from "react";
import { DrawerLayoutAndroid } from "react-native";

async function fetchData(url) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const responseText = xhr.responseText;
        console.log("Response text:", responseText.length);
      } else {
        console.error("Request failed with status:", xhr.status);
      }
    }
  };

  xhr.send();
}

function transformData(data) {
  /*
   data is raw text like this:
   {index:57,temp:28.95,hum:30.78,time:31662}
    {index:58,temp:29.52,hum:31.40,time:31663}
    {index:59,temp:30.07,hum:31.10,time:31664}
    --44Mp--
  */
  const lines = data.split("\n");
  const transformedData = lines
    .filter((line) => line.includes("index"))
    .map((line) => {
      const parts = line.split(",");
      const temp = parseFloat(parts[1].split(":")[1]);
      const hum = parseFloat(parts[2].split(":")[1]);
      return { temp, hum };
    });
  return transformedData;
}

export async function getEspData() {
  const urlDentro = "http://esp8266dentro.local/weathervector";
  const urlFuera = "http://esp8266fuera.local/weathervector";
  console.log("Fetching data from:", urlDentro);
  const response = await fetch(urlDentro);
  // 
  let text = response.text();
  console.log("Text:", text);

  return;
  const responseFuera = await fetchData(urlFuera);
  const responseDentro = await fetchData(urlDentro);
  return;

  const dataFuera = await responseFuera.body;
  const dataDentro = await responseDentro.body;

  console.log(responseFuera);
  console.log(dataDentro);

  const transformedDataFuera = transformData(dataFuera);
  const transformedDataDentro = transformData(dataDentro);

  return { fuera: transformedDataFuera, dentro: transformedDataDentro };
}
