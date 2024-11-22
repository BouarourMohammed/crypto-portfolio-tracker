import { useQuery } from "@tanstack/react-query";
import {
  fetchAssetIcons,
  fetchAllAssets,
  fetchAssetPriceHistory,
} from "./Coinapi";
import { AssetsResponse, IntervalTimeValue } from "@/types/coinAPI";

// load all asset icons
export const useLoadAllAssets = () => {
  return useQuery<AssetsResponse>({
    queryKey: ["loadAllAssets"],
    queryFn: fetchAllAssets,
    refetchInterval: Infinity,
    refetchOnReconnect: false,
  });
};

// Define the type for the returned data from fetchAssetIcons
type AssetIcons = { [key: string]: string };

// load all asset icons
export const useAssetsIcons = () => {
  return useQuery<AssetIcons>({
    queryKey: ["assetIcons"],
    queryFn: fetchAssetIcons,
    refetchInterval: Infinity,
    refetchOnReconnect: false,
  });
};

type GraphPoint = {
  date: Date;
  value: number;
};
// load asset price data for a given asset and currency (e.g. USD) for a specific time period
export const useAssetPriceHistory = (
  assetId: string,
  currency: string,
  beforeDuration: number = 24 * 60 * 60 * 1000,
  interval: IntervalTimeValue = "1SEC",
  limit: number = 1800,
  enabled: boolean = true
) => {
  return useQuery<GraphPoint[]>({
    queryKey: [
      "assetPriceHistory",
      assetId,
      currency,
      beforeDuration,
      interval,
      limit,
    ],
    queryFn: async () =>
      fetchAssetPriceHistory(
        assetId,
        currency,
        beforeDuration,
        interval,
        limit
      ),
    // TODO: make this configurable according to interval input
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchIntervalInBackground: false,
    enabled,
  });
};
