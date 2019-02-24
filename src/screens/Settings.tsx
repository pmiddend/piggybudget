import React from "react";
import { List, Map } from "immutable";
import { groupRows } from "../Util";
import { Component } from "react";
import {
	View,
	Picker,
	ScrollView,
} from "react-native";
import moment from "moment";
import { categories, Category } from "../Categories";
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
	Icon,
} from "react-native-elements";
import { currencies, Currency } from "../Currencies";
import { CategoryData } from "../CategoryData";

interface Props {
	readonly navigation: any;
	readonly settings: AppSettings;
	readonly onIncomeTypeChange: (newIncomeType: string) => void;
	readonly onIncomeChange: (newIncomeType: Decimal) => void;
	readonly onChangeCurrency: (newCurrency: string) => void;
	readonly assocs: Map<string, CategoryData>;
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
		this.handleCategoryPress = this.handleCategoryPress.bind(this);
		this.handleIncomeChange = this.handleIncomeChange.bind(this);
		this.buttons = ["daily", "monthly"];
		this.renderButtonRow = this.renderButtonRow.bind(this);
	}

	public render() {
		const nonAutomatic = categories.filter((c) => c.name !== "AUTOMATIC");
		const buttonRows = groupRows(nonAutomatic, 4).map(this.renderButtonRow).toArray();
		const selectedIndex = this.buttons.indexOf(this.props.settings.incomeType);
		return (
			<ScrollView style={{ flex: 1, padding: 10 }}>
				<Text>Currency</Text>
				<Picker selectedValue={this.props.settings.currency} onValueChange={this.props.onChangeCurrency}>
					{currencies.valueSeq().map((c) => <Picker.Item key={c.code} label={c.name} value={c.code} />).toArray()}
				</Picker>
				<Text>Income type</Text>
				<ButtonGroup
					buttons={this.buttons}
					selectedIndex={selectedIndex}
					onPress={this.handleCategoryPress} />
				<Text>Income</Text>
				<Input value={this.state.income}
					keyboardType="numeric"
					onChangeText={this.handleIncomeChange} />
				<Text>
					Daily income: {this.dailyIncomeString()}
					{(currencies.get(this.props.settings.currency) as Currency).symbol}
				</Text>
				<Text>Categories (tap to change)</Text>
				<View style={{
					alignItems: "center",
					flex: 1,
					justifyContent: "space-evenly",
					width: "100%",
				}}>
					{buttonRows}
				</View>
			</ScrollView>
		);
	}

	private buttonBackgroundColor(originalColor: string): string {
		return "#" + originalColor;
	}
	private buttonIconColor(): string {
		return "#ffffff";
	}

	private renderIcon(c: Category) {
		const assoc: CategoryData = this.props.assocs.get(
			c.name,
			c.data);
		return (<Icon
			reverse
			key={c.name}
			size={24}
			onPress={() => this.props.navigation.navigate("Association", {
				originalName: c.name,
			})}
			color={this.buttonBackgroundColor(assoc.color)}
			reverseColor={this.buttonIconColor()}
			name={assoc.icon.name}
			type={assoc.icon.type} />);
	}

	private renderButtonRow(buttonRow: List<Category>, key: number) {
		return (<View key={key} style={
			{
				flex: 1,
				flexDirection: "row",
			}
		}>
			{buttonRow.map((c) => this.renderIcon(c)).toArray()}
		</View>);
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
	private handleCategoryPress(selectedIndex: number) {
		this.props.onIncomeTypeChange(this.buttons[selectedIndex]);
	}

	private handleIncomeChange(newIncome: string) {
		this.setState({
			income: newIncome,
		});
		this.props.onIncomeChange(new Decimal(newIncome));
	}

}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		assocs: state.associations === undefined ? Map<string, CategoryData>() : state.associations,
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
