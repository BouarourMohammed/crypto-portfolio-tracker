import React from "react";
import nock from "nock";

import { fireEvent, render, waitFor } from "@/../jest/test-utils";
import RootNavigator from "@/navigation";
import { COIN_API_ENDPOINT } from "@/constants";
import {
  assetsData,
  historyPrice24Data,
  iconsData,
} from "@/../__mocks__/coinapi/apiResponses";

jest.setTimeout(10000);

jest.mock("@/api/CoinapiHooks", () => {
  // Partially mock the module, keeping other hooks intact
  const actualHooks = jest.requireActual("@/api/CoinapiHooks");
  return {
    ...actualHooks,
    useLoadAllAssets: jest.fn(), // Leave this hook mocked
    useAssetsIcons: jest.fn(), // Leave this hook mocked
  };
});

describe("Home", () => {
  beforeEach(() => {
    // clear the mock data
    nock.cleanAll();
  });
  // in this case only redirecting to home screen
  it("renders correctly", async () => {
    const { useLoadAllAssets, useAssetsIcons } = require("@/api/CoinapiHooks");
    useLoadAllAssets.mockReturnValue({
      data: assetsData,
      isLoading: false,
      isError: false,
    });
    useAssetsIcons.mockReturnValue({
      data: iconsData,
      isLoading: false,
      isError: false,
    });
    // useAssetPriceHistory.mockReturnValue({
    //   data: historyPrice24Data,
    //   isLoading: false,
    //   isError: false,
    // });
    // map the data for splash screen
    // Nock intercept with a dynamic response
    nock(COIN_API_ENDPOINT)
      .get(new RegExp(`/exchangerate/.*/.*/history`)) // Match any assetId and currency
      .delay(1000)
      .query(true) // Accept any query parameters
      .reply(200, historyPrice24Data);
    const { unmount, getByTestId, getByText } = render(
      <RootNavigator initialRouteName={"Home"} />
    );
    expect(getByTestId("homeScreen")).toBeOnTheScreen();
    expect(getByText("My Assets")).toBeOnTheScreen();
    // check for BTC price
    expect(getByText("Bitcoin")).toBeOnTheScreen();
    expect(getByText("BTC")).toBeOnTheScreen();

    expect(getByText("US Dollar")).toBeOnTheScreen();
    expect(getByText("USD")).toBeOnTheScreen();
    // check for history price

    expect(getByTestId("depositButton")).toBeOnTheScreen();
    // press the deposit button
    fireEvent.press(getByTestId("depositButton"));
    await waitFor(() => expect(getByText("Select currency")).toBeOnTheScreen());

    fireEvent.press(getByTestId("backButton"));
    await waitFor(() => expect(getByTestId("homeScreen")).toBeOnTheScreen());
    // press the withdraw button

    unmount();
  });
});
