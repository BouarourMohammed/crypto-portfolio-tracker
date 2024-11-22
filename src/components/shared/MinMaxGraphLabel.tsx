import { ViewProps, StyleSheet } from "react-native";
import Animated, {
  AnimatedProps,
  LinearTransition,
} from "react-native-reanimated";

import { Text } from "../basic/Text";
import { Colors } from "@/theme/Colors";

interface MinMaxGraphLabelProps extends AnimatedProps<ViewProps> {
  value: number;
  width: number;
  offsetPercentage: number;
}

export const MinMaxGraphLabel: React.FC<MinMaxGraphLabelProps> = ({
  value,
  width,
  style,
  offsetPercentage,
  ...rest
}) => {
  return (
    <Animated.View
      key={"TopAxisLabel"}
      style={[{ alignItems: "flex-start" }, style]}
      layout={LinearTransition}
      {...rest}
    >
      <Text
        variant="caption"
        color={Colors.white}
        style={{
          marginLeft: Math.max(
            Math.min(offsetPercentage * width - 40, width - 80),
            0
          ),
          ...styles.label,
        }}
      >
        {value?.toLocaleString("en-US")}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  label: {
    width: 80,
    textAlign: "center",
    fontWeight: "bold",
  },
});
