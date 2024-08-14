import React from "react";
import { Text, ScrollView, View, Pressable } from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Logo } from "../components/Logo";

export default function About() {
  return (
    <ScrollView>
      <View className="flex-row justify-between items-center p-6">
        <Text className="text-white font-bold text-5xl text-center">About</Text>
        <Feather name="home" size={40} color="transparent" />
      </View>
      <View className="p-6">
        <View className="flex-row items-center pb-3">
          <Feather name="info" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para ver esta información
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Feather name="share" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            icono para exportar los datos de la casa
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Logo opacityStr="opacity-100" h={30} w={30} />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para volver a la pantalla principal
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Feather name="download" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para cargar nuevos datos de los sensores
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Feather name="list" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para ver la lista de las últimas 200 temperaturas
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Feather name="activity" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para ver la grafica de temperaturas
          </Text>
        </View>
        <View className="flex-row items-center pb-3">
          <Feather name="sliders" size={30} color="white" />
          <View className="pl-2">
            <Feather name="arrow-right" size={18} color="white" />
          </View>
          <Text className="text-white text-lg flex-1 pl-2" numberOfLines={4}>
            para cambiar la configuración de la aplicación (recargas en segundo
            plano)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
