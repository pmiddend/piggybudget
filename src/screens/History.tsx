import React from "react";
import {Component} from "react";
import {
    NavigationScreenProps,
} from "react-navigation";
import {
    View,
} from "react-native";

export default class HistoryScreen extends Component<NavigationScreenProps<{}>> {
    public static navigationOptions = {
        title: "History",
    };

    public render() {
        return (<View />);
    }
}
