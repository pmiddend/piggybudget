import React from "react";
import {PureComponent} from "react";
import { connect } from "react-redux";
import {
    NavigationScreenProps,
} from "react-navigation";
import { findCategory, otherCategory } from "../Categories";
import { Icon } from "react-native-elements";
import {
    View,
    SectionList,
    Text,
    ListRenderItem,
    SectionListData,
    ListRenderItemInfo,
} from "react-native";
import {
    TransactionList,
} from "../BudgetStore";
import AppState from "../AppState";
import Transaction from "../Transaction";
import moment from "moment";
import { Collection } from "immutable";

interface Props {
    readonly navigation: any;
    readonly transactions: TransactionList;
}

interface HistoryItemProps {
    transaction: Transaction;
}

const HistoryItem: React.SFC<HistoryItemProps> = (props) => {
    const catOpt = findCategory(props.transaction.comment);
    const cat = catOpt === undefined ? otherCategory() : catOpt;
    const viewStyle = {
        flex: 1,
        flexDirection: "row",
        
    };
    return (
            <View
        key={props.transaction.date.toString()}
        style={viewStyle}>
            <Text>{moment(props.transaction.date).format("LT")}</Text>
            <Icon name={cat.icon} type={cat.iconType} />
            <Text>{props.transaction.amount.toString()}€</Text>
        </View>);
};

interface Section {
    data: Transaction[];
    header: string;
}

function getDayHeadline(date: number): string {
    return moment(new Date(date)).format("LL");
}

class History extends PureComponent<Props> {
    public static navigationOptions = {
        title: "History",
    };

    public render() {
        return (<View>
                <SectionList
                          sections={this.createSections()}
                          renderItem={(item: ListRenderItemInfo<Transaction>) => <HistoryItem transaction={item.item} />}
                          keyExtractor={(item: Transaction, index: number) => item.date.toString() + index}
                renderSectionHeader={this.renderHeader}
                />
                </View>
               );
    }

    private renderHeader(section: any) {
        return <Text style={{fontWeight: "bold"}}>{section.section.header}</Text>;
    }

    private createSections(): Array<SectionListData<Transaction>> {
        return this.props.transactions
            .groupBy((value: Transaction) => getDayHeadline(value.date))
            .sortBy((values: Collection<number, Transaction>) => (values.first() as Transaction).date)
            .map((values: Collection<number, Transaction>, header: string) => ({ data: values.toList().toArray(), header }))
            .toList()
            .toArray();
    }
}

const mapStateToProps = (state: AppState, ownProps: any) => {
    return {
        navigation: ownProps.navigation,
        transactions: state.transactions,
    };
};

export default connect(mapStateToProps)(History);
