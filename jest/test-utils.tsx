import React from "react";
import { render } from "@testing-library/react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientOptions } from "@/client/ReactQuery";

const customRender = (rootNavigator: any, renderOptions = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      ...queryClientOptions,
      queries: { ...queryClientOptions.queries, retry: false },
    },
  });
  return render(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {rootNavigator}
        <StatusBar style="auto" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

// re-export everything
export * from "@testing-library/react-native";

// override render method
export { customRender as render };
