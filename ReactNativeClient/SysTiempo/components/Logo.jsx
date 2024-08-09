import React from "react";
import { Image } from "react-native";

export const Logo = () => {
  return (
    <Image
      style={{ width: 80, height: 80 }}
      source={require("../assets/logo.png")}
    />
  );
};
