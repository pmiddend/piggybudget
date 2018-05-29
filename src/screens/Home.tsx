import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import React from "react";
import AppState from "../AppState";
import Transaction from "../Transaction";
import { connect } from "react-redux";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
} from "react-native";
import {
    storeTotalBudget,
    TransactionList,
} from "../BudgetStore";

interface Props {
    readonly navigation: any;
    readonly transactions: TransactionList;
}

class Home extends Component<Props> {
    public static navigationOptions = {
        title: "Home",
    };

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Todays budget</Text>
                <Text style={styles.budget}>{storeTotalBudget(this.props.transactions).toString()}€</Text>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <Button title="Add" onPress={() => this.props.navigation.navigate("Add", {
                    amountModifier: (d: Decimal) => d,
                })} />
                <Button title="Remove" onPress={() => this.props.navigation.navigate("Add", {
                    amountModifier: (d: Decimal) => d.negated(),
                })} />
                </View>
            </View>
        );
    }

    private handleModification(amount: Decimal, comment: string) {
        this.setState({
            store: storeAddTransaction(this.state.store, {
                amount: amount,
                comment: comment,
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

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        navigation: ownProps.navigation,
        transactions: state.transactions,
    };
};

export default connect(mapStateToProps)(Home);
