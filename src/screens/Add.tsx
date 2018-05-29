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
import { connect } from "react-redux";
import Transaction from "../Transaction";
import { actionAddTransaction } from "../Actions";
import AppState from "../AppState";

interface State {
    amount: string;
    comment: string;
}

interface Props {
    onNewTransaction: (t: Transaction) => void;
    amountModifier: (d: Decimal) => Decimal;
    navigation: any;
}

class Add extends Component<Props> {
    public static navigationOptions = {
        title: "Modify budget",
    };

    public state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            amount: "0",
            comment: "",
        };
    }

    public render() {
        return (
                <View style={styles.container}>
                <Text style={styles.welcome}>Modify budget</Text>
                <TextInput value={this.state.amount.toString()}
                           keyboardType="numeric"
                           style={{fontSize: 40}}
                           onChangeText={(text) => this.handleAmountChange(text)}/>
                <TextInput value={this.state.comment}
                           onChangeText={(text) => this.handleCommentChange(text)}/>
                <Button title="Go!" onPress={() => this.handlePress()} />
                </View>
        );
    }

    private handlePress() {
        const realAmount = this.state.amount.replace(/,/g,".");
        console.log("real amount: "+realAmount);
        this.props.onNewTransaction({
            amount: this.props.amountModifier(new Decimal(realAmount)),
            comment: this.state.comment,
            date: Date.now(),
        });
        this.props.navigation.goBack();
    }

    private handleAmountChange(text: string) {
        this.setState({
            amount: text,
            comment: this.state.comment,
        });
    }

    private handleCommentChange(text: string) {
        this.setState({
            amount: this.state.amount,
            comment: text,
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

const mapStateToProps = (state: AppState, ownProps: any) => {
    console.log('mSTP, amount modifier: '+ownProps.navigation.state.params.amountModifier);
    return {
        amountModifier: ownProps.navigation.state.params.amountModifier,
        navigation: ownProps.navigation,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    console.log('mDTP: dispatch: '+dispatch);
    return {
        onNewTransaction: (t: Transaction) => dispatch(actionAddTransaction(t)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
