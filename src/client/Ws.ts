import { COIN_API_WS_ENDPOINT } from "@/constants";
import { WebSocketManager } from "@/services/WebSocketManager";

// to mock ws we will use https://github.com/thoov/mock-socket
export const ws = new WebSocketManager(COIN_API_WS_ENDPOINT);
