import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  StyleSheet,
} from "react-native";
import { LineGraph } from "react-native-graph";

import { Text } from "../../../components/basic/Text";
import { Colors } from "@/theme/Colors";
import { useAssetHistoryState } from "@/hooks/useAssetState";
import { AssetIcon } from "../../../components/shared/AssetIcon";
import { useWSSubscribe } from "@/hooks/useWSSubscribe";
import { formatNumber } from "@/utils";

interface AssetCardProps extends Omit<TouchableOpacityProps, "onPress"> {
  name?: string;
  amount?: number;
  assetId: string;
  price?: number;
  hideBottomBorder?: boolean;
  onPress?: (currency: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  name,
  amount,
  assetId,
  style,
  price,
  hideBottomBorder,
  onPress,
  ...rest
}) => {
  const {
    currentPrice,
    isError,
    priceHistory,
    priceChangePercent,
    priceChange,
    currency,
    isLoading,
  } = useAssetHistoryState(assetId, "Day");

  const noDataState = isLoading || isError;

  useWSSubscribe(assetId);

  return (
    <TouchableOpacity
      style={[
        { ...styles.container, borderBottomWidth: hideBottomBorder ? 0 : 1 },
        style,
      ]}
      {...rest}
      onPress={() => onPress?.(currency)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AssetIcon assetId={assetId} />
        <View style={styles.nameAbrContainer}>
          <Text
            variant="subtitle"
            fontSize={14}
            style={{ maxWidth: 80 }}
            ellipsizeMode="tail"
          >
            {name || formatNumber(amount || 0, true)}
          </Text>
          <Text variant="caption" color={Colors.text}>
            {assetId}
          </Text>
        </View>
      </View>
      <LineGraph
        points={priceHistory || []}
        style={styles.graph}
        color="#ffffff"
        enableNaturalCorners={true}
        tension={0}
        lineThickness={1}
        animated={true}
        gradientFillColors={[
          priceChange >= 0 ? Colors.green : Colors.red,
          "transparent",
        ]}
      />
      <View style={styles.changeDetailsContainer}>
        <Text variant="subtitle" fontSize={14}>
          {!noDataState
            ? formatNumber(currentPrice, true)
            : price
            ? formatNumber(price, true)
            : "--.--"}{" "}
          <Text variant="subtitle" fontSize={14} color={Colors.text}>
            {currency}
          </Text>
        </Text>
        {assetId !== currency && !noDataState && (
          <View style={styles.priceChangesContainer}>
            <Text
              variant="caption"
              color={Colors.text}
              style={{ marginRight: 8 }}
            >
              {formatNumber(priceChange)}
            </Text>
            <Text
              variant="caption"
              color={priceChange >= 0 ? Colors.green : Colors.red}
            >
              {formatNumber(priceChangePercent)}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AssetCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    borderBottomColor: Colors.lightBlack2,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  nameAbrContainer: {
    justifyContent: "center",
    gap: 2,
    marginLeft: 12,
  },
  changeDetailsContainer: {
    justifyContent: "center",
    marginRight: 16,
    alignItems: "flex-end",
    gap: 4,
    width: "28%",
  },
  priceChangesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  graph: {
    width: "28%",
    alignSelf: "center",
    maxWidth: 100,
    marginLeft: "auto",
  },
});
