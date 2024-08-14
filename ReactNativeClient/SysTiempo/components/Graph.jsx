import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LineChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as scale from "d3-scale";
import Svg, { Line as SvgLine, G as G } from "react-native-svg";
import { styled } from "nativewind";

const StyledPressable = styled(Pressable);

const DAY = 144;
const WEEK = 1008;
const MONTH = 4032;
const YEAR = 525600;
const ALL = 0;

async function reduceValues(data, time) {
  const slicedData = data.slice(-time);
  // Create an array to hold the reduced data
  const reducedValues = [];
  const stepR = Math.ceil(slicedData.length / 140);
  // Compute the mean of the surrounding slicedData and reduce the slicedData
  for (let i = 0; i < slicedData.length; i += stepR) {
    let sumTemp = 0;
    let sumHum = 0;
    let count = 0;

    for (
      let j = i - ~~(stepR / 2);
      j < i + ~~(stepR / 2) && j < slicedData.length;
      j++
    ) {
      if (j < 0) continue;
      sumTemp += slicedData[j].temp;
      sumHum += slicedData[j].hum;
      count++;
    }

    reducedValues.push({
      temp: sumTemp / count,
      hum: sumHum / count,
      time: slicedData[i].time,
    });
  }
  return reducedValues;
}

function ShowGraph({ data, time }) {
  const formattedData = data.map((item) => ({
    time: new Date(item.time * 1000),
    temp: item.temp,
    hum: item.hum,
  }));

  const temps = formattedData.map((item) => item.temp);
  const humidity = formattedData.map((item) => item.hum);
  const times = formattedData.map((item) => item.time);

  // Determine the step size to show only 10 labels on the bottom X-axis
  const labelCount = 10;
  const step = Math.ceil(times.length / labelCount);

  // Function to format time
  const formatDate = (date) => {
    if (time === DAY) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else if (time === WEEK) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month}`;
    } else if (time === MONTH) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}/${month}`;
    } else if (time === YEAR) {
      const month = date.getMonth();
      return month;
    } else {
      const year = date.getFullYear().toString().slice(-2);
      return year;
    }
  };

  // Function to format date for the new X-axis on top
  const formatDateStart = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    // year in 2 digits
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month} ${year}`;
  };

  // Custom Grid Component
  const CustomGrid = ({ x, y, data }) => {
    const lines = [];

    for (let i = 1; i < times.length; i++) {
      const current =
        time === DAY
          ? times[i].getDate()
          : time === WEEK
            ? times[i].getDate()
            : time === MONTH
              ? ~~(times[i].getDate() / 7)
              : time === YEAR
                ? times[i].getMonth()
                : times[i].getMonth();
      const prev =
        i - 1 >= 0
          ? time === DAY
            ? times[i - 1].getDate()
            : time === WEEK
              ? times[i - 1].getDate()
              : time === MONTH
                ? ~~(times[i - 1].getDate() / 7)
                : time === YEAR
                  ? times[i - 1].getMonth()
                  : times[i - 1].getMonth()
          : 0;

      if (current > prev) {
        lines.push(
          <SvgLine
            key={`line-${i}`}
            x1={x(i)}
            x2={x(i)}
            y1="0%"
            y2="100%"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth={1}
          />,
        );
      }
    }

    return <G>{lines}</G>;
  };
  return (
    <View className="flex">
      {/* New X-Axis at the top for day start */}
      <XAxis
        style={{ height: 30 }}
        data={times}
        formatLabel={(value, index) => {
          const current = times[index];
          const prev = times[index - 1];
          if (!prev) return;
          if (time < MONTH && time !== ALL) {
            if (current.getDate() !== prev.getDate()) {
              return formatDateStart(current);
            }
          } else if (time === MONTH) {
            if (~~(current.getDate() / 7) !== ~~(prev.getDate() / 7)) {
              return formatDateStart(current);
            }
          } else {
            if (current.getMonth() !== prev.getMonth()) {
              return formatDateStart(current);
            }
          }
          return "";
        }}
        contentInset={{ left: 30, right: 30 }}
        svg={{ fontSize: 10, fill: "white" }}
        scale={scale.scaleTime}
      />

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

        <View style={{ flex: 1, marginHorizontal: 5 }}>
          <LineChart
            style={{ flex: 1 }}
            data={temps}
            svg={{ stroke: "rgb(255, 90, 40)", strokeWidth: 2 }}
            contentInset={{ top: 20, bottom: 20 }}
            yMin={Math.min(...temps)}
            yMax={Math.max(...temps)}
            gridMin={Math.min(...temps)}
            gridMax={Math.max(...temps)}
            numberOfTicks={6}
          >
            <CustomGrid />
            <Grid svg={{ stroke: "rgba(255, 255, 255, 0.2)" }} />
          </LineChart>
          <LineChart
            style={StyleSheet.absoluteFill}
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
          style={{ marginLeft: 10 }}
          numberOfTicks={6}
          formatLabel={(value) => `.${value}`}
        />
      </View>

      {/* Bottom X-Axis for Time */}
      {time === DAY ? (
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
      ) : null}
    </View>
  );
}

export function Graph() {
  const [dataDentro, setDataDentro] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [dataFuera, setDataFuera] = useState([]);
  const [isLoading, setIsLoading] = useState("opacity-0");
  const [reducedDataDentro, setReducedDataDentro] = useState([]);
  const [reducedDataFuera, setReducedDataFuera] = useState([]);

  const [timePressed, setTimePressed] = useState(DAY);

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
      setIsLoading("");
    };

    fetchData();
  }, []);

  useEffect(() => {
    const reduceDataDentro = async () => {
      if (dataDentro.length > 0) {
        const reducedDataDentro = await reduceValues(dataDentro, timePressed);
        setReducedDataDentro(reducedDataDentro);
      }
    };
    const reduceDataFuera = async () => {
      if (dataFuera.length > 0) {
        const reducedDataFuera = await reduceValues(dataFuera, timePressed);
        setReducedDataFuera(reducedDataFuera);
      }
    };

    reduceDataFuera();
    reduceDataDentro();
    setIsLoading("");
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [timePressed, dataDentro, dataFuera, firstLoad]);

  if (firstLoad) {
    return null;
  }

  return (
    <View className="flex-1 bg-black justify-start">
      <View className="flex-1">
        {dataFuera.length > 0 ? (
          <View className="flex-1 border-white">
            <Text className="text-white text-3xl text-center px-3">
              Datos fuera
            </Text>
            <View className={"p-3 " + isLoading}>
              <ShowGraph data={reducedDataFuera} time={timePressed}></ShowGraph>
            </View>
          </View>
        ) : null}
        {dataDentro.length > 0 || dataFuera.length > 0 ? (
          <View className="flex-row justify-around items-center">
            <StyledPressable
              onPress={() => {
                if (!(timePressed === DAY)) {
                  setIsLoading("opacity-0");
                  setTimePressed(DAY);
                }
              }}
              className={`bg-sky-600 rounded-md ${timePressed === DAY ? "bg-sky-900" : ""}`}
            >
              {timePressed === DAY && isLoading ? (
                <>
                  <View className="absolute pl-2 pt-1">
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                  <Text className="text-white text-xl text-center p-3 opacity-0">
                    24H
                  </Text>
                </>
              ) : (
                <Text className="text-white text-xl text-center p-3">24H</Text>
              )}
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (
                  dataDentro.length < DAY * 1.1 ||
                  dataFuera.length < DAY * 1.1
                )
                  return;
                if (!(timePressed === WEEK)) {
                  setIsLoading("opacity-0");
                  setTimePressed(WEEK);
                }
              }}
              className={
                dataDentro.length < DAY * 1.1 || dataFuera.length < DAY * 1.1
                  ? "bg-orange-600 rounded-md"
                  : `bg-sky-600 rounded-md ${timePressed === WEEK ? "bg-sky-900" : ""}`
              }
            >
              {timePressed === WEEK && isLoading ? (
                <>
                  <View className="absolute pl-2 pt-1">
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                  <Text className="text-white text-xl text-center p-3 opacity-0">
                    7DY
                  </Text>
                </>
              ) : (
                <Text className="text-white text-xl text-center p-3">7DY</Text>
              )}
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (
                  dataDentro.length < WEEK * 1.1 ||
                  dataFuera.length < WEEK * 1.1
                )
                  return;
                if (!(timePressed === MONTH)) {
                  setIsLoading("opacity-0");
                  setTimePressed(MONTH);
                }
              }}
              className={
                dataDentro.length < WEEK * 1.1 || dataFuera.length < WEEK * 1.1
                  ? "bg-orange-600 rounded-md"
                  : `bg-sky-600 rounded-md ${timePressed === MONTH ? "bg-sky-900" : ""}`
              }
            >
              {timePressed === MONTH && isLoading ? (
                <>
                  <View className="absolute pl-2 pt-1">
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                  <Text className="text-white text-xl text-center p-3 opacity-0">
                    1MT
                  </Text>
                </>
              ) : (
                <Text className="text-white text-xl text-center p-3">1MT</Text>
              )}
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (
                  dataDentro.length < MONTH * 1.01 ||
                  dataFuera.length < MONTH * 1.01
                )
                  return;
                if (!(timePressed === YEAR)) {
                  setIsLoading("opacity-0");
                  setTimePressed(YEAR);
                }
              }}
              className={
                dataDentro.length < MONTH * 1.01 ||
                dataFuera.length < MONTH * 1.01
                  ? "bg-orange-600 rounded-md"
                  : `bg-sky-600 rounded-md ${timePressed === YEAR ? "bg-sky-900" : ""}`
              }
            >
              {timePressed === YEAR && isLoading ? (
                <>
                  <View className="absolute pl-2 pt-1">
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                  <Text className="text-white text-xl text-center p-3 opacity-0">
                    1YR
                  </Text>
                </>
              ) : (
                <Text className="text-white text-xl text-center p-3">1YR</Text>
              )}
            </StyledPressable>
            <StyledPressable
              onPress={() => {
                if (
                  dataDentro.length < YEAR * 1.01 ||
                  dataFuera.length < YEAR * 1.01
                )
                  return;
                if (!(timePressed === ALL)) {
                  setIsLoading("opacity-0");
                  setTimePressed(ALL);
                }
              }}
              className={
                dataDentro.length < YEAR * 1.01 ||
                dataFuera.length < YEAR * 1.01
                  ? "bg-orange-600 rounded-md"
                  : `bg-sky-600 rounded-md ${timePressed === ALL ? "bg-sky-900" : ""}`
              }
            >
              {timePressed === ALL && isLoading ? (
                <>
                  <View className="absolute pl-2 pt-1">
                    <ActivityIndicator size="large" color="#ffffff" />
                  </View>
                  <Text className="text-white text-xl text-center p-3 opacity-0">
                    All
                  </Text>
                </>
              ) : (
                <Text className="text-white text-xl text-center p-3">ALL</Text>
              )}
            </StyledPressable>
          </View>
        ) : null}
        {dataDentro.length > 0 ? (
          <View className="flex-1 border-white">
            <Text className="text-white text-3xl text-center p-3">
              Datos dentro
            </Text>
            <View className={"p-3 " + isLoading}>
              <ShowGraph
                data={reducedDataDentro}
                time={timePressed}
              ></ShowGraph>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
