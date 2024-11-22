import { Image } from "expo-image";
import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

import { Text } from "@/components/basic/Text";
import { Colors } from "@/theme/Colors";
import RoundButton from "@/components/basic/RoundButton";
import Button from "@/components/basic/Button";
import { usePortfolioTotal } from "@/screens/home/hooks/usePortfolioTotal";

interface UserDetailsProps extends ViewProps {
  onSettingPress?: () => void;
  onDepositPress?: () => void;
  onWithdrawPress?: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  style,
  onSettingPress,
  onDepositPress,
  onWithdrawPress,
  ...rest
}) => {
  const { total, currency } = usePortfolioTotal();
  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.detailsContainer}>
        <Image
          source={require("../../../../assets/icon.png")}
          style={{ width: 48, aspectRatio: 1, borderRadius: 50 }}
          contentFit="contain"
        />
        <View>
          <Text variant="title" fontSize={22}>
            {/* Sarah Simpson */}
            Bouarour Mohammed
          </Text>
          <Text color={Colors.text} variant="caption">
            bouarourmohammed93@gmail.com
          </Text>
        </View>
        <RoundButton
          icon="cog"
          onPress={onSettingPress}
          style={{ marginLeft: "auto" }}
        />
      </View>
      <View style={{ marginTop: 32 }}>
        <Text variant="caption" color={Colors.text}>
          Portfolio
        </Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text variant="title">
            {total > 0 ? total.toLocaleString("en-US") : "--.--"}
          </Text>
          <Text
            variant="default"
            style={{ marginBottom: 4 }}
            color={Colors.text}
          >
            {" " + currency}
          </Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          testID="depositButton"
          title="Deposit"
          style={{ width: "48%" }}
          onPress={onDepositPress}
        />
        <Button
          testID="withdrawButton"
          title="Withdraw"
          style={{ width: "48%" }}
          onPress={onWithdrawPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlack,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginRight: "auto",
    width: "100%",
  },
  buttonsContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
