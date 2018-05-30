import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import React from "react";
import MyAppState from "../AppState";
import Transaction from "../Transaction";
import { connect } from "react-redux";
import {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    AppState,
    AppStateStatus,
} from "react-native";
import {
    storeTotalBudget,
    TransactionList,
} from "../BudgetStore";
import { actionStateChange } from "../Actions";

interface Props {
    readonly navigation: any;
    readonly transactions: TransactionList;
    readonly onStateChange: (newState: string) => void;
}

class Home extends Component<Props, State> {
    public static navigationOptions = {
        title: "Home",
    };

    private stateChangeBind: any;

    constructor(props: Props) {
        super(props);
        this.stateChangeBind = this.handleAppStateChange.bind(this);
    }

    public componentDidMount() {
        console.log("mount");
        AppState.addEventListener("change", this.stateChangeBind);
    }

    public componentWillUnmount() {
        AppState.removeEventListener("change", this.stateChangeBind);
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

    private handleAppStateChange(newState: AppStateStatus) {
        this.props.onStateChange(newState);
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
    flexDirection: "column",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});

const mapStateToProps = (state: MyAppState, ownProps: any) => {
    return {
        navigation: ownProps.navigation,
        transactions: state.transactions,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onStateChange: (newState: AppStateStatus) => dispatch(actionStateChange(newState)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
