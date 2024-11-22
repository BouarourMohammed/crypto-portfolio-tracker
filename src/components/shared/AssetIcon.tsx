import { Image, ImageProps } from "expo-image";

import { useAssetsIcons } from "@/api/CoinapiHooks";
import { ASSETS_ICONS_PLACEHOLDER_PATH } from "@/constants";

interface AssetIconProps extends ImageProps {
  assetId: string;
  size?: number;
}

export const AssetIcon: React.FC<AssetIconProps> = ({
  assetId,
  style,
  size = 32,
  ...rest
}) => {
  const { data: icons } = useAssetsIcons();
  return (
    <Image
      source={{
        uri: icons?.[assetId] || ASSETS_ICONS_PLACEHOLDER_PATH,
      }}
      style={[{ height: size, aspectRatio: 1 }, style]}
      contentFit="contain"
      {...rest}
    />
  );
};
