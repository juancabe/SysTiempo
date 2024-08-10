import React from "react";
import { Image } from "react-native";

export const Logo = () => {
  return (
    <Image
      className="w-[80px] h-[80px] opacity-90"
      source={require("../assets/logo.png")}
    />
  );
};
