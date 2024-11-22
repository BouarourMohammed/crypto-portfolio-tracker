import NetInfo from "@react-native-community/netinfo";
import {
  QueryClient,
  focusManager,
  keepPreviousData,
  onlineManager,
} from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { useEffect } from "react";
import type { AppStateStatus } from "react-native";
import { AppState, Platform } from "react-native";

export const queryClientOptions = {
  queries: {
    gcTime: Infinity,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryClientOptions,
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export const RQClientProvider = ({ children }: any) => {
  useEffect(() => {
    // Listen for app state changes and update the query client focus manager
    const subscription = AppState.addEventListener("change", onAppStateChange);
    // Listen for network changes and update the query client online manager
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      });
    });

    return () => {
      // Remove the event listeners when the component unmounts
      subscription.remove();
      // Reset the focus manager when the component unmounts
      onlineManager.setEventListener(() => () => {});
    };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
