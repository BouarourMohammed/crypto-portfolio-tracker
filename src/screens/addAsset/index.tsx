import { useCallback, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import Button from "@/components/basic/Button";
import RoundButton from "@/components/basic/RoundButton";
import { Text } from "@/components/basic/Text";
import { yupResolver } from "@hookform/resolvers/yup";
import { StateKeys, useGlobalState } from "@/hooks/useGlobalState";
import { Colors } from "@/theme/Colors";
import { createDepositWithdrawValidationSchema } from "@/utils/Validations";
import FormTextInput from "@/components/froms/FormTextInput";

// Define the form data interface
export interface DepositWithdrawDataFrom extends FieldValues {
  amount: number;
}

const AddAssetScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state: myAssets, setState: setMyAssets } = useGlobalState<{
    [key: string]: number;
  }>(StateKeys.myAssets, {});
  const [currency, setCurrency] = useState<string>("USDT");
  // Get current balance for the selected asset type
  const getCurrentBalance = () => {
    return myAssets[currency] || 0;
  };
  const { variant }: any = useRoute().params;
  // Initialize form methods with validation schema
  const methods = useForm<DepositWithdrawDataFrom>({
    defaultValues: {},
    resolver: yupResolver(
      createDepositWithdrawValidationSchema(variant, getCurrentBalance())
    ),
  });

  const onSubmit = useCallback(
    (data: DepositWithdrawDataFrom) => {
      if (variant === "Deposit") {
        const prevValue = myAssets?.[currency] || 0;
        const newSold = {
          ...myAssets,
          [currency]: prevValue + data.amount,
        };
        setMyAssets(newSold);
        navigation.goBack();
      } else if (variant === "Withdraw") {
        const prevValue = myAssets?.[currency] || 0;
        let newSold: any;
        const vewValue = prevValue - data.amount;
        if (vewValue < 0) {
          console.error("Insufficient balance");
        } else if (vewValue === 0) {
          newSold = {
            ...myAssets,
          };
          delete newSold[currency];
        } else {
          newSold = {
            ...myAssets,
            [currency]: prevValue - data.amount,
          };
        }
        setMyAssets(newSold);
        navigation.goBack();
      }
    },
    [currency]
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RoundButton
          testID="backButton"
          icon="chevron-small-left"
          style={{ marginRight: 16 }}
          onPress={() => navigation.goBack()}
        />
        <Text variant="title" style={{ alignSelf: "center" }}>
          {variant}
        </Text>
      </View>
      <View style={styles.formContainer}>
        <FormProvider {...methods}>
          {/* TO DO Create a form component the users controllers */}
          <Text variant="subtitle" style={{}}>
            Select currency
          </Text>
          <SegmentedControl
            testID="currencySegmentedControl"
            style={{ marginTop: 12 }}
            fontStyle={styles.segmentedControl}
            backgroundColor={Colors.lightBlack}
            tintColor={Colors.lightBlack2}
            activeFontStyle={{ color: Colors.white }}
            values={["USDT", "BTC", "ETH", "DOGE"]}
            selectedIndex={0}
            onValueChange={(v) => {
              setCurrency(v);
            }}
          />
          <FormTextInput
            testID="amountTextInput"
            name="amount"
            label="Amount"
            errorSpacing
            // allow number with decimal
            regExp={/^(\d+\.?\d*)?$/}
            placeholder="Amount"
            placeholderTextColor={Colors.text}
            keyboardType="number-pad"
            containerStyle={{ marginTop: 16 }}
          />
        </FormProvider>
      </View>
      <Button
        testID="depositButton"
        title={variant}
        style={{ marginTop: 16, width: "50%", alignSelf: "center" }}
        onPress={methods.handleSubmit(onSubmit)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: Colors.lightBlack,
    marginTop: 32,
    borderRadius: 16,
  },
  segmentedControl: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Geist Mono",
    fontWeight: "bold",
  },
});

export default AddAssetScreen;
