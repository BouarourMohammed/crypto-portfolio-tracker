import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import RootNavigator from "./src/navigation";
import { RQClientProvider } from "./src/client/ReactQuery";
import { useInitWebSocket } from "@/hooks/useInitWebSocket";

export default function App({ initialRouteName }: any) {
  const { isConnected } = useInitWebSocket();
  // we can add some logic here to check if the user is connected to the websocket
  // if not, we can show a loading screen or some other UI
  // if (!isConnected) {
  //   return <AppLoading />;
  // }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RQClientProvider>
        <RootNavigator initialRouteName={initialRouteName} />
        <StatusBar style="auto" />
      </RQClientProvider>
    </GestureHandlerRootView>
  );
}
