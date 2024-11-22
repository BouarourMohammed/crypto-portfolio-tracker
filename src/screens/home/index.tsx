import React, { useCallback } from "react";
import { AppStateStatus, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserDetails } from "@/screens/home/components/UserDetails";
import { RootStackNavigationProp } from "@/navigation";
import MyAssetsList from "@/screens/home/components/MyAssetsList";
import AssetsList from "@/screens/home/components/AssetsList";
import { Text } from "@/components/basic/Text";
import { Colors } from "@/theme/Colors";
import { ws } from "@/client/Ws";
import { useWsAppState } from "./hooks/useWsAppState";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const onAssetPress = useCallback((assetId: string, currency: string) => {
    navigation.navigate("Asset", { assetId });
    // this used to stop the subscriptions in the previous screen and only subscribe to the new asset active
    // this will reduce the number of subscriptions and will reduce the data usage
    ws.overrideSubscriptions([{ assetId, currency }], true);
  }, []);

  useWsAppState();
  return (
    <SafeAreaView style={styles.container} testID="homeScreen">
      <ScrollView>
        <UserDetails
          onSettingPress={() => navigation.navigate("Setting")}
          onDepositPress={() =>
            navigation.navigate("AddAsset", { variant: "Deposit" })
          }
          onWithdrawPress={() =>
            navigation.navigate("AddAsset", { variant: "Withdraw" })
          }
        />
        <View style={styles.myAssets}>
          <Text variant="title" fontSize={22} style={{ marginBottom: 32 }}>
            My Assets
          </Text>
          <MyAssetsList onPress={onAssetPress} />
        </View>
        <View style={styles.market}>
          <Text variant="title" fontSize={22} style={{ marginBottom: 32 }}>
            Market
          </Text>
          <AssetsList onPress={onAssetPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  myAssets: {
    backgroundColor: Colors.lightBlack,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  market: {
    backgroundColor: Colors.lightBlack,
    borderRadius: 16,
    padding: 16,
  },
});
export default HomeScreen;
