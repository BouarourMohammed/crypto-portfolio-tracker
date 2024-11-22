import { configure } from "@testing-library/react-native";
import "@testing-library/react-native/extend-expect";

configure({ asyncUtilTimeout: 20000 });

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("react-native-graph", () => ({
  LineGraph: jest.fn(() => null), // Mocked component
}));

import "react-native-gesture-handler/jestSetup";
//@ts-ignore
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock";
jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  error: console.log,
  // warn: jest.fn(),
  // error: jest.fn(),
};
// jest.mock("@react-native-community/netinfo", () => ({
//   getCurrentConnectivity: jest.fn(),
//   isConnectionMetered: jest.fn(),
//   addListener: jest.fn(),
//   removeListeners: jest.fn(),
//   isConnected: {
//     fetch: () => {
//       return Promise.resolve(true);
//     },
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//   },
//   addEventListener: jest.fn((callback) => {
//     // Simulate network change
//     callback({ isConnected: true });
//     return { remove: jest.fn() };
//   }),
//   removeEventListener: jest.fn(),
// }));

// jest.mock("react-native-gesture-handler", () => {
//   const View = require("react-native/Libraries/Components/View/View");
//   return {
//     GestureHandlerRootView: View,
//     Swipeable: View,
//     DrawerLayout: View,
//     State: {},
//     PanGestureHandler: View,
//     TapGestureHandler: View,
//     FlingGestureHandler: View,
//     ForceTouchGestureHandler: View,
//     LongPressGestureHandler: View,
//     NativeViewGestureHandler: View,
//     PinchGestureHandler: View,
//     RotationGestureHandler: View,
//     ScrollView: View,
//     Slider: View,
//     Switch: View,
//     TextInput: View,
//     ToolbarAndroid: View,
//     ViewPagerAndroid: View,
//     WebView: View,
//     FlatList: View,
//     gestureHandlerRootHOC: (component) => component,
//     Directions: {},
//   };
// });
