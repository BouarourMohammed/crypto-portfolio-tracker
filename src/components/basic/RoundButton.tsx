import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { Colors } from "../../theme/Colors";
import Entypo from "@expo/vector-icons/Entypo";

export interface RoundButtonProps extends TouchableOpacityProps {
  icon: "chevron-small-left" | "star" | "cog" | "trash";
  size?: number;
  iconSize?: number;
  color?: string;
}

const RoundButton: React.FC<RoundButtonProps> = ({
  style,
  icon,
  size = 42,
  iconSize = 24,
  color = Colors.white,
  ...rest
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, style, { width: size }]}
      {...rest}
    >
      <Entypo name={icon} size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.lightBlack2,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
    width: 42,
    aspectRatio: 1,
  },
});
export default RoundButton;
