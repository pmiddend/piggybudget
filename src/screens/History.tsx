import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { findCategory, otherCategory } from "../Categories";
import Menu, {
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from "react-native-popup-menu";
import {
	ListItem,
	Overlay,
	Button
} from "react-native-elements";
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
import { Collection, List } from "immutable";
import { currencies, Currency } from "../Currencies";
import { actionDeleteTransaction } from "../Actions";

interface IndexedTransaction {
	transaction: Transaction,
	index: number,
}

interface Props {
	readonly onDeleteTransaction: (index: number) => void;
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly currency: Currency;
}

interface State {
	readonly deleteId: number | null;
}

interface HistoryItemProps {
	readonly transaction: Transaction;
	readonly currency: Currency;
	readonly onEdit: () => void;
	readonly onDelete: () => void;
}

const HistoryItem: React.SFC<HistoryItemProps> = (props) => {
	const catOpt = findCategory(props.transaction.comment);
	const cat = catOpt === undefined ? otherCategory() : catOpt;
	return (<Menu>
		<MenuTrigger>
			<ListItem
				key={props.transaction.date.toString()}
				topDivider={true}
				leftIcon={{ name: cat.icon, type: cat.iconType, color: "#" + cat.color }}
				title={props.transaction.amount.toString() + props.currency.symbol}
				titleStyle={{ fontWeight: "bold", fontSize: 22 }}
				subtitleStyle={{ fontSize: 14 }}
				subtitle={moment(props.transaction.date).format("LT")} />
		</MenuTrigger>
		<MenuOptions>
			<MenuOption onSelect={props.onEdit}>
				<Text style={{ fontSize: 20 }}>Edit</Text>
			</MenuOption>
			<MenuOption onSelect={props.onDelete}>
				<Text style={{ fontSize: 20 }}>Delete</Text>
			</MenuOption>
		</MenuOptions>
	</Menu>);
};

function getDayHeadline(date: number): string {
	return moment(new Date(date)).format("LL");
}

class History extends Component<Props, State> {
	public static navigationOptions = {
		title: "History",
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			deleteId: null,
		};
		this.onDelete = this.onDelete.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.closeDeleteModal = this.closeDeleteModal.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);
	}

	public render() {
		return (<View>
			<Overlay isVisible={this.state.deleteId !== null}
				onRequestClose={this.closeDeleteModal}
				width={300}
				height={100}
				onBackdropPress={this.closeDeleteModal}>
				<View style={{ flex: 1, justifyContent: "space-evenly" }}>
					<Text style={{ fontSize: 16 }}>Really delete?</Text>
					<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
						<Button title="CANCEL" type="clear" onPress={this.closeDeleteModal} />
						<Button title="DELETE" type="clear" onPress={this.deleteSelected} />
					</View>
				</View>
			</Overlay>
			<SectionList
				sections={this.createSections()}
				renderItem={(listEntry: ListRenderItemInfo<IndexedTransaction>) => <HistoryItem
					transaction={listEntry.item.transaction}
					currency={this.props.currency}
					onEdit={() => this.onDelete(listEntry.item.index)}
					onDelete={() => this.onDelete(listEntry.item.index)} />}

				keyExtractor={(item: IndexedTransaction, index: number) => item.transaction.date.toString() + index}
				renderSectionHeader={this.renderHeader}
			/>
		</View >
		);
	}

	private closeDeleteModal() {
		this.setState({
			...this.state,
			deleteId: null
		});
	}

	private deleteSelected() {
		if (this.state.deleteId !== null)
			this.props.onDeleteTransaction(this.state.deleteId);
		this.closeDeleteModal();
	}

	private onDelete(index: number) {
		this.setState({
			...this.state,
			deleteId: index
		});
	}

	private onEdit(index: number) {
		console.log("onedit " + index);
	}

	private renderHeader(section: any) {
		return <View style={{ padding: 5 }}><Text
			style={{ fontWeight: "bold", fontSize: 20 }}>{section.section.header}</Text></View>;
	}

	private createSections(): Array<SectionListData<IndexedTransaction>> {
		return this.props.transactions
			.map((t: Transaction, index: number) => ({ transaction: t, index: index }))
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
	};
};

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		currency: currencies.get(state.settings.currency) as Currency,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
