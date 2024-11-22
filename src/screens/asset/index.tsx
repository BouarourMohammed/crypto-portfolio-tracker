import { Text } from "@/components/basic/Text";
import { Colors } from "@/theme/Colors";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { LineGraph } from "react-native-graph";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useEffect, useRef, useState } from "react";
import AssetHeader from "@/screens/asset/components/AssetHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { setGlobalState } from "@/hooks/useGlobalState";
import { debounce } from "@/utils";
import { HISTORY_CONFIG } from "@/constants";
import { useRoute } from "@react-navigation/native";
import { useAssetHistoryState } from "@/hooks/useAssetState";
import { AssetScreenRouteProp } from "@/navigation";
import { MinMaxGraphLabel } from "@/components/shared/MinMaxGraphLabel";
import { ws } from "@/client/Ws";

const AssetScreen: React.FC = () => {
  const { assetId } = useRoute<AssetScreenRouteProp>().params;
  const callbackIssue = useRef(false);
  const [period, setPeriod] = useState<keyof typeof HISTORY_CONFIG>("Day");
  const {
    currentPrice,
    isError,
    priceHistory,
    priceChangePercent,
    priceChange,
    maxValueIndex,
    minValueIndex,
    currency,
    isFetchingPriceHistory,
    isLoading,
  } = useAssetHistoryState(assetId, period);
  const debouncedUpdate = debounce((price: number) => {
    setGlobalState(`${assetId}_${currency}_SELECTED`, price);
  }, 10);

  const minOffsetScreen = (minValueIndex + 1) / priceHistory.length;
  const maxOffsetScreen = (maxValueIndex + 1) / priceHistory.length;

  useEffect(() => {
    return () => {
      ws.restoreSubscriptions();
    };
  }, []);

  if (isError) {
    return <Text>{"Error" + JSON.stringify(isError.message)}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <AssetHeader
        low={priceHistory[minValueIndex]?.value}
        high={priceHistory[maxValueIndex]?.value}
        currency={currency}
        changePercent={priceChangePercent}
        change={priceChange}
        assetId={assetId}
        price={currentPrice}
        style={{ marginBottom: 16 }}
      />
      <View style={{ height: "45%" }}>
        {(isFetchingPriceHistory || isLoading) && (
          <ActivityIndicator
            size="large"
            color={Colors.white}
            style={styles.activityIndicator}
          />
        )}
        <LineGraph
          key={"MainGraph"}
          style={styles.graph}
          enableNaturalCorners={true}
          tension={0.25}
          verticalPadding={12}
          horizontalPadding={12}
          points={priceHistory}
          animated={true}
          enableIndicator={true}
          enablePanGesture={true}
          enableFadeInMask={true}
          gradientFillColors={[Colors.green, "transparent"]}
          indicatorPulsating={true}
          selectionDotShadowColor="red"
          panGestureDelay={100}
          onGestureStart={() => {
            callbackIssue.current = false;
          }}
          // onGestureStart={() => hapticFeedback("impactLight")}
          onPointSelected={(p) => {
            // issue with this callback
            if (callbackIssue.current) return;
            debouncedUpdate(p.value);
          }}
          onGestureEnd={() => {
            callbackIssue.current = true;
            setGlobalState(`${assetId}_${currency}_SELECTED`, null);
          }}
          TopAxisLabel={({ width }) => (
            <MinMaxGraphLabel
              width={width}
              value={priceHistory[maxValueIndex]?.value}
              offsetPercentage={maxOffsetScreen}
            />
          )}
          BottomAxisLabel={({ width }) => (
            <MinMaxGraphLabel
              width={width}
              value={priceHistory[minValueIndex]?.value}
              offsetPercentage={minOffsetScreen}
            />
          )}
          color={Colors.white}
        />
      </View>
      <SegmentedControl
        key={"SegmentedControl"}
        style={{ marginHorizontal: 16, marginTop: 16 }}
        fontStyle={styles.segmentedControl}
        backgroundColor={Colors.lightBlack}
        tintColor={Colors.lightBlack2}
        activeFontStyle={{ color: Colors.white }}
        values={["Day", "Week", "Month", "6M", "1Y"]}
        selectedIndex={0}
        onValueChange={(v) => setPeriod(v)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  segmentedControl: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Geist Mono",
    fontWeight: "bold",
  },
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    marginTop: "48%",
  },
  graph: {
    flex: 1,
    backgroundColor: Colors.lightBlack,
    borderRadius: 8,
    padding: 4,
  },
});

export default AssetScreen;
