export interface Asset {
  asset_id: string; // Asset ID
  name: string; // Asset name
  type_is_crypto: number; // 1 for crypto, 0 for fiat
  data_start: string;
  data_end: string;
  data_quote_start: string;
  data_quote_end: string;
  data_orderbook_start: string;
  data_orderbook_end: string;
  data_trade_start: string;
  data_trade_end: string;
  data_symbols_count: number;
  volume_1hrs_usd?: number; // Volume in USD for the last hour
  volume_1day_usd?: number; // Volume in USD for the last day
  volume_1mth_usd?: number; // Volume in USD for the last month
  price_usd?: number; // Current price in USD
  id_icon?: string; // Icon ID
}

export type AssetsResponse = Asset[];

type ExchangeRateHistory = {
  time_period_start: string; // ISO date string of the period start
  time_period_end: string; // ISO date string of the period end
  time_open: string; // ISO date string of the open time
  time_close: string; // ISO date string of the close time
  rate_open: number; // Opening exchange rate
  rate_high: number; // Highest exchange rate in the period
  rate_low: number; // Lowest exchange rate in the period
  rate_close: number; // Closing exchange rate
};

export type ExchangeRateHistoryResponse = ExchangeRateHistory[];

export type ExchangeRateData = {
  asset_id_base: string;
  asset_id_quote: string;
  rate: number;
  rate_type: string;
  time: string;
  type: string;
};

export type TradeData = {
  symbol_id: string; // The symbol ID, e.g., "BINANCE_SPOT_BTC_USDT"
  price: number; // Price of the trade
  size: number; // Size/amount of the trade
  taker_side: string; // Taker side, e.g., "buy" or "sell"
  time_exchange: string; // Time of the trade on the exchange in ISO format
  time_coinapi: string; // Time of the trade reported by CoinAPI in ISO format
};

export type SymbolData = {
  /** Unique identifier for the symbol in the format `EXCHANGE_SPOT_BASE_QUOTE`, e.g., "HITBTC_SPOT_BTC_USDT" */
  symbol_id: string;
  /** Identifier for the exchange, e.g., "HITBTC" */
  exchange_id: string;
  /** Type of the symbol, typically "SPOT" for spot markets */
  symbol_type: string;
  /** Identifier for the base asset in the trading pair, e.g., "BTC" */
  asset_id_base: string;
  /** Identifier for the quote asset in the trading pair, e.g., "USDT" */
  asset_id_quote: string;
  /** ISO date string indicating the start date of data availability, e.g., "2013-12-27" */
  data_start: string;
  /** ISO date string indicating the end date of data availability, e.g., "2024-11-08" */
  data_end: string;
  /** ISO timestamp indicating the start of quote data availability, e.g., "2017-03-18T00:00:00.0000000Z" */
  data_quote_start: string;
  /** ISO timestamp indicating the end of quote data availability, e.g., "2024-11-08T00:00:00.0000000Z" */
  data_quote_end: string;
  /** ISO timestamp indicating the start of order book data availability, e.g., "2017-03-18T22:53:48.7935165Z" */
  data_orderbook_start: string;
  /** ISO timestamp indicating the end of order book data availability, e.g., "2023-07-07T00:00:00.0000000Z" */
  data_orderbook_end: string;
  /** ISO timestamp indicating the start of trade data availability, e.g., "2013-12-27T00:00:00.0000000Z" */
  data_trade_start: string;
  /** ISO timestamp indicating the end of trade data availability, e.g., "2024-11-08T00:00:00.0000000Z" */
  data_trade_end: string;
  /** Volume of trades over the past hour in the base asset, e.g., 5.64541 */
  volume_1hrs: number;
  /** Volume of trades over the past hour in USD, e.g., 421567.06 */
  volume_1hrs_usd: number;
  /** Volume of trades over the past day in the base asset, e.g., 152.91686 */
  volume_1day: number;
  /** Volume of trades over the past day in USD, e.g., 11642702.41 */
  volume_1day_usd: number;
  /** Volume of trades over the past month in the base asset, e.g., 14037.59833 */
  volume_1mth: number;
  /** Volume of trades over the past month in USD, e.g., 1068787182.15 */
  volume_1mth_usd: number;
  /** Current price of the asset pair, e.g., 76105.965 */
  price: number;
  /** Exchange-specific identifier for the trading symbol, e.g., "BTCUSDT" */
  symbol_id_exchange: string;
  /** Exchange-specific identifier for the base asset, e.g., "BTC" */
  asset_id_base_exchange: string;
  /** Exchange-specific identifier for the quote asset, e.g., "USDT" */
  asset_id_quote_exchange: string;
  /** Precision for pricing, indicating the smallest price increment, e.g., 0.01 */
  price_precision: number;
  /** Precision for size, indicating the smallest amount increment for the base asset, e.g., 0.00001 */
  size_precision: number;
  /** Converted volume to USD for the current price, e.g., 76137.46718107087 */
  volume_to_usd: number;
};

export type SymbolDataResponse = SymbolData[];

export type IntervalTimeValue =
  | "1SEC"
  | "2SEC"
  | "3SEC"
  | "4SEC"
  | "5SEC"
  | "6SEC"
  | "10SEC"
  | "15SEC"
  | "20SEC"
  | "30SEC"
  | "1MIN"
  | "2MIN"
  | "3MIN"
  | "4MIN"
  | "5MIN"
  | "6MIN"
  | "10MIN"
  | "15MIN"
  | "20MIN"
  | "30MIN"
  | "1HRS"
  | "2HRS"
  | "3HRS"
  | "4HRS"
  | "6HRS"
  | "8HRS"
  | "12HRS"
  | "1DAY"
  | "2DAY"
  | "3DAY"
  | "5DAY"
  | "7DAY"
  | "10DAY";
