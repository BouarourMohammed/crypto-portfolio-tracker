import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useAssetsIcons, useLoadAllAssets } from "@/api/CoinapiHooks";
import { RootStackNavigationProp } from "@/navigation";
import { FADING_DELAY } from "@/constants";

export const useLoadIconsAssets = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    data: icons,
    error: iconsError,
    isLoading: AllIconsLoading,
  } = useAssetsIcons();
  const {
    data: allAssets,
    error: allAssetsError,
    isLoading: allAssetsLoading,
  } = useLoadAllAssets();

  const loading = AllIconsLoading || allAssetsLoading;
  const error = iconsError || allAssetsError;

  useEffect(() => {
    if (!loading && !error && icons && allAssets) {
      setTimeout(() => navigation.navigate("Home"), FADING_DELAY + 1000);
    }
  }, [icons, allAssets]);

  return {
    loading,
    error,
    icons,
    allAssets,
  };
};
