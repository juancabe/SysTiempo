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
          Esta es la aplicacion para controlar el tiempo de casa, exterior e
          interior.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo de la casa, con una base de datos interna.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo exterior, con una base de datos externa,
          situada en los diferentes servidores de la red, estos tienen una
          capacidad de almacenamiento maxima de 3 semanas.
        </Text>
        <Text className="text-white text-lg">
          Esta es la aplicacion para controlar el tiempo de casa, exterior e
          interior.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo de la casa, con una base de datos interna.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo exterior, con una base de datos externa,
          situada en los diferentes servidores de la red, estos tienen una
          capacidad de almacenamiento maxima de 3 semanas.
        </Text>
        <Text className="text-white text-lg">
          Esta es la aplicacion para controlar el tiempo de casa, exterior e
          interior.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo de la casa, con una base de datos interna.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo exterior, con una base de datos externa,
          situada en los diferentes servidores de la red, estos tienen una
          capacidad de almacenamiento maxima de 3 semanas.
        </Text>
        <Text className="text-white text-lg">
          Esta es la aplicacion para controlar el tiempo de casa, exterior e
          interior.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo de la casa, con una base de datos interna.
        </Text>
        <Text className="text-white text-lg">
          Se puede ver el tiempo exterior, con una base de datos externa,
          situada en los diferentes servidores de la red, estos tienen una
          capacidad de almacenamiento maxima de 3 semanas.
        </Text>
      </View>
    </ScrollView>
  );
}
