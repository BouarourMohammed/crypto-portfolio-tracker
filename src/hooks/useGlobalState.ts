import { queryClient } from "@/client";
import { useQuery } from "@tanstack/react-query";

export const getGlobalState = <T>(key: string) => {
  return queryClient.getQueryData<any, string[], T>([key]);
};

export const setGlobalState = (key: string, newData: any) => {
  queryClient.setQueryData([key], newData);
};

export const useGlobalState = <T>(key: string, initialData?: T) => {
  const { data } = useQuery({
    queryKey: [key],
    initialData: initialData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  return {
    state: data as T,
    setState: (newData: T) => {
      queryClient.setQueryData([key], newData);
    },
  };
};

export const StateKeys = {
  activeCurrency: "ACTIVE_CURRENCY",
  myAssets: "MY_ASSETS",
  myTotal: "MY_TOTAL",
  myNotifications: "MY_NOTIFICATIONS",
};
