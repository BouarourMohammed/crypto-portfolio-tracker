import { ws } from "@/client/Ws";
import { useAppState } from "@/hooks/useAppState";
import { useCallback } from "react";
import { AppStateStatus } from "react-native";

export const useWsAppState = () => {
  const onAppStateChange = useCallback((status: AppStateStatus) => {
    if (status === "active") {
      ws.restoreSubscriptions();
    } else {
      ws.overrideSubscriptions([], true);
    }
  }, []);
  useAppState(onAppStateChange);
};
