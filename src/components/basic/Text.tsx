import React, { useMemo } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";
import { Colors } from "../../theme/Colors";

export interface TextProps extends RNTextProps {
  variant?: "default" | "caption" | "title" | "subtitle";
  color?: string;
  fontSize?: number;
}

export const Text: React.FC<TextProps> = ({
  variant = "default",
  children,
  color = Colors.white,
  fontSize,
  style,
  ...rest
}) => {
  const combinedStyles = useMemo(
    () => [
      textStyles[variant],
      fontSize ? { fontSize } : {},
      color ? { color } : {},
      style,
    ],
    [variant, fontSize, color, style]
  );

  return (
    <RNText style={combinedStyles} {...rest}>
      {children}
    </RNText>
  );
};

export const textStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Geist Mono",
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Geist Mono",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Geist Mono",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Geist Mono",
  },
});
