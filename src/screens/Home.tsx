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
    View,
    AsyncStorage,
    AppState,
    AppStateStatus,
} from "react-native";
import { Text, Button } from "react-native-elements";
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
        AppState.addEventListener("change", this.stateChangeBind);
    }

    public componentWillUnmount() {
        AppState.removeEventListener("change", this.stateChangeBind);
    }

    public render() {
        return (
            <View style={styles.container}>
                <Text h3>Todays budget</Text>
                <Text h1>{storeTotalBudget(this.props.transactions).toString()}€</Text>
                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                <Button large title="Add" onPress={() => this.props.navigation.navigate("Add", {
                    amountModifier: (d: Decimal) => d,
                })} />
                <Button large title="Remove" onPress={() => this.props.navigation.navigate("Add", {
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
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
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
