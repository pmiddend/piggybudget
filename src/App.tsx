import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    StackNavigator,
} from "react-navigation";
import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";


export default StackNavigator({
    Add: { screen: AddScreen },
    Home: { screen: HomeScreen },
  },
  {
    initialRouteName: "Home",
  });
