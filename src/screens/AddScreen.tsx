import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from "react-native";
import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";

interface State {
    amount: string;
}

type Callback = (amount: Decimal) => void;

interface NavigationParams {
    callback: Callback;
}

export default class AddScreen extends Component<NavigationScreenProps<NavigationParams>> {
    public static navigationOptions = {
        title: "Modify budget",
    };

    public state: State;

    constructor(props: NavigationScreenProps<NavigationParams>) {
        super(props);
        this.state = {
            amount: "0",
        };
    }

    public render() {
        return (
                <View style={styles.container}>
                <Text style={styles.welcome}>Budget ftw!</Text>
                <TextInput value={this.state.amount.toString()}
                           keyboardType="numeric"
                           onChangeText={(text) => this.handleAmountChange(text)}/>
                <Button title="Go!" onPress={() => this.handlePress()} />
                </View>
        );
    }

    private handlePress() {
        const params: NavigationParams | undefined = this.props.navigation.state.params;
        if (params !== undefined)
            params.callback(new Decimal(this.state.amount));
        this.props.navigation.goBack();
    }

    private handleAmountChange(text: string) {
        this.setState({
            amount: text,
        });
    }
}

const styles = StyleSheet.create({
  budget: {
    color: "#333333",
    fontSize: 30,
    marginBottom: 5,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    justifyContent: "center",
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});
