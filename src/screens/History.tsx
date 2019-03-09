import React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { findCategory, otherCategory } from "../Categories";
import { headerBackgroundColor, headerTintColor } from "../Colors";
import {
	MenuOptions,
	MenuOption,
	MenuTrigger,
	Menu,
} from "react-native-popup-menu";
import {
	ListItem,
	Icon,
} from "react-native-elements";
import {
	View,
	SectionList,
	Text,
	SectionListData,
	ListRenderItemInfo,
	Alert,
} from "react-native";
import { Decimal } from "decimal.js";
import {
	TransactionList,
} from "../BudgetStore";
import { Map } from "immutable";
import { CategoryData } from "../CategoryData";
import AppState from "../AppState";
import Transaction from "../Transaction";
import moment from "moment";
import { Collection } from "immutable";
import { currencies, Currency } from "../Currencies";
import { actionDeleteTransaction, actionToggleTransaction } from "../Actions";
import IndexedTransaction from "../IndexedTransaction";

interface Props {
	readonly onDeleteTransaction: (index: number) => void;
	readonly onToggleTransaction: (index: number) => void;
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly currency: Currency;
	readonly assocs: Map<string, CategoryData>;
}

interface HistoryItemProps {
	readonly transaction: Transaction;
	readonly currency: Currency;
	readonly onEdit: () => void;
	readonly onDelete: () => void;
	readonly onToggle: () => void;
	readonly assocs: Map<string, CategoryData>;
}

const HistoryItem: React.SFC<HistoryItemProps> = (props) => {
	const catOpt = findCategory(props.transaction.comment);
	const cat = catOpt === undefined ? otherCategory() : catOpt;
	const expenseOrIncome = new Decimal(props.transaction.amount).isPositive() ? "expense" : "income";
	const subtitleDate = moment(props.transaction.date).format("LT");
	const subtitle = cat.name === "AUTOMATIC" ? "Automatically added " + subtitleDate : "Added " + subtitleDate;
	const menu = (<Menu><MenuTrigger><Icon name="more-vert" /></MenuTrigger>
		<MenuOptions>
			<MenuOption onSelect={props.onEdit}>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<Text style={{ fontSize: 18, color: "black", padding: 10 }}> Edit</Text>
				</View>
			</MenuOption>
			<MenuOption onSelect={props.onToggle}>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<Text style={{ fontSize: 18, color: "black", padding: 10 }}> Make {expenseOrIncome}</Text>
				</View>
			</MenuOption>
			<MenuOption onSelect={props.onDelete}>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<Text style={{ fontSize: 18, color: "#8f0000", fontWeight: "bold", padding: 10 }}> Delete</Text>
				</View>
			</MenuOption>
		</MenuOptions>
	</Menu>);
	const assoc: CategoryData = props.assocs.get(
		cat.name,
		cat.data);
	return (<ListItem
		key={props.transaction.date.toString()}
		leftAvatar={{
			icon: {
				color: "white",
				name: assoc.icon.name,
				type: assoc.icon.type,
			},
			overlayContainerStyle: { backgroundColor: "#" + assoc.color },
		}}
		chevron={menu}
		title={props.transaction.amount.toString() + props.currency.symbol}
		titleStyle={{ fontWeight: "bold", fontSize: 22 }}
		subtitleStyle={{ fontSize: 14 }}
		subtitle={subtitle} />);
};

function getDayHeadline(date: number): string {
	return moment(new Date(date)).format("dddd, LL");
}

class History extends PureComponent<Props> {
	public static navigationOptions = {
		headerStyle: {
			backgroundColor: headerBackgroundColor,
		},
		headerTintColor,
		title: "History",
	};

	constructor(props: Props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
		this.onToggle = this.onToggle.bind(this);
		this.onEdit = this.onEdit.bind(this);
	}

	public render() {
		return (<View>
			<SectionList
				sections={this.createSections()}
				renderItem={(listEntry: ListRenderItemInfo<IndexedTransaction>) => <HistoryItem
					transaction={listEntry.item.transaction}
					assocs={this.props.assocs}
					currency={this.props.currency}
					onEdit={() => this.onEdit(listEntry.item.index)}
					onDelete={() => this.onDelete(listEntry.item.index)}
					onToggle={() => this.onToggle(listEntry.item.index)}
				/>}

				keyExtractor={(item: IndexedTransaction, index: number) => item.transaction.date.toString() + index}
				renderSectionHeader={this.renderHeader}
			/>
		</View >
		);
	}

	private onDelete(index: number) {
		Alert.alert(
			"Really delete?",
			"This cannot be undone.",
			[
				{
					onPress: () => { },
					style: "cancel",
					text: "Cancel",
				},
				{
					onPress: () => this.props.onDeleteTransaction(index),
					style: "destructive",
					text: "Delete",
				},
			],
		);
	}

	private onToggle(index: number) {
		this.props.onToggleTransaction(index);
	}

	private onEdit(index: number) {
		const t = (this.props.transactions.get(index) as Transaction);
		this.props.navigation.navigate("Modify", {
			editTransaction: {
				index,
				transaction: t,
			},
			isExpense: new Decimal(t.amount).isNegative(),
		});
	}

	private renderHeader(section: any) {
		return (<View style={{ padding: 10 }}>
			<Text
				style={{ fontSize: 16 }}>
				{section.section.header}
			</Text>
		</View>);
	}

	private createSections(): Array<SectionListData<IndexedTransaction>> {
		return this.props.transactions
			.map((t: Transaction, index: number) => ({ transaction: t, index }))
			.groupBy((value: IndexedTransaction) => getDayHeadline(value.transaction.date))
			.sortBy((values: Collection<number, IndexedTransaction>) => -(values.first() as IndexedTransaction).transaction.date)
			.map((values: Collection<number, IndexedTransaction>, header: string) => ({
				data: values.toList().sortBy((t: IndexedTransaction) => -t.transaction.date).toArray(), header,
			}))
			.toList()
			.toArray();
	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		onDeleteTransaction: (index: number) => dispatch(actionDeleteTransaction(index)),
		onToggleTransaction: (index: number) => dispatch(actionToggleTransaction(index)),
	};
};

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		assocs: state.associations === undefined ? Map<string, CategoryData>() : state.associations,
		currency: currencies.get(state.settings.currency) as Currency,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
