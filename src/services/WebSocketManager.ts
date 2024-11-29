import { COIN_API_KEY } from "@/constants";
import { setGlobalState } from "@/hooks/useGlobalState";
import { ExchangeRateData } from "@/types/coinAPI";

interface WebSocketManagerOptions {
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
}

export class WebSocketManager {
  private url: string;
  private options: Required<WebSocketManagerOptions>;
  private ws: WebSocket | null;
  private retryCount: number;
  private retryDelay: number;
  private reconnectTimeout: NodeJS.Timeout | null;
  private isIntentionallyClosed: boolean;
  private subscriptions: Record<string, string>;
  private cachedSubscriptions: Record<string, string> | null;
  private onNewValueSubscription: Map<
    string,
    { id: string; callback: (price: number) => void }[]
  >;
  private onConnect?: () => void;

  constructor(url: string, options: WebSocketManagerOptions = {}) {
    this.url = url;
    this.options = {
      maxRetries: options.maxRetries ?? 5,
      initialRetryDelay: options.initialRetryDelay ?? 1000,
      maxRetryDelay: options.maxRetryDelay ?? 30000,
    };
    this.ws = null;
    this.retryCount = 0;
    this.retryDelay = this.options.initialRetryDelay;
    this.reconnectTimeout = null;
    this.isIntentionallyClosed = false;
    this.subscriptions = {};
    this.cachedSubscriptions = null;
    this.onNewValueSubscription = new Map<
      string,
      { id: string; callback: (price: number) => void }[]
    >();
  }

  public connect(onConnect?: () => void): void {
    this.onConnect = onConnect;
    try {
      this.ws = new WebSocket(this.url);
      this.cachedSubscriptions = null;
      this.subscriptions = {};
      this.setupEventListeners();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.scheduleReconnection();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;
    this.ws.onopen = (event: WebSocketEventMap["open"]): void => {
      const initMessage = getApiCoinWsMessage("hello", [
        { assetId: "", currency: "" },
      ]);
      this.ws?.send(initMessage);
      this.onConnect?.();
    };

    this.ws.onmessage = (event: WebSocketMessageEvent): void => {
      try {
        const data: ExchangeRateData & { message?: string } = JSON.parse(
          event.data
        );
        if (data?.message) {
          console.log("Error message from CoinAPI:", data.message);
          return;
        }
        this.retryCount = 0;
        this.retryDelay = this.options.initialRetryDelay;
        const assetPairKey = `${data.asset_id_base}_${data.asset_id_quote}`;
        setGlobalState(assetPairKey, data.rate);
        this.onNewValueSubscription
          .get(assetPairKey)
          ?.forEach((sub) => sub?.callback?.(data.rate));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    //@ts-ignore
    this.ws.onerror = (error: WebSocketErrorEvent): void => {
      // Handle WebSocket error showing a toast or something
      console.error("WebSocket Error:", error.message, error);
    };

    this.ws.onclose = (event: WebSocketCloseEvent): void => {
      if (!this.isIntentionallyClosed) {
        this.scheduleReconnection();
      }
    };
  }

  private scheduleReconnection(): void {
    if (this.retryCount >= this.options.maxRetries) {
      console.log("Max retry attempts reached. Stopping reconnection.");
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log(
        `Attempting to reconnect... (Attempt ${this.retryCount + 1}/${
          this.options.maxRetries
        })`
      );
      this.retryCount = this.retryCount + 1;
      this.connect();

      // Implement exponential backoff with max delay
      this.retryDelay = Math.min(
        this.retryDelay * 2,
        this.options.maxRetryDelay
      );
    }, this.retryDelay);
  }

  public disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
    this.retryCount = 0;
    this.retryDelay = this.options.initialRetryDelay;
  }

  public restart() {
    this.disconnect();
    this.connect();
  }

  public onValueUpdate(
    assets: { assetId: string; currency: string }[],
    callback: (price: number) => void
  ) {
    if (assets.length === 0) {
      return () => true;
    }
    // TODO we should update this to user UUID
    //const id = uuidv4();
    const id = Math.random().toString(36).substring(2, 15);
    assets.forEach((asset) => {
      const prevSubscription =
        this.onNewValueSubscription.get(`${asset.assetId}_${asset.currency}`) ||
        [];
      // Check if the callback is already subscribed to avoid duplicates
      if (!prevSubscription.some((sub) => sub.callback === callback)) {
        prevSubscription.push({ id, callback });
        // we can skip this insertion if the callback is already there // pass per reference
        this.onNewValueSubscription.set(
          `${asset.assetId}_${asset.currency}`,
          prevSubscription
        );
      }
    });

    const unsubscribe = () => {
      assets.forEach((asset) => {
        const newSubscription = (
          this.onNewValueSubscription.get(
            `${asset.assetId}_${asset.currency}`
          ) || []
        ).filter((val) => val?.id !== id);
        //
        this.onNewValueSubscription.set(
          `${asset.assetId}_${asset.currency}`,
          newSubscription
        );
      });
    };
    return unsubscribe;
  }

  public subscribe(assets: { assetId: string; currency: string }[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("subscribe: WebSocket is not connected");
      return;
    }
    // check if the subscription is already active
    const filteredAssets = assets.filter(
      (asset) => !this.subscriptions[asset.assetId]
    );
    if (filteredAssets.length === 0) {
      return;
    }
    const subscriptionMessage = getApiCoinWsMessage(
      "subscribe",
      filteredAssets
    );
    this.ws?.send(subscriptionMessage);
    filteredAssets.forEach(({ assetId, currency }) => {
      this.subscriptions[assetId] = currency;
    });
  }

  public unsubscribe(assets: { assetId: string; currency: string }[]) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("unsubscribe: WebSocket is not connected");
      return;
    }
    const unsubscriptionMessage = getApiCoinWsMessage("unsubscribe", assets);
    this.ws?.send(unsubscriptionMessage);
    assets.forEach(({ assetId }) => {
      delete this.subscriptions[assetId];
    });
  }

  public unsubscribeAll() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }
    if (Object.keys(this.subscriptions).length === 0) {
      console.log("No subscriptions to unsubscribe");
      return;
    }
    const unsubscriptionMessage = getApiCoinWsMessage(
      "unsubscribe",
      Object.keys(this.subscriptions).map((assetId) => ({
        assetId,
        currency: this.subscriptions[assetId],
      }))
    );
    this.ws?.send(unsubscriptionMessage);
    this.subscriptions = {};
  }

  public overrideSubscriptions(
    assets: { assetId: string; currency: string }[],
    cachedSubscriptions: boolean = false
  ) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("overrideSubscriptions: WebSocket is not connected");
      return;
    }
    if (cachedSubscriptions) {
      this.cachedSubscriptions = { ...this.subscriptions };
    }
    if (assets.length === 0) {
      this.unsubscribeAll();
      return;
    }
    // get the couples of assets and currencies that needs to be unsubscribed
    const unsubscriptionAssets = Object.entries(this.subscriptions).filter(
      ([assetId, currency]) =>
        !assets.some(
          ({ assetId: assetId2, currency: currency2 }) =>
            assetId === assetId2 && currency === currency2
        )
    );
    // unsubscribe from the assets that needs to be unsubscribed
    this.unsubscribe(
      unsubscriptionAssets.map(([assetId, currency]) => ({
        assetId,
        currency,
      }))
    );
    // find the new subscriptions
    const newSubscriptions = assets.filter(
      ({ assetId, currency }) => !(this.subscriptions[assetId] === currency)
    );
    // subscribe to the new subscriptions
    this.subscribe(newSubscriptions);
  }

  public restoreSubscriptions() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("restoreSubscriptions: WebSocket is not connected");
      return;
    }
    if (
      !this.cachedSubscriptions ||
      Object.keys(this.cachedSubscriptions).length === 0
    ) {
      console.log("No cached subscriptions to restore");
      this.unsubscribeAll();
      return;
    }
    // get the couples of assets and currencies that needs to be unsubscribed
    const unsubscriptionAssets = Object.entries(this.subscriptions).filter(
      ([assetId, currency]) =>
        !(this.cachedSubscriptions?.[assetId] === currency)
    );
    // unsubscribe from the assets that needs to be unsubscribed
    this.unsubscribe(
      unsubscriptionAssets.map(([assetId, currency]) => ({
        assetId,
        currency,
      }))
    );
    // get the couples of assets and currencies that needs to be subscribed
    const newSubscriptions = Object.entries(this.cachedSubscriptions).filter(
      ([assetId, currency]) => !(this.subscriptions[assetId] === currency)
    );
    // subscribe to the new subscriptions
    this.subscribe(
      newSubscriptions.map(([assetId, currency]) => ({
        assetId,
        currency,
      }))
    );
    // clean up the cached subscriptions
    this.cachedSubscriptions = null;
  }

  // Get connection status
  public getStatus(): string {
    if (!this.ws) return "CLOSED";

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "CONNECTING";
      case WebSocket.OPEN:
        return "OPEN";
      case WebSocket.CLOSING:
        return "CLOSING";
      case WebSocket.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }
}

const getApiCoinWsMessage = (
  variant: "subscribe" | "unsubscribe" | "hello",
  assets: { assetId: string; currency: string }[]
) => {
  const subscriptionMessage = JSON.stringify({
    type: variant,
    apikey: COIN_API_KEY,
    subscribe_data_type: ["exrate"],
    subscribe_update_limit_ms_exrate: 2000,
    subscribe_filter_asset_id: assets.map(
      ({ assetId, currency }) => `${assetId}/${currency}`
    ),
    // subscribe_filter_symbol_id: assets.map(
    //   ({ assetId, currency }) => `BINANCE_SPOT_${assetId}_${currency}`
    // ),
  });
  return subscriptionMessage;
};
