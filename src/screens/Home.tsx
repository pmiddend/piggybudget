import {
	NavigationScreenProps,
} from "react-navigation";
import { Decimal } from "decimal.js";
import React from "react";
import MyAppState from "../AppState";
import { connect } from "react-redux";
import { Component } from "react";
import {
	StyleSheet,
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
	public static navigationOptions = {
		tabBarIcon: <Icon name="home" type="entypo" />,
		title: "Home",
	};

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
		return (
			<View style={styles.container}>
				<Text h3>Total Budget</Text>
				<Text h1 style={{ fontWeight: "bold" }}>{storeTotalBudget(this.props.transactions).toString()}
					{this.props.currency.symbol}
				</Text>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
					<Icon raised size={iconSize} color="#89c440" reverse
						name="plus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
							amountModifier: (d: Decimal) => d,
						})} />
					<Icon raised size={iconSize} color="#ff5606" reverse
						name="minus" type="entypo" onPress={() => this.props.navigation.navigate("Add", {
							amountModifier: (d: Decimal) => d.negated(),
						})} />
				</View>
			</View>
		);
	}

	private handleAppStateChange(newState: AppStateStatus) {
		this.props.onStateChange(newState);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: "#F5FCFF",
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
	},
});

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
