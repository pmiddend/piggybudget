import {
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
} from "react-native";
import {
    NavigationScreenProps,
} from "react-navigation";
import {Component} from "react";
import React from "react";
import {
    BudgetStore,
    storeInit,
} from "../BudgetStore";

export default class Loading extends Component<NavigationScreenProps<{}>> {
    constructor(props: NavigationScreenProps<{}>) {
        super(props);

        storeInit(
            (s: BudgetStore) => this.props.navigation.navigate("Home", { store: s }),
            (e: any) => { console.log("Damn you, store!"); });
    }

    public render() {
        return (<View />);
    }
}
