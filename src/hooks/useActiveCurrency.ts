import { DEFAULT_CURRENCY } from "@/constants";
import { StateKeys, useGlobalState } from "./useGlobalState";

// this hook is used to get the active currency (quote currency) of the app
export const useActiveCurrency = () => {
  const { state: currency } = useGlobalState<string>(
    StateKeys.activeCurrency,
    DEFAULT_CURRENCY
  );
  return { currency };
};
