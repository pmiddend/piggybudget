import React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import {
	NavigationScreenProps,
} from "react-navigation";
import { findCategory, otherCategory } from "../Categories";
import { Icon, ListItem } from "react-native-elements";
import {
	View,
	SectionList,
	Text,
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
import { currencies, Currency } from "../Currencies";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly currency: Currency;
}

interface HistoryItemProps {
	transaction: Transaction;
	currency: Currency;
}

const HistoryItem: React.SFC<HistoryItemProps> = (props) => {
	const catOpt = findCategory(props.transaction.comment);
	const cat = catOpt === undefined ? otherCategory() : catOpt;
	return (<ListItem
		key={props.transaction.date.toString()}
		leftIcon={{ name: cat.icon, type: cat.iconType, color: "#20613c" }}
		title={props.transaction.amount.toString() + props.currency.symbol}
		hideChevron={true}
		titleStyle={{ fontWeight: "bold", fontSize: 22 }}
		subtitleStyle={{ fontSize: 14 }}
		subtitle={moment(props.transaction.date).format("LT")} />);
};

function getDayHeadline(date: number): string {
	return moment(new Date(date)).format("LL");
}

class History extends PureComponent<Props> {
	public static navigationOptions = {
		tabBarIcon: <Icon name="history" type="font-awesome" />,
		title: "History",
	};

	public render() {
		return (<View>
			<SectionList
				sections={this.createSections()}
				renderItem={(item: ListRenderItemInfo<Transaction>) => <HistoryItem
					transaction={item.item} currency={this.props.currency} />}
				keyExtractor={(item: Transaction, index: number) => item.date.toString() + index}
				renderSectionHeader={this.renderHeader}
			/>
		</View>
		);
	}

	private renderHeader(section: any) {
		return <View style={{ padding: 5 }}><Text
			style={{ fontWeight: "bold", fontSize: 20 }}>{section.section.header}</Text></View>;
	}

	private createSections(): Array<SectionListData<Transaction>> {
		return this.props.transactions
			.groupBy((value: Transaction) => getDayHeadline(value.date))
			.sortBy((values: Collection<number, Transaction>) => -(values.first() as Transaction).date)
			.map((values: Collection<number, Transaction>, header: string) => ({
				data: values.toList().sortBy((t: Transaction) => -t.date).toArray(), header,
			}))
			.toList()
			.toArray();
	}
}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		currency: currencies.get(state.settings.currency) as Currency,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

export default connect(mapStateToProps)(History);
