import React from "react";
import MyAppState from "../AppState";
import { connect } from "react-redux";
import { Component } from "react";
import { darkBackground, lightBackground } from "../Colors";
import {
	View,
	AppState,
	AppStateStatus,
} from "react-native";
import { Currency, currencies } from "../Currencies";
import {
	Text,
	Icon,
} from "react-native-elements";
import {
	storeTotalBudget,
	storeTodaysExpenses,
	TransactionList,
} from "../BudgetStore";
import {
	actionStateChange,
	actionClear,
} from "../Actions";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly currency: Currency;
	readonly onStateChange: (newState: AppStateStatus) => void;
	readonly onClear: () => void;
}

class Home extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
	}

	public componentDidMount() {
		this.props.onStateChange("background");
		AppState.addEventListener("change", this.handleAppStateChange);
	}

	public componentWillUnmount() {
		AppState.removeEventListener("change", this.handleAppStateChange);
	}

	public render() {
		const iconSize = 40;
		const todaysTotal = storeTodaysExpenses(this.props.transactions);
		const addColor = "#89c440";
		const removeColor = "#ff5606";
		const todaysTotalColor = todaysTotal.isPositive() ? addColor : removeColor;
		const total = storeTotalBudget(this.props.transactions);
		const totalColor = total.isPositive() ? addColor : removeColor;
		return (
			<View style={{
				alignItems: "center",
				flex: 1,
				justifyContent: "space-evenly",
			}}>
				<View style={{
					alignItems: "center",
					backgroundColor: darkBackground,
					flex: 1,
					justifyContent: "space-evenly",
					width: "100%",
				}}>
					<View style={{ alignItems: "center" }}>
						<Text h3>Total Budget</Text>
						<Text h1 style={{ fontWeight: "bold", color: totalColor }}>{total.toString()}
							{this.props.currency.symbol}
						</Text>
					</View>
				</View>
				<View style={{ flex: 1, width: "100%", alignItems: "center" }}>
					<View style={{
						alignItems: "center",
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-evenly",
						width: "100%",
					}}>
						<View style={{ alignItems: "center" }}>
							<Icon raised size={iconSize} color={addColor} reverse
								name="plus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
									isExpense: false,
								})} />
							<Text>Add income</Text>
						</View>
						<View style={{ alignItems: "center" }}>
							<Icon raised size={iconSize} color={removeColor} reverse
								name="minus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
									isExpense: true,
								})} />
							<Text>Add expense</Text>
						</View>
					</View>
				</View>
				<View style={{
					alignItems: "center",
					backgroundColor: lightBackground,
					flex: 1,
					justifyContent: "space-evenly",
					width: "100%",
				}}>
					<View style={{ alignItems: "center" }}>
						<Text h4>Today’s Total</Text>
						<Text h3 style={{ color: todaysTotalColor }}>
							{todaysTotal.toString()}{this.props.currency.symbol}
						</Text>
					</View>
				</View>
			</View>
		);
	}

	private handleAppStateChange(newState: AppStateStatus) {
		this.props.onStateChange(newState);
	}
}

const mapStateToProps = (state: MyAppState, ownProps: any) => {
	return {
		currency: currencies.get(state.settings.currency) as Currency,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		onClear: () => dispatch(actionClear()),
		onStateChange: (newState: AppStateStatus) => dispatch(actionStateChange(newState)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
