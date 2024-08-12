import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LineChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import Svg, { Line as SvgLine } from "react-native-svg";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

function ShowGraph({ data }) {
  const formattedData = data.map((item) => ({
    time: new Date(item.time * 1000),
    temp: item.temp,
    hum: item.hum, // Humidity stored as .hum
  }));

  const temps = formattedData.map((item) => item.temp);
  const humidity = formattedData.map((item) => item.hum);
  const times = formattedData.map((item) => item.time);

  // Determine the step size to show only 10 labels on the X-axis
  const labelCount = 5;
  const step = Math.ceil(times.length / labelCount);

  // Function to format date and time
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month} ${hours}:${minutes}`;
  };

  return (
    <View className="flex-1">
      <View style={{ height: 200, flexDirection: "row" }}>
        {/* Y-Axis for Temperature */}
        <View className="flex-row">
          <YAxis
            data={temps}
            formatLabel={(value) => (value === ~~value ? value : "")}
            contentInset={{ top: 20, bottom: 20 }}
            svg={{ fontSize: 10, fill: "white" }}
          />
        </View>

        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <LineChart
            style={{ flex: 1 }}
            data={temps}
            svg={{ stroke: "rgb(255, 90, 40)", strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20 }}
            yMin={Math.min(...temps)}
            yMax={Math.max(...temps)}
          >
            <Grid svg={{ stroke: "rgba(255, 255, 255, 0.2)" }} />
          </LineChart>
          <LineChart
            style={StyleSheet.absoluteFill} // Overlay humidity line chart on the same graph
            data={humidity}
            svg={{ stroke: "rgba(34, 192, 100, 0.6)", strokeWidth: 1 }}
            contentInset={{ top: 20, bottom: 20 }}
            yMin={Math.min(...humidity)}
            yMax={Math.max(...humidity)}
          />
        </View>
        {/* Y-Axis for Humidity */}
        <YAxis
          data={humidity}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10, fill: "white" }}
          style={{ marginLeft: 10 }} // Push the humidity axis to the right
          numberOfTicks={6}
          formatLabel={(value) => `.${value}`}
        />
      </View>
      <XAxis
        style={{ height: 30 }}
        data={times}
        formatLabel={(value, index) =>
          index % step === 3 ? formatDate(times[index]) : ""
        }
        contentInset={{ left: 30, right: 30 }}
        svg={{ fontSize: 10, fill: "white" }}
        scale={scale.scaleTime}
      />
    </View>
  );
}

export function Graph() {
  const [dataDentro, setDataDentro] = useState([]);
  const [dataFuera, setDataFuera] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga

  const [isPressed24h, setIsPressed24h] = useState(true);
  const [isPressed7d, setIsPressed7d] = useState(false);
  const [isPressed1m, setIsPressed1m] = useState(false);
  const [isPressed1y, setIsPressed1y] = useState(false);
  const [isPressedAll, setIsPressedAll] = useState(false);

  async function fillData(serverName, setData) {
    let availableKeys = [];
    await AsyncStorage.getAllKeys().then((keys) => {
      availableKeys = keys.filter((key) => key.includes(serverName));
      if (availableKeys.length > 0) availableKeys.sort();
      const promises = availableKeys.map((key) =>
        AsyncStorage.getItem(key).then((value) => JSON.parse(value)),
      );
      Promise.all(promises).then((values) => {
        // Reduce data to approximately 150 items
        const dataLength = values.length;
        const step = Math.ceil(dataLength / 150); // Adjusted step to reduce to approximately 150 items

        // Create an array to hold the reduced values
        const reducedValues = [];

        // Compute the mean of the surrounding values and reduce the data
        for (let i = 0; i < dataLength; i += step) {
          let sumTemp = 0;
          let sumHum = 0;
          let count = 0;

          for (let j = i; j < i + step && j < dataLength; j++) {
            sumTemp += values[j].temp;
            sumHum += values[j].hum;
            count++;
          }

          reducedValues.push({
            temp: sumTemp / count,
            hum: sumHum / count,
            time: values[i].time,
          });
        }

        // Set the reduced data
        setData(reducedValues);
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
    <View className="flex-1 bg-black justify-start">
      <View className="flex-1">
        {dataFuera.length > 0 ? (
          <View className="flex-1 border-white">
            <Text className="text-white text-3xl text-center px-3">
              Datos fuera
            </Text>
            <View className="p-3">
              <ShowGraph
                data={dataFuera.slice(
                  -(isPressed24h
                    ? 144
                    : isPressed7d
                      ? 1008
                      : isPressed1m
                        ? 43200
                        : isPressed1y
                          ? 525600
                          : 0),
                )}
              />
            </View>
          </View>
        ) : (
          <Text className="text-white text-3xl text-center p-3">
            No hay datos fuera
          </Text>
        )}
        {dataDentro.length > 0 || dataFuera.length > 0 ? (
          <View className="flex-row justify-around">
            <StyledPressable
              onPress={() => {
                if (!isPressed24h) {
                  setIsPressed24h(true);
                  if (isPressed7d) {
                    setIsPressed7d(false);
                  } else if (isPressed1m) {
                    setIsPressed1m(false);
                  } else if (isPressed1y) {
                    setIsPressed1y(false);
                  } else if (isPressedAll) {
                    setIsPressedAll(false);
                  }
                }
              }}
              className={`bg-sky-600 rounded-md ${isPressed24h ? "bg-sky-900" : ""}`}
            >
              <Text className="text-white text-xl text-center p-3">24H</Text>
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (!isPressed7d) {
                  setIsPressed7d(true);
                  if (isPressed24h) {
                    setIsPressed24h(false);
                  } else if (isPressed1m) {
                    setIsPressed1m(false);
                  } else if (isPressed1y) {
                    setIsPressed1y(false);
                  } else if (isPressedAll) {
                    setIsPressedAll(false);
                  }
                }
              }}
              className={`bg-sky-600 rounded-md ${isPressed7d ? "bg-sky-900" : ""}`}
            >
              <Text className="text-white text-xl text-center p-3">7DY</Text>
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (!isPressed1m) {
                  setIsPressed1m(true);
                  if (isPressed7d) {
                    setIsPressed7d(false);
                  } else if (isPressed24h) {
                    setIsPressed24h(false);
                  } else if (isPressed1y) {
                    setIsPressed1y(false);
                  } else if (isPressedAll) {
                    setIsPressedAll(false);
                  }
                }
              }}
              className={`bg-sky-600 rounded-md ${isPressed1m ? "bg-sky-900" : ""}`}
            >
              <Text className="text-white text-xl text-center p-3">1MT</Text>
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (!isPressed1y) {
                  setIsPressed1y(true);
                  if (isPressed7d) {
                    setIsPressed7d(false);
                  } else if (isPressed1m) {
                    setIsPressed1m(false);
                  } else if (isPressed24h) {
                    setIsPressed24h(false);
                  } else if (isPressedAll) {
                    setIsPressedAll(false);
                  }
                }
              }}
              className={`bg-sky-600 rounded-md ${isPressed1y ? "bg-sky-900" : ""}`}
            >
              <Text className="text-white text-xl text-center p-3">1YR</Text>
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (!isPressedAll) {
                  setIsPressedAll(true);
                  if (isPressed7d) {
                    setIsPressed7d(false);
                  } else if (isPressed1m) {
                    setIsPressed1m(false);
                  } else if (isPressed1y) {
                    setIsPressed1y(false);
                  } else if (isPressed24h) {
                    setIsPressed24h(false);
                  }
                }
              }}
              className={`bg-sky-600 rounded-md ${isPressedAll ? "bg-sky-900" : ""}`}
            >
              <Text className="text-white text-xl text-center p-3">ALL</Text>
            </StyledPressable>
          </View>
        ) : null}
        {dataDentro.length > 0 ? (
          <View className="flex-1 border-white">
            <Text className="text-white text-3xl text-center p-3">
              Datos dentro
            </Text>
            <View className="p-3">
              <ShowGraph
                data={dataDentro.slice(
                  -(isPressed24h
                    ? 144
                    : isPressed7d
                      ? 1008
                      : isPressed1m
                        ? 43200
                        : isPressed1y
                          ? 525600
                          : 0),
                )}
              />
            </View>
          </View>
        ) : (
          <Text className="text-white text-3xl text-center p-3">
            No hay datos dentro
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  chart: {
    flex: 1,
  },
});
