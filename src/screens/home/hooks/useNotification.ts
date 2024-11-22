import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { ws } from "@/client/Ws";
import {
  getGlobalState,
  setGlobalState,
  StateKeys,
  useGlobalState,
} from "@/hooks/useGlobalState";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface PriceNotification {
  id: string;
  asset: string;
  quote: string; // currency
  comparator: ">" | "<" | ">=" | "<=";
  amount: number;
}

// the notification will show once and after that will be removed
const showNotificationMessage = (message: string, id: string) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Price Alert",
      body: message,
      data: {
        notificationId: id,
      },
    },
    trigger: null,
  });
  // remove the notificaiotn
  const data =
    getGlobalState<PriceNotification[]>(StateKeys.myNotifications) || [];
  const newData = data.filter((item) => item.id !== id);
  setGlobalState(StateKeys.myNotifications, newData);
};

const notificationsCallback = async (
  price: number,
  notification: PriceNotification
) => {
  switch (notification.comparator) {
    case ">":
      if (price > notification.amount) {
        showNotificationMessage(
          `Price of ${notification.asset} is above ${notification.amount}`,
          notification.id
        );
      }
      break;
    case "<":
      if (price < notification.amount) {
        showNotificationMessage(
          `Price of ${notification.asset} is below ${notification.amount}`,
          notification.id
        );
      }
      break;
    case ">=":
      if (price >= notification.amount) {
        showNotificationMessage(
          `Price of ${notification.asset} is above or equal to ${notification.amount}`,
          notification.id
        );
      }
      break;
    case "<=":
      if (price <= notification.amount) {
        showNotificationMessage(
          `Price of ${notification.asset} is below or equal to ${notification.amount}`,
          notification.id
        );
      }
      break;
    default:
      break;
  }
};

const askForNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error("Failed to get notification permission");
    return;
  }
};

export const usePriceNotificationSubscription = () => {
  const { state: notifications } = useGlobalState<PriceNotification[]>(
    StateKeys.myNotifications,
    []
  );

  useEffect(() => {
    //TODO find only the new notifications
    // find the new notifications
    (notifications || []).length > 0 && askForNotificationPermission();
    const unsubscribe = notifications.map((notification) => {
      return ws.onValueUpdate(
        [{ assetId: notification.asset, currency: notification.quote }],
        (price: number) => notificationsCallback(price, notification)
      );
    });
    return () => {
      unsubscribe.forEach((fun) => fun?.());
    };
  }, [notifications]);
};
