import React from "react";
import { Text, ScrollView, View, Pressable } from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function About() {
  return (
    <ScrollView>
      <View className="flex-row justify-between items-center pt-6">
        <Text className="text-white font-bold text-5xl text-center">About</Text>
        <Feather name="home" size={40} color="transparent" />
      </View>
      <View className="pt-6">
        <Text className="text-white text-lg">
          Esta es la aplicacion para ver el tiempo de casa, exterior e interior.
        </Text>
        <Text className="text-white text-lg">
          Se guardarán los datos de la casa en una base de datos interna.
        </Text>
        <Text className="text-white text-lg">
          La primera vez que cargues los datos de la casa, tardará más tiempo.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo en un gráfico, en la sección de gráficos.
        </Text>
      </View>
    </ScrollView>
  );
}
