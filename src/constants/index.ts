import { IntervalTimeValue } from "@/types/coinAPI";

export const COIN_API_KEY = process.env.EXPO_PUBLIC_COIN_API_KEY; // "6a7ee7--";
export const COIN_API_WS_ENDPOINT = "wss://ws.coinapi.io/v1/";
export const COIN_API_ENDPOINT = "https://rest.coinapi.io/v1";
export const ASSETS_ICONS_PLACEHOLDER_PATH =
  "https://cdn.prod.website-files.com/6064b31ff49a2d31e0493af1/63a33142543b14619c58626f_coinapi.svg";
export const DEFAULT_CURRENCY = "USDT";
export const FADING_DELAY = 1500;

export const HISTORY_CONFIG: Record<
  string,
  { durationBefore: number; interval: IntervalTimeValue; limit: number }
> = Object.freeze({
  Day: {
    durationBefore: 24 * 60 * 60 * 1000,
    interval: "30MIN",
    limit: 48,
  },
  Week: {
    durationBefore: 7 * 24 * 60 * 60 * 1000,
    interval: "3HRS",
    limit: 56,
  },
  Month: {
    durationBefore: 30 * 24 * 60 * 60 * 1000,
    interval: "12HRS",
    limit: 60,
  },
  "6M": {
    durationBefore: 6 * 30 * 24 * 60 * 60 * 1000,
    interval: "3DAY",
    limit: 60,
  },
  "1Y": {
    durationBefore: 12 * 30 * 24 * 60 * 60 * 1000,
    interval: "5DAY",
    limit: 72,
  },
});
