import { ws } from "@/client/Ws";
import { useEffect } from "react";
import { useActiveCurrency } from "./useActiveCurrency";

export const useWSSubscribe = (assetId: string) => {
  const { currency } = useActiveCurrency();
  useEffect(() => {
    if (currency !== assetId) {
      ws.subscribe([{ assetId, currency }]);
      return () => ws.unsubscribe([{ assetId, currency }]);
    }
  }, [currency]);
};
