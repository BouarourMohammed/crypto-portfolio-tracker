import { View, ViewProps, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AnimatedRollingNumber } from "react-native-animated-rolling-numbers";

import { Text } from "../../../components/basic/Text";
import { Colors } from "@/theme/Colors";
import { useGlobalState } from "@/hooks/useGlobalState";
import RoundButton from "../../../components/basic/RoundButton";
import { formatNumber } from "@/utils";
import { AssetIcon } from "../../../components/shared/AssetIcon";
import { useEffect } from "react";
import { ws } from "@/client/Ws";

interface AssetHeaderProps extends ViewProps {
  assetId: string;
  price?: number;
  currency?: string;
  low?: number;
  high?: number;
  change?: number;
  changePercent?: number;
}

const AssetHeader: React.FC<AssetHeaderProps> = ({
  assetId,
  price = 1,
  style,
  currency,
  low = 0,
  high = 0,
  change = 0,
  changePercent = 0,
  ...rest
}) => {
  const navigation = useNavigation();
  const { state: currentPriceSelected } = useGlobalState<number>(
    `${assetId}_${currency}_SELECTED`,
    undefined
  );
  console.log(
    "currentPriceSelected",
    currentPriceSelected,
    price,
    `${assetId}_${currency}_SELECTED`
  );
  const activePrice = currentPriceSelected || price;

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.headerContainer}>
        <RoundButton
          icon="chevron-small-left"
          onPress={() => navigation.goBack()}
          size={38}
        />
        <View style={styles.titleContainer}>
          <AssetIcon size={22} assetId={assetId} />
          <View>
            <Text variant="title" fontSize={14}>
              {assetId} / {currency}
            </Text>
          </View>
        </View>
        <View style={{ width: 38 }} />
      </View>
      <View style={styles.detailsContainer}>
        <View style={{}}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <AnimatedRollingNumber
              value={activePrice}
              showPlusSign={false}
              showMinusSign={false}
              useGrouping
              textStyle={styles.rollingNumber}
              toFixed={2}
            />
            <Text
              variant="subtitle"
              fontSize={14}
              color={Colors.text}
              style={{ marginBottom: 2 }}
            >
              {"  " + currency}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text variant="subtitle" fontSize={14} color={Colors.text}>
              {formatNumber(change)}
            </Text>
            <Text
              variant="subtitle"
              fontSize={14}
              color={changePercent >= 0 ? Colors.green : Colors.red}
            >
              {formatNumber(changePercent)}%
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <Text variant="caption" color={Colors.text}>
              HIGH
            </Text>
            <Text variant="title" fontSize={14}>
              {high > 0 ? formatNumber(high, true) : "--.--"}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <Text variant="caption" color={Colors.text}>
              LOW
            </Text>
            <Text variant="title" fontSize={14}>
              {low > 0 ? formatNumber(low, true) : "--.--"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlack,
    padding: 16,
    borderRadius: 12,
  },
  rollingNumber: {
    fontSize: 22,
    color: Colors.white,
    fontFamily: "Geist Mono",
    fontWeight: "medium",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default AssetHeader;
