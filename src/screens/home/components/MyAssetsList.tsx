import { View } from "react-native";
import { AssetsListProps } from "./AssetsList";
import AssetCard from "@/screens/home/components/AssetCard";
import { StateKeys, useGlobalState } from "@/hooks/useGlobalState";
import { Text } from "@/components/basic/Text";

const MyAssetsList: React.FC<AssetsListProps> = ({
  style,
  onPress,
  ...rest
}) => {
  const { state: data } = useGlobalState<{
    [key: string]: number;
  }>(StateKeys.myAssets, {});

  const activeData = Object.entries(data).map(([key, value]) => ({
    asset_id: key,
    amount: value,
  }));

  if (activeData.length === 0) {
    return <Text>No Assets!</Text>;
  }

  return (
    <View style={style} {...rest}>
      {activeData.map((asset, index) => (
        <AssetCard
          key={asset.asset_id}
          amount={asset.amount}
          assetId={asset.asset_id}
          style={{ marginBottom: 16 }}
          hideBottomBorder={index === activeData.length - 1}
          onPress={(currency) => onPress?.(asset.asset_id, currency)}
        />
      ))}
    </View>
  );
};

export default MyAssetsList;
