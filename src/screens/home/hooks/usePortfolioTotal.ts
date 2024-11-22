import { queryClient } from "@/client";
import {
  setGlobalState,
  StateKeys,
  useGlobalState,
} from "../../../hooks/useGlobalState";
import { DEFAULT_CURRENCY } from "@/constants";
import { useActiveCurrency } from "../../../hooks/useActiveCurrency";
import { useEffect } from "react";
import { ws } from "@/client/Ws";

// this function is used to calculate the portfolio total
const setUserTotal = () => {
  // get all user assets and calculate total
  const myAssets = queryClient.getQueryData<{ [key: string]: number }>([
    StateKeys.myAssets,
  ]);
  // get active currency
  const currency =
    queryClient.getQueryData<string>([StateKeys.activeCurrency]) ||
    DEFAULT_CURRENCY;
  const allCurrencies = Object.keys(myAssets || {});
  // calculate total
  if (allCurrencies.length > 0) {
    const total = allCurrencies.reduce((prec, key) => {
      if (prec < 0 || !myAssets?.[key]) return -1;
      const currentPrice =
        currency === key
          ? 1
          : queryClient.getQueryData<number>([`${key}_${currency}`]);
      return currentPrice ? prec + myAssets[key] * currentPrice : -1;
    }, 0);
    setGlobalState(StateKeys.myTotal, total);
  } else {
    setGlobalState(StateKeys.myTotal, -1);
  }
};

export const usePortfolioTotal = () => {
  const { state: total } = useGlobalState<number>(StateKeys.myTotal, -1);
  const { currency } = useActiveCurrency();
  const { state: myAssets } = useGlobalState<{ [key: string]: number }>(
    StateKeys.myAssets,
    {}
  );

  useEffect(() => {
    // when the user assets or currency changes, we need to recalculate the portfolio total
    setUserTotal();
    const keys = Object.keys(myAssets);
    const assets = keys.map((key) => ({ assetId: key, currency }));
    // subscribe to the asset price changes
    const unsubscribe = ws.onValueUpdate(assets, (_) => {
      setUserTotal();
    });
    return () => {
      unsubscribe();
    };
  }, [currency, myAssets]);

  return { total, myAssets, currency };
};
