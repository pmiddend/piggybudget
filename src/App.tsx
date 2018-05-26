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
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import HistoryScreen from "./screens/History";

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

export default TabNavigator({
    Home: { screen: HomeStack },
    History: { screen: HistoryStack },
},
 {
    tabBarPosition: 'bottom',
});
