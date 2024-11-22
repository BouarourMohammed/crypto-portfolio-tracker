import { COIN_API_ENDPOINT, COIN_API_KEY } from "@/constants";
import {
  AssetsResponse,
  ExchangeRateHistoryResponse,
  IntervalTimeValue,
} from "../types/coinAPI";

export const fetchAllAssets = async (): Promise<AssetsResponse> => {
  const response = await fetch(`${COIN_API_ENDPOINT}/assets`, {
    headers: { "X-CoinAPI-Key": COIN_API_KEY } as any,
  });

  if (!response.ok) {
    console.log(response);
    // throw new Error("Failed to fetch assets");
  }

  const data: AssetsResponse = await response.json();
  // console.log("inside :: data", data);
  return data;
};

export const fetchAssetIcons = async (): Promise<{ [key: string]: string }> => {
  const response = await fetch(`${COIN_API_ENDPOINT}/assets/icons/64`, {
    headers: { "X-CoinAPI-Key": COIN_API_KEY } as any,
  });
  const data = await response.json();

  // console.log(">>>>>>>> data", data);
  // Convert data into a map of icon_id to icon_url for quick lookups
  const iconMap: { [key: string]: string } = {};
  data.forEach((icon: { asset_id: string; url: string }) => {
    iconMap[icon.asset_id] = icon.url;
  });

  return iconMap;
};

// This function fetches the asset price history for a specific asset and currency.
export const fetchAssetPriceHistory = async (
  assetId: string,
  currency: string,
  beforeDuration: number = 24 * 60 * 60 * 1000,
  interval: IntervalTimeValue = "1SEC",
  limit: number = 1800
) => {
  const startTime = new Date(Date.now() - beforeDuration).toISOString();
  const response = await fetch(
    `${COIN_API_ENDPOINT}/exchangerate/${assetId}/${currency}/history?period_id=${interval}&limit=${limit}&time_start=${startTime}`,
    {
      headers: { "X-CoinAPI-Key": COIN_API_KEY } as any,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch price history data");
  }
  const data: ExchangeRateHistoryResponse = await response.json();
  const result = data.map((item) => ({
    // we can update this to user the most recent data or the oldest data or the average of the two ...
    date: new Date(item.time_open),
    value: item.rate_open,
  }));
  return result;
};
