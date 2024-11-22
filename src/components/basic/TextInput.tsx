import React from "react";
import {
  TextInput as RNTextInput,
  View,
  TextInputProps as RNTextInputProps,
  StyleSheet,
} from "react-native";
import { Text } from "./Text";
import { Colors } from "@/theme/Colors";

export interface TextInputProps extends RNTextInputProps {
  // this is used for the label in the top of the input
  label?: string;
  // this is used in the bottom of the input for an example value
  example?: string;
  // this is used to display an error message
  error?: string;
  // this is used reserve the space for the error message and avoid layout
  // jumping when the error message is displayed
  errorSpacing?: boolean;
  containerStyle?: any;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  example,
  error,
  errorSpacing,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="subtitle" style={styles.label}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          style,
          error ? { borderColor: Colors.red } : null,
        ]}
        placeholderTextColor={"#ccc"}
        {...rest}
      />
      {example && <Text style={styles.example}>{example}</Text>}
      {(errorSpacing || error) && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: Colors.red,
  },
  example: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "gray",
  },
  input: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "400",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 8,
    height: 42,
    backgroundColor: Colors.lightBlack2,
    paddingHorizontal: 16,
  },
  label: {
    marginBottom: 6,
  },
});

export default TextInput;
