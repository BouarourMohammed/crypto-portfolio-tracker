import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { Text } from "./Text";
import { Colors } from "../../theme/Colors";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ style, title, disabled, ...rest }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.button, style]}
      {...rest}
    >
      <Text
        variant="caption"
        fontSize={14}
        color={disabled ? "gray" : Colors.white}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.lightBlack2,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minWidth: 120,
  },
});
export default Button;
