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
    ButtonGroup,
    Icon,
    FormLabel,
} from "react-native-elements";
import {
    NavigationScreenProps,
} from "react-navigation";
import {Decimal} from "decimal.js";
import { connect } from "react-redux";
import Transaction from "../Transaction";
import { actionAddTransaction } from "../Actions";
import AppState from "../AppState";
import {categories, Category} from "../Categories";

interface State {
    amount: string;
    commentIndex: number;
}

interface Props {
    readonly onNewTransaction: (t: Transaction) => void;
    readonly amountModifier: (d: Decimal) => Decimal;
    readonly navigation: any;
}

class Add extends Component<Props> {
    public static navigationOptions = {
        title: "Modify",
    };

    public state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            amount: "0",
            commentIndex: 4,
        };
        this.handleCommentChange = this.handleCommentChange.bind(this);
    }

    public render() {
        const buttons = categories
            .filter((c) => c.name !== "AUTOMATIC")
            .map((c) => (<Icon name={c.icon} type={c.iconType} />))
            .map((c) => ({ element: () => c }))
            .toArray();
        return (
                <View style={styles.container}>
                <Text h2>Modify budget</Text>
                <FormLabel>Amount</FormLabel>
                <TextInput value={this.state.amount.toString()}
                           keyboardType="numeric"
                           style={{fontSize: 40}}
                           onChangeText={(text) => this.handleAmountChange(text)}/>
                <FormLabel>Category</FormLabel>
                <ButtonGroup buttons={buttons}
                             selectedIndex={this.state.commentIndex}
                             onPress={this.handleCommentChange} />
                <Button
            raised
            title="Go!"
            onPress={() => this.handlePress()}
            buttonStyle={{backgroundColor: "#00a7f7"}}/>
                </View>
        );
    }

    private handlePress() {
        const realAmount = this.state.amount.replace(/,/g, ".");
        this.props.onNewTransaction({
            amount: this.props.amountModifier(new Decimal(realAmount)),
            comment: (categories.get(this.state.commentIndex) as Category).name,
            date: Date.now(),
        });
        this.props.navigation.goBack();
    }

    private handleAmountChange(text: string) {
        const newText = text !== "0" && text[0] === "0" ? text.slice(1) : text;
        this.setState({
            ...this.state,
            amount: newText,
        });
    }

    private handleCommentChange(commentIndex: number) {
        this.setState({
            ...this.state,
            commentIndex,
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
