import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    View,
    TextInput,
} from "react-native";
import {
    Text,
    Button,
} from "react-native-elements";
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
    readonly onNewTransaction: (t: Transaction) => void;
    readonly amountModifier: (d: Decimal) => Decimal;
    readonly navigation: any;
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
                <Text h2>Modify budget</Text>
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
        this.props.onNewTransaction({
            amount: this.props.amountModifier(new Decimal(realAmount)),
            comment: this.state.comment,
            date: Date.now(),
        });
        this.props.navigation.goBack();
    }

    private handleAmountChange(text: string) {
        const newText = text !== "0" && text[0] === "0" ? text.slice(1) : text;
        this.setState({
            amount: newText,
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
  container: {
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flex: 1,
    justifyContent: "center",
  },
});

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        amountModifier: ownProps.navigation.state.params.amountModifier,
        navigation: ownProps.navigation,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onNewTransaction: (t: Transaction) => dispatch(actionAddTransaction(t)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
