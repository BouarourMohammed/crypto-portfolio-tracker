// In App.js in a new project

import * as React from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Colors } from "../theme/Colors";

import HomeScreen from "@/screens/home";
import AddAssetScreen from "@/screens/addAsset";
import SettingScreen from "@/screens/setting";
import AssetScreen from "@/screens/asset";
import SplashScreen from "@/screens/splash";

type RootStackParams = {
  Splash: undefined;
  Home: undefined;
  Asset: { assetId: string };
  Setting: undefined;
  AddAsset: { variant: "Deposit" | "Withdraw" };
};

// Type for useNavigation
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParams>;

// Type for useRoute
export type AssetScreenRouteProp = RouteProp<RootStackParams, "Asset">;

const Stack = createNativeStackNavigator<RootStackParams>();

const RootNavigator: React.FC<{ initialRouteName?: any }> = ({
  initialRouteName = "Splash",
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.black },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Asset" component={AssetScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen
          name="AddAsset"
          component={AddAssetScreen}
          options={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
