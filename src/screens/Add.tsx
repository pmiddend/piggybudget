import React from "react";
import {Component} from "react";
import {
    StyleSheet,
    View,
    TextInput,
} from "react-native";
import { List, Range } from "immutable";
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
import {findCategory, categories, Category} from "../Categories";

interface State {
    amount: string;
    commentName: string;
}

interface Props {
    readonly onNewTransaction: (t: Transaction) => void;
    readonly amountModifier: (d: Decimal) => Decimal;
    readonly navigation: any;
}

function groupRows<T>(list: List<T>, groupSize: number): List<List<T>> {
    return Range(0, Math.ceil(list.size / groupSize))
        .map((idx) => list.slice(idx * groupSize, Math.min(list.size, (idx + 1) * groupSize)))
        .toList();
}

class Add extends Component<Props> {
    public static navigationOptions = {
        tabBarIcon: <Icon name="check" type="entypo" />,
        title: "Modify",
    };

    public state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            amount: "0",
            commentName: "OTHER",
        };
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.renderButtonRow = this.renderButtonRow.bind(this);
    }

    public render() {
        const nonAutomatic = categories.filter((c) => c.name !== "AUTOMATIC");
        const buttonRows = groupRows(nonAutomatic, 4).map(this.renderButtonRow).toArray();
        return (
                <View style={styles.container}>
                <Text h2>Modify budget</Text>
                <FormLabel>Amount</FormLabel>
                <TextInput value={this.state.amount.toString()}
                           keyboardType="numeric"
                           style={{fontSize: 40}}
                           onChangeText={(text) => this.handleAmountChange(text)}/>
                <FormLabel>Category</FormLabel>
                {buttonRows}
                <Button
            raised
            title="Go!"
            onPress={() => this.handlePress()} buttonStyle={{backgroundColor: "#00a7f7"}}/>
                </View>
        );
    }

    private buttonBackgroundColor(name: string): string {
        if (name === this.state.commentName) {
            return "#666666";
        } else {
            return "#eeeeee";
        }
    }

    private buttonIconColor(name: string): string {
        if (name === this.state.commentName) {
            return "#eeeeee";
        } else {
            return "#666666";
        }
    }

    private renderButtonRow(buttonRow: List<Category>, key: number) {
        return (<View key={key} style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>{buttonRow.map((c) =>
                 (<Icon
                  key={c.name}
                  reverse
                  size={26}
                  onPress={() => this.handleCommentChange(c.name)}
                  color={this.buttonBackgroundColor(c.name)}
                  reverseColor={this.buttonIconColor(c.name)}
                  name={c.icon}
                  type={c.iconType} />))
                 .toArray()}</View>);
    }

    private handlePress() {
        const realAmount = this.state.amount.replace(/,/g, ".");
        this.props.onNewTransaction({
            amount: this.props.amountModifier(new Decimal(realAmount)),
            comment: (findCategory(this.state.commentName) as Category).name,
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

    private handleCommentChange(commentName: string) {
        this.setState({
            ...this.state,
            commentName,
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
