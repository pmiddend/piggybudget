import React from "react";
import { Component } from "react";
import { darkBackground, headerTintColor, headerBackgroundColor } from "../Colors";
import {
	StyleSheet,
	View,
	TextInput,
	KeyboardAvoidingView,
	ToastAndroid,
} from "react-native";
import { List } from "immutable";
import { groupRows } from "../Util";
import {
	Icon,
	Text,
} from "react-native-elements";
import { Decimal } from "decimal.js";
import { connect } from "react-redux";
import Transaction from "../Transaction";
import IndexedTransaction from "../IndexedTransaction";
import { Currency, currencies } from "../Currencies";
import { actionAddTransaction, actionEditTransaction } from "../Actions";
import AppState from "../AppState";
import { findCategory, categories, Category } from "../Categories";

interface State {
	amount: string;
	commentName: string;
}

interface Props {
	readonly onNewTransaction: (t: Transaction) => void;
	readonly onEditTransaction: (t: IndexedTransaction) => void;
	readonly isExpense: boolean;
	readonly editTransaction: IndexedTransaction | null;
	readonly navigation: any;
	readonly currency: Currency;
}


class Add extends Component<Props> {
	public static navigationOptions = ({ navigation }) => {
		const suffix = navigation.state.params.isExpense ? "expense" : "income";
		const prefix = navigation.state.params.editTransaction ? "Modify" : "Add";
		return {
			title: prefix + " " + suffix,
			headerStyle: {
				backgroundColor: headerBackgroundColor,
			},
			headerTitleStyle: {
				fontWeight: 'bold',
			},
			headerTintColor,
		}
	};

	public state: State;

	constructor(props: Props) {
		super(props);
		this.state = {
			amount: this.props.editTransaction != null ? this.props.editTransaction.transaction.amount.toString() : "0",
			commentName: this.props.editTransaction != null ? this.props.editTransaction.transaction.comment.toString() : "OTHER",
		};
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.renderButtonRow = this.renderButtonRow.bind(this);
		this.handlePress = this.handlePress.bind(this);
	}


	public componentDidMount() {
		this.props.navigation.setParams({ handlePress: this.handlePress });
	}

	public render() {
		const nonAutomatic = categories.filter((c) => c.name !== "AUTOMATIC");
		const buttonRows = groupRows(nonAutomatic, 4).map(this.renderButtonRow).toArray();
		return (
			<KeyboardAvoidingView style={styles.container}>
				<View style={{ flex: 3, backgroundColor: darkBackground, width: "100%" }}>
					{buttonRows}
				</View>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" }}>
					<TextInput value={this.state.amount.toString()}
						keyboardType="numeric"
						autoFocus={true}
						style={{ fontSize: 40 }}
						onSubmitEditing={(e) => this.handlePress()}
						onChangeText={(text) => this.handleAmountChange(text)} />
					<Text style={{ fontSize: 40 }}>{this.props.currency.symbol}</Text>
				</View>
			</KeyboardAvoidingView>
		);
	}

	private buttonBackgroundColor(name: string, originalColor: string): string {
		if (name === this.state.commentName) {
			return "#666666";
		} else {
			return "#" + originalColor;
		}
	}

	private buttonIconColor(name: string): string {
		if (name === this.state.commentName) {
			return "#eeeeee";
		} else {
			return "#ffffff";
		}
	}

	private renderButtonRow(buttonRow: List<Category>, key: number) {
		return (<View key={key} style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>{buttonRow.map((c) =>
			(<Icon
				reverse
				key={c.name}
				size={24}
				onPress={() => this.handleCommentChange(c.name)}
				color={this.buttonBackgroundColor(c.name, c.color)}
				reverseColor={this.buttonIconColor(c.name)}
				name={c.icon}
				type={c.iconType} />))
			.toArray()}</View>);
	}

	private handlePress() {
		const realAmount = this.state.amount.replace(/,/g, ".");
		const d = new Decimal(realAmount);
		if (!d.isZero()) {
			if (this.props.editTransaction != null) {
				this.props.onEditTransaction({
					transaction: {
						amount: d,
						comment: (findCategory(this.state.commentName) as Category).name,
						date: this.props.editTransaction.transaction.date
					},
					index: this.props.editTransaction.index
				});
			} else {
				this.props.onNewTransaction({
					amount: this.props.isExpense ? d.negated() : d,
					comment: (findCategory(this.state.commentName) as Category).name,
					date: Date.now(),
				});
			}
		} else {
			ToastAndroid.show("Amount is zero, nothing added", ToastAndroid.SHORT);
		}
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
		currency: currencies.get(state.settings.currency) as Currency,
		isExpense: ownProps.navigation.state.params.isExpense,
		editTransaction: ownProps.navigation.state.params.editTransaction,
		navigation: ownProps.navigation,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		onEditTransaction: (t: IndexedTransaction) => dispatch(actionEditTransaction(t)),
		onNewTransaction: (t: Transaction) => dispatch(actionAddTransaction(t)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
