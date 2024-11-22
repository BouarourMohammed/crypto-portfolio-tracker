import { ActivityIndicator, View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Text } from "@/components/basic/Text";
import { Colors } from "@/theme/Colors";
import { useLoadIconsAssets } from "@/screens/splash/hooks/useLoadIconsAssets";
import { FADING_DELAY } from "@/constants";
import { usePriceNotificationSubscription } from "../home/hooks/useNotification";

const SplashScreen: React.FC = () => {
  const { error } = useLoadIconsAssets();
  usePriceNotificationSubscription();

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(FADING_DELAY)}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Text variant="title" fontSize={32} style={{ textAlign: "center" }}>
          Crypto Portfolio Tracker
        </Text>
        {error ? (
          <View>
            <Text
              variant="subtitle"
              color={Colors.red}
              style={{ textAlign: "center", marginTop: 32 }}
            >
              Something went wrong{"\n"}please try again
              {"\n"}
              {error.message}
            </Text>
          </View>
        ) : (
          <ActivityIndicator
            testID="SplashActivityIndicator"
            size="large"
            color={Colors.white}
            style={{ marginTop: 32 }}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SplashScreen;
