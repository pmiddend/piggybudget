import React from "react";
import {Component} from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    StackNavigator,
    TabNavigator,
    TabBarBottom,
} from "react-navigation";
import Home from "./screens/Home";
import Add from "./screens/Add";
import Settings from "./screens/Settings";
import History from "./screens/History";
import LoadingScreen from "./screens/Loading";
import appReducer from "./Reducer";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import immutableTransform from "redux-persist-transform-immutable";

const HomeStack = StackNavigator({
    Add: { screen: Add },
    Home: { screen: Home },
  },
  {
    initialRouteName: "Home",
  });

const HistoryStack = StackNavigator({
    History: { screen: History },
  });

const SettingsStack = StackNavigator({
    Settings: { screen: Settings },
  });

const DailyBudgetRoot = TabNavigator({
    Home: { screen: HomeStack },
    History: { screen: HistoryStack },
    Settings: { screen: SettingsStack },
},
 {
    tabBarPosition: "bottom",
});

const persistConfig = {
    transforms: [immutableTransform()],
    key: "v10",
    storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export default () => (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <DailyBudgetRoot />
          </PersistGate>
        </Provider>
);
