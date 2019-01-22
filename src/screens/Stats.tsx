import React from "react";
import { Component } from "react";
import {
	ScrollView,
	View,
} from "react-native";
import {
	NavigationScreenProps,
} from "react-navigation";
import { connect } from "react-redux";
import { categories } from "../Categories";
import { groupRows } from "../Util";
import AppState from "../AppState";
import {
	TransactionList,
	lastNDays,
	groupedCats,
} from "../BudgetStore";
import {
	Text,
	Icon,
} from "react-native-elements";
import Transaction from "../Transaction";
import { BarChart, Grid, YAxis, PieChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { List } from "immutable";
import { Decimal } from "decimal.js";
import moment from "moment";
import { G, Circle } from "react-native-svg";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
}

class Stats extends Component<Props> {
	public static navigationOptions = {
		title: "Stats",
	};

	public render() {
		const axesSvg = { fontSize: 10, fill: "grey" };
		const verticalContentInset = { top: 10, bottom: 10 };
		const ts = this.props.transactions
		const listData = lastNDays(ts, 7).toJS();
		const pieData = groupedCats(this.props.transactions);
		const legendRows = groupRows(categories, 2).map((r, idx) => (<View key={idx} style={{ flex: 1, flexDirection: "row" }}>{r.map((c) => (<Icon
			key={c.name}
			size={24}
			color={"#" + c.color}
			name={c.icon}
			type={c.iconType} />))}</View>)).toArray();
		return (
			<ScrollView>
				<View style={{ paddingLeft: 10 }}>
					<Text h3>Last 7 days</Text>
				</View>
				<View style={{ height: 300, padding: 20, flexDirection: "row" }}>
					<YAxis
						data={listData}
						svg={axesSvg}
						contentInset={verticalContentInset}
					/>
					<BarChart
						style={{ flex: 1 }}
						data={listData}
						svg={{ fill: "rgba(134, 65, 244, 0.8)" }}
						contentInset={verticalContentInset}
					>
						<Grid />
					</BarChart>
				</View>
				<View style={{ paddingLeft: 10 }}>
					<Text h3>Distribution</Text>
				</View>
				<PieChart
					style={{ height: 200 }}
					valueAccessor={({ item }) => item.amount}
					data={pieData}
					outerRadius={"95%"}
				/>
				{legendRows}

			</ScrollView >
		);
	}
}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
