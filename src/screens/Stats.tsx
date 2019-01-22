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
import { Category, findCategory, categories } from "../Categories";
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
import { Map } from "immutable";
import { BarChart, Grid, YAxis, PieChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as scale from "d3-scale";
import { List } from "immutable";
import { Decimal } from "decimal.js";
import moment from "moment";
import { G, Circle, Image, Line } from "react-native-svg";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
}

interface State {
	icons: Map<string, any>;
}

class Stats extends Component<Props, State> {
	public static navigationOptions = {
		title: "Stats",
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			icons: Map()
		};
	}

	public componentDidMount() {
		categories.forEach((c) => c.iconClass.getImageSource(c.icon, 7, "white").then((source: any) => {
			this.setState({ icons: this.state.icons.set(c.name, source) });
		}
		));
	}

	private getIcon(s: string): any {
		return this.state.icons.get(s);
	}

	public render() {
		const axesSvg = { fontSize: 10, fill: "grey" };
		const verticalContentInset = { top: 10, bottom: 10 };
		const ts = this.props.transactions
		const listData = lastNDays(ts, 7).toJS();
		const pieData = groupedCats(this.props.transactions);
		const CoolLabels = ({ slices }) => {
			return slices.map((slice, index) => {
				const { labelCentroid, pieCentroid, data } = slice;
				return (
					<G key={index}>
						<Line
							x1={labelCentroid[0]}
							y1={labelCentroid[1]}
							x2={pieCentroid[0]}
							y2={pieCentroid[1]}
							stroke={data.svg.fill}
						/>
						<Circle
							cx={labelCentroid[0]}
							cy={labelCentroid[1]}
							r={18}
							fill={data.svg.fill}
						/>
						<Image
							x={labelCentroid[0] - 8}
							y={labelCentroid[1] - 9}
							preserveAspectRatio="xMinYMin meet"
							opacity="1"
							href={this.getIcon(data.key)}
						/>
					</G>
				)
			})
		};
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
					style={{ height: 400 }}
					valueAccessor={({ item }) => item.amount}
					data={pieData}
					innerRadius={40}
					outerRadius={110}
					labelRadius={160}
				>
					<CoolLabels />
				</PieChart>

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
