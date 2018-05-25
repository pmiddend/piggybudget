import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
} from "react-native";

interface State {
    budget: Decimal;
}

interface SerializedState {
    budget: string;
}

export default class HomeScreen extends Component<NavigationScreenProps<{}>> {
    public static navigationOptions = {
        title: "Home",
    };

    private static serializeState(s: State): string {
        return JSON.stringify({ budget: s.budget.toString() });
    }

    private static deserializeState(s: string): State {
        return {
            budget: new Decimal((JSON.parse(s) as SerializedState).budget),
        };
    }

    public state: State;

    constructor(props: NavigationScreenProps<{}>) {
        super(props);
        this.state = {
            budget: new Decimal(110),
        };
        AsyncStorage.getItem("state").then(
            (priorState: string) => this.setState(HomeScreen.deserializeState(priorState)),
            (reason: any) => console.log("damn: " + JSON.stringify(reason)));
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Todays budget</Text>
                <Text style={styles.budget}>{this.state.budget.toString()}€</Text>
                <Button title="Add" onPress={() => this.props.navigation.navigate("Add", {
                    callback: (amount: Decimal) => this.handleModification(amount),
                })} />
                <Button title="Remove" onPress={() => this.props.navigation.navigate("Add", {
                    callback: (amount: Decimal) => this.handleModification(amount.negated()),
                })} />
            </View>
        );
    }

    private storeState() {
        AsyncStorage.setItem("state", HomeScreen.serializeState(this.state));
    }

    private handleModification(amount: Decimal) {
        this.setState({
            budget: this.state.budget.add(amount),
        });
        this.storeState();
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
