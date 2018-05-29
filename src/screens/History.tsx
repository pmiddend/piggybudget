import React from "react";
import {PureComponent} from "react";
import { connect } from "react-redux";
import {
    NavigationScreenProps,
} from "react-navigation";
import {
    View,
    FlatList,
    Text,
} from "react-native";
import {
    TransactionList,
} from "../BudgetStore";
import AppState from "../AppState";
import Transaction from "../Transaction";

interface Props {
    readonly navigation: any;
    readonly transactions: TransactionList;
}

interface HistoryItemProps {
    transaction: Transaction;
}

const HistoryItem: React.SFC<HistoryItemProps> = (props) => {
    return <View><Text>{props.transaction.amount.toString()}€</Text></View>;
};

class History extends PureComponent<Props> {
    public static navigationOptions = {
        title: "History",
    };

    public render() {
        return (<View>
                <FlatList data={this.props.transactions.toArray()}
                          keyExtractor={(item: Transaction, index: any) => item.date.toString()}
                          renderItem={(item) => <HistoryItem transaction={item.item} />}/>
                </View>
               );
    }
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        navigation: ownProps.navigation,
        transactions: state.transactions,
    };
};

export default connect(mapStateToProps)(History);
