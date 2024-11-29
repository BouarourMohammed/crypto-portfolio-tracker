import { ws } from "@/client/Ws";
import { useEffect, useState } from "react";

export const useInitWebSocket = () => {
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
