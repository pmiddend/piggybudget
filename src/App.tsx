import React from "react";
import {Component} from "react";
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
    tabBarPosition: 'bottom',
});

export default StackNavigator(
    {
        Loading: LoadingScreen,
        Main: Tabs,
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);
