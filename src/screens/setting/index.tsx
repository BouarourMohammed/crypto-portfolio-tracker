import { useCallback, useRef, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { ScrollView } from "react-native-gesture-handler";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import RoundButton from "@/components/basic/RoundButton";
import { Text } from "@/components/basic/Text";
import { useActiveCurrency } from "@/hooks/useActiveCurrency";
import { notificationSchema } from "@/utils/Validations";
import {
  setGlobalState,
  StateKeys,
  useGlobalState,
} from "@/hooks/useGlobalState";
import { Colors } from "@/theme/Colors";
import FormTextInput from "@/components/froms/FormTextInput";
import { DepositWithdrawDataFrom } from "../addAsset";
import Button from "@/components/basic/Button";
import { PriceNotification } from "@/screens/home/hooks/useNotification";

const currencies = ["USDT", "BTC", "ETH", "DOGE"];
const comparators = [">", "<", ">=", "<="];

// TODO : split the screen into sub components each section in isolated component
const SettingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currency } = useActiveCurrency();
  const ScrollViewRef = useRef<ScrollView>(null);
  const { state: notifications, setState: setNotifications } = useGlobalState<
    PriceNotification[]
  >(StateKeys.myNotifications, []);
  const quote = useRef<number>(0);
  const comparator = useRef<PriceNotification["comparator"]>(">");
  const [activeCurrency, setActiveCurrency] = useState<string>("USDT");
  // Initialize form methods with validation schema
  const methods = useForm<DepositWithdrawDataFrom>({
    defaultValues: {},
    resolver: yupResolver(notificationSchema),
  });
  const onAddNotification = useCallback(
    (data: DepositWithdrawDataFrom) => {
      const id = Math.random().toString(36).substring(2, 15);
      const notificationData: PriceNotification = {
        id,
        ...data,
        comparator: comparator.current,
        quote: currencies.filter((curr) => curr !== activeCurrency)[
          quote.current
        ],
        asset: activeCurrency,
      };
      setNotifications([...notifications, notificationData]);
      methods.reset();
      setTimeout(() => {
        ScrollViewRef.current?.scrollToEnd({
          animated: true,
        });
      }, 500);
    },
    [notifications, activeCurrency]
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
        <ScrollView
          ref={ScrollViewRef}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
        >
          <View>
            <View style={styles.headerContainer}>
              <RoundButton
                icon="chevron-small-left"
                style={{ marginRight: 16 }}
                onPress={() => navigation.goBack()}
              />
              <Text variant="title" style={{ alignSelf: "center" }}>
                Setting
              </Text>
            </View>
          </View>
          <View style={styles.fromContainer}>
            <Text
              testID="currency"
              variant="title"
              style={{ marginBottom: 16 }}
            >
              {currency}
            </Text>
            <Text variant="title" style={{}}>
              App Currency / Quote
            </Text>
            <SegmentedControl
              testID="segmentedControl"
              style={{ marginTop: 16 }}
              fontStyle={styles.segmentedControl}
              backgroundColor={Colors.lightBlack}
              tintColor={Colors.lightBlack2}
              activeFontStyle={{ color: Colors.white }}
              values={currencies}
              selectedIndex={currencies.indexOf(currency)}
              onValueChange={(v) => {
                setGlobalState(StateKeys.activeCurrency, v);
              }}
            />
          </View>
          <View style={styles.fromContainer}>
            <FormProvider {...methods}>
              <Text variant="title" style={{}}>
                Notification
              </Text>
              <Text variant="subtitle" style={{ marginTop: 24 }}>
                Asset
              </Text>
              <SegmentedControl
                style={{ marginTop: 12 }}
                fontStyle={styles.segmentedControl}
                backgroundColor={Colors.lightBlack}
                tintColor={Colors.lightBlack2}
                activeFontStyle={{ color: Colors.white }}
                values={currencies}
                selectedIndex={currencies.indexOf(activeCurrency)}
                onValueChange={(v) => {
                  setActiveCurrency(v);
                }}
              />
              <Text variant="subtitle" style={{ marginTop: 24 }}>
                currency / Quote
              </Text>
              <SegmentedControl
                style={{ marginTop: 12 }}
                fontStyle={styles.segmentedControl}
                backgroundColor={Colors.lightBlack}
                tintColor={Colors.lightBlack2}
                activeFontStyle={styles.activeFont}
                values={currencies.filter((curr) => curr !== activeCurrency)}
                selectedIndex={0}
                onValueChange={(v) => {
                  quote.current = currencies
                    .filter((curr) => curr !== activeCurrency)
                    .indexOf(v);
                }}
              />

              <Text variant="subtitle" style={{ marginTop: 24 }}>
                Operation
              </Text>
              <SegmentedControl
                style={{ marginTop: 12 }}
                fontStyle={styles.segmentedControl}
                backgroundColor={Colors.lightBlack}
                tintColor={Colors.lightBlack2}
                activeFontStyle={{ color: Colors.white }}
                values={comparators}
                selectedIndex={0}
                onValueChange={(v) => {
                  comparator.current = v as PriceNotification["comparator"];
                }}
              />

              <FormTextInput
                name="amount"
                label="Rate"
                errorSpacing
                // allow number with decimal
                regExp={/^(\d+\.?\d*)?$/}
                placeholder="Rate"
                placeholderTextColor={Colors.text}
                keyboardType="number-pad"
                containerStyle={{ marginTop: 16 }}
              />
            </FormProvider>
            <Button
              title="Save"
              style={{ marginTop: 16, width: "50%", alignSelf: "center" }}
              onPress={methods.handleSubmit(onAddNotification)}
            />
          </View>
          {notifications?.length > 0 && (
            <View style={styles.fromContainer}>
              <Text variant="title">List of Notification</Text>
              {notifications.map(
                (notification: PriceNotification, index: number) => (
                  <View key={index} style={styles.notificationItem}>
                    <Text style={{ marginRight: 16 }}>{"When"}</Text>
                    <Text
                      style={{ marginRight: 16, fontWeight: "bold" }}
                      color={Colors.green}
                    >
                      {notification.asset} / {notification.quote}
                    </Text>
                    <Text style={{ marginRight: 16, marginLeft: "auto" }}>
                      {`price ${notification.comparator} ${notification.amount}`}
                    </Text>
                    <RoundButton
                      icon="trash"
                      onPress={() => {
                        setNotifications(
                          notifications.filter(
                            (item) => item.id !== notification.id
                          )
                        );
                      }}
                      color={Colors.red}
                      iconSize={16}
                      size={34}
                    />
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fromContainer: {
    padding: 16,
    paddingVertical: 24,
    backgroundColor: Colors.lightBlack,
    marginTop: 32,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  container: {
    flex: 1,
  },
  segmentedControl: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "bold",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: Colors.lightBlack2,
    borderBottomWidth: 1,
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.black,
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  activeFont: {
    color: Colors.white,
    fontFamily: "Geist Mono",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SettingScreen;
