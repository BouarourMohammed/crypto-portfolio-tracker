import { useAssetPriceHistory } from "@/api/CoinapiHooks";
import { useActiveCurrency } from "./useActiveCurrency";
import { useGlobalState } from "./useGlobalState";
import { HISTORY_CONFIG } from "@/constants";
import { queryClient } from "@/client";

export const useAssetHistoryState = (
  assetId: string,
  historyConfig: keyof typeof HISTORY_CONFIG = "Day"
) => {
  const historyParams = HISTORY_CONFIG[historyConfig];
  const { currency } = useActiveCurrency();
  const {
    data: priceHistoryData,
    isLoading,
    isFetching: isFetchingPriceHistory,
    error,
  } = useAssetPriceHistory(
    assetId,
    currency,
    historyParams.durationBefore,
    historyParams.interval,
    historyParams.limit
    // assetId !== currency
  );

  const { state: currentPrice } = useGlobalState<number>(
    `${assetId}_${currency}`,
    assetId === currency
      ? 1
      : // this is a fallback for when the price is not available it will return the last price from the history
        (!isLoading &&
          priceHistoryData?.[priceHistoryData.length - 1]?.value) ||
          -1
  );

  // if the history is not loaded or the data is empty, we consider it as an error
  const isError =
    error ||
    ((!priceHistoryData || priceHistoryData?.length === 0) &&
      new Error("No price History"));

  //  the date data become string -  persist data issue (fetch from storage)
  const priceHistory =
    priceHistoryData?.map((item) => ({
      value: item.value,
      date: new Date(item.date),
    })) || [];

  const previousPrice = priceHistory?.[0]?.value || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice
    ? (priceChange / previousPrice) * 100
    : 0;
  console.log("previousPrice", previousPrice, currentPrice);

  const minValueIndex =
    priceHistoryData?.reduce(
      (minIdx, item, idx, arr) =>
        item.value < arr[minIdx].value ? idx : minIdx,
      0
    ) || 0;
  const maxValueIndex =
    priceHistoryData?.reduce(
      (maxIdx, item, idx, arr) =>
        item.value > arr[maxIdx].value ? idx : maxIdx,
      0
    ) || 0;

  return {
    isLoading, // loading state
    isError, // error state mainly for loading history data error if we don't have history data this considered as an error for this hook
    currentPrice, // current price of the asset based on the currency rate using webSocket
    priceHistory, // array of the price history
    priceChangePercent, // percentage change of the asset price
    priceChange, // current price - previous price
    minValueIndex, // index of the min value in the priceHistory
    maxValueIndex, // index of the max value in the priceHistory
    currency, // currency (quote currency) of the asset
    isFetchingPriceHistory, // is fetching price history
  };
};
