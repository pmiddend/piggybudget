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
import {
    storeInit,
    BudgetStore,
    storeAddTransaction,
    storeTotalBudget,
} from "../BudgetStore";

interface State {
    store: BudgetStore;
}

interface Props {
    store: BudgetStore
};

export default class HomeScreen extends Component<NavigationScreenProps<Props>> {
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

    constructor(props: NavigationScreenProps<Props>) {
        super(props);
        this.state = {
            store: this.props.navigation.state.params!.store,
        };
        console.log('initial store '+JSON.stringify(this.state.store));
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Todays budget</Text>
                <Text style={styles.budget}>{storeTotalBudget(this.state.store).toString()}€</Text>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <Button title="Add" onPress={() => this.props.navigation.navigate("Add", {
                    callback: (amount: Decimal) => this.handleModification(amount),
                })} />
                <Button title="Remove" onPress={() => this.props.navigation.navigate("Add", {
                    callback: (amount: Decimal) => this.handleModification(amount.negated()),
                })} />
                </View>
            </View>
        );
    }

    private handleModification(amount: Decimal) {
        this.setState({
            store: storeAddTransaction(this.state.store, {
                amount: amount,
                comment: "",
                date: Date.now(),
            }),
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
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});
