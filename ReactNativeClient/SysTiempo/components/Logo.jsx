import React from "react";
import { Image } from "react-native";

export const Logo = () => {
  return (
    <Image
      className="w-20 h-20 opacity-90"
      source={require("../assets/logo.png")}
    />
  );
};
