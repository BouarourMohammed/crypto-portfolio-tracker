import React from "react";
import nock from "nock";

import { render, waitFor } from "@/../jest/test-utils";
import RootNavigator from "@/navigation";
import { COIN_API_ENDPOINT } from "@/constants";
import { assetsData, iconsData } from "@/../__mocks__/coinapi/apiResponses";

describe("Splash", () => {
  beforeEach(() => {
    // clear the mock data
    nock.cleanAll();
  });

  it("renders correctly", async () => {
    // map the data for splash screen
    nock(COIN_API_ENDPOINT).get("/assets").reply(200, assetsData);
    nock(COIN_API_ENDPOINT).get("/assets/icons/64").reply(200, iconsData);
    const { unmount, getByTestId, getByText } = render(
      <RootNavigator initialRouteName={"Splash"} />
    );
    // ensure the splash screen is rendered
    expect(getByText("Crypto Portfolio Tracker")).toBeOnTheScreen();
    // ensure the activity indicator is rendered
    expect(getByTestId("SplashActivityIndicator")).toBeOnTheScreen();
    // wait until opening the home screen
    await waitFor(() => {
      expect(getByTestId("homeScreen")).toBeOnTheScreen();
    });
    unmount();
  });
});
