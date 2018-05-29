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
import HomeScreen from "./screens/Home";
import AddScreen from "./screens/Add";
import HistoryScreen from "./screens/History";
import LoadingScreen from "./screens/Loading";
import appReducer from "./Reducer";

const HomeStack = StackNavigator({
    Add: { screen: AddScreen },
    Home: { screen: HomeScreen },
  },
  {
    initialRouteName: "Home",
  });

const HistoryStack = StackNavigator({
    History: { screen: HistoryScreen },
  });

const Tabs = TabNavigator({
    Home: { screen: HomeStack },
    History: { screen: HistoryStack },
},
 {
    tabBarPosition: "bottom",
});

const store = createStore(appReducer);

const DailyBudgetRoot = StackNavigator(
    {
        Loading: LoadingScreen,
        Main: Tabs,
    },
    {
        mode: "modal",
        headerMode: "none",
    },
);

export default () => (
        <Provider store={store}>
          <DailyBudgetRoot />
        </Provider>
);
