import React from "react";
import { Image } from "react-native";

export const Logo = ({ opacityStr, h, w }) => {
  let height = h ? h : 70;
  let width = w ? w : 70;

  return (
    <Image
      className={opacityStr}
      style={{ width: width, height: height }}
      source={require("../assets/logo.png")}
    />
  );
};
