import React from "react";
import { Component } from "react";
import { headerBackgroundColor, headerTintColor } from "../Colors";
import {
	View,
	Picker,
} from "react-native";
import moment from "moment";
import { Decimal } from "decimal.js";
import { connect } from "react-redux";
import {
	actionCurrencyChange,
	actionIncomeTypeChange,
	actionIncomeChange,
} from "../Actions";
import AppState from "../AppState";
import AppSettings from "../Settings";
import {
	Input,
	ButtonGroup,
	Text,
} from "react-native-elements";
import { currencies, Currency } from "../Currencies";

interface Props {
	readonly navigation: any;
	readonly settings: AppSettings;
	readonly onIncomeTypeChange: (newIncomeType: string) => void;
	readonly onIncomeChange: (newIncomeType: Decimal) => void;
	readonly onChangeCurrency: (newCurrency: string) => void;
}

interface State {
	readonly income: string;
}

class Settings extends Component<Props, State> {
	private buttons: string[];

	constructor(props: Props) {
		super(props);
		this.state = {
			income: this.props.settings.income,
		};
		this.handlePress = this.handlePress.bind(this);
		this.handleIncomeChange = this.handleIncomeChange.bind(this);
		this.buttons = ["daily", "monthly"];

	}

	public render() {
		const selectedIndex = this.buttons.indexOf(this.props.settings.incomeType);
		return (
			<View style={{ padding: 10 }}>
				<Text>Currency</Text>
				<Picker selectedValue={this.props.settings.currency} onValueChange={this.props.onChangeCurrency}>
					{currencies.valueSeq().map((c) => <Picker.Item key={c.code} label={c.name} value={c.code} />).toArray()}
				</Picker>
				<Text>Income type</Text>
				<ButtonGroup
					buttons={this.buttons}
					selectedIndex={selectedIndex}
					onPress={this.handlePress} />
				<Text>Income</Text>
				<Input value={this.state.income}
					keyboardType="numeric"
					onChangeText={this.handleIncomeChange} />
				<Text>
					Daily income:
                {this.dailyIncomeString()}
					{(currencies.get(this.props.settings.currency) as Currency).symbol}
				</Text>
			</View>
		);
	}

	private dailyIncomeString(): string {
		const result = this.dailyIncome().toString();
		if (result.indexOf(".") === -1)
			return result;
		const splitResult = result.split(".");
		return splitResult[0] + "." + splitResult[1].substring(0, 2);
	}

	private dailyIncome(): Decimal {
		if (this.props.settings.income === "")
			return new Decimal(0);
		if (this.props.settings.incomeType === "daily")
			return new Decimal(this.props.settings.income);
		const daysThisMonth: number = moment().daysInMonth();
		return new Decimal(this.props.settings.income).div(new Decimal(daysThisMonth));
	}

	private handlePress(selectedIndex: number) {
		this.props.onIncomeTypeChange(this.buttons[selectedIndex]);
	}

	private handleIncomeChange(newIncome: string) {
		this.setState({
			income: newIncome,
		});
		try {
			this.props.onIncomeChange(new Decimal(newIncome));
		} catch (e) {
			console.log("Couldn't convert " + newIncome + " to decimal");
		}
	}

}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		navigation: ownProps.navigation,
		settings: state.settings,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		onChangeCurrency: (t: string) => dispatch(actionCurrencyChange(t)),
		onIncomeChange: (t: Decimal) => dispatch(actionIncomeChange(t)),
		onIncomeTypeChange: (t: string) => dispatch(actionIncomeTypeChange(t)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
