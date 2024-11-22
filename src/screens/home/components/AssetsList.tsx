import { useLoadAllAssets } from "@/api/CoinapiHooks";
import AssetCard from "@/screens/home/components/AssetCard";
import Button from "@/components/basic/Button";
import { useState } from "react";
import { View, ViewProps } from "react-native";

const itemsPerPage = 2; // Number of items to load per "page"

export interface AssetsListProps extends ViewProps {
  onPress?: (asset_id: string, currency: string) => void;
}

const AssetsList: React.FC<AssetsListProps> = ({ style, onPress, ...rest }) => {
  const { data } = useLoadAllAssets();
  // the coinapi api returns an array of assets and does not allow pagination
  // so we need paginate the data
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const activeData = (data || []).slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems((prev) => prev + itemsPerPage);
  };

  return (
    <View style={style} {...rest}>
      {activeData.map((asset, index) => (
        <AssetCard
          key={asset.asset_id}
          name={asset.name}
          assetId={asset.asset_id}
          price={asset.price_usd}
          style={{ marginBottom: 16 }}
          hideBottomBorder={index === visibleItems - 1}
          onPress={(currency) => onPress?.(asset.asset_id, currency)}
        />
      ))}
      {(data || [])?.length > visibleItems && (
        <Button
          title="Load More"
          onPress={loadMore}
          style={{ marginTop: 8, width: "50%", alignSelf: "center" }}
        />
      )}
    </View>
  );
};

export default AssetsList;
