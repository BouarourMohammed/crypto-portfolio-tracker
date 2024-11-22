import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import RootNavigator from "./src/navigation";
import { RQClientProvider } from "./src/client/ReactQuery";
import { ws } from "@/client/Ws";

const useInitWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    ws.connect(() => {
      setIsConnected(true);
    });
    return () => {
      ws.disconnect();
    };
  }, []);
  return { isConnected };
};

// const ws = new WebSocket("wss://ws.coinapi.io/v1/");

// ws.onopen = (event) => {
//   console.log("Connected to CoinAPI WebSocket", event);
//   // return;
//   // Send a subscription message
//   const subscriptionMessage = JSON.stringify({
//     type: "hello",
//     apikey: "D2214B52-819C-48EB-B6B1-D803C5F1D17B",
//     subscribe_data_type: ["quote"],
//     // subscribe_filter_asset_id: ["BTC/USD"], // Example for specific pair
//     subscribe_filter_symbol_id: ["EXMO_SPOT_BTC_USDT"], // Example for specific pair
//     // subscribe_data_type: ["quote"],
//     subscribe_filter_asset_id: ["USD/USDT", "PLN/USDT", "EUR/USDT", "CNY/USDT"],
//     // {"type":"subscribe","apikey":"D2214B52-819C-48EB-B6B1-D803C5F1D17B","subscribe_data_type":["trade"],"subscribe_filter_symbol_id":["HITBTC_SPOT_BTC_USDT"]}
//   });

//   ws.send(subscriptionMessage);
// };
// ws.onmessage = (event) => {
//   // Parse the incoming message data
//   const data = JSON.parse(event.data);
//   // console.log("data received:", data);
//   if (data && data.symbol_id?.startsWith("BINANCE_SPOT_")) {
//     console.log(" data received:", data);
//   }
//   // Handle incoming data (e.g., trades)
//   // if (data && data.type === "trade") {
//   //   console.log("Trade data received:", data);
//   //   // setPriceData(data);
//   // }
// };

// ws.onerror = (error) => {
//   console.error("WebSocket Error:", error);
// };

// ws.onclose = () => {
//   console.log("Disconnected from WebSocket");
// };

export default function App({ initialRouteName }: any) {
  // const { isConnected } = useInitWebSocket();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RQClientProvider>
        <RootNavigator initialRouteName={initialRouteName} />
        <StatusBar style="auto" />
      </RQClientProvider>
    </GestureHandlerRootView>
  );
}
