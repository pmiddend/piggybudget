import React from "react";
import { headerBackgroundColor, headerTintColor } from "../Colors";
import { Component } from "react";
import {
	ScrollView,
	View,
} from "react-native";
import { connect } from "react-redux";
import { categories } from "../Categories";
import AppState from "../AppState";
import {
	TransactionList,
	lastNDays,
	filterLastDays,
	groupedCats,
} from "../BudgetStore";
import {
	Text,
	ButtonGroup,
} from "react-native-elements";
import { Map } from "immutable";
import { StackedBarChart, Grid, YAxis, PieChart } from "react-native-svg-charts";
import { G, Circle, Image, Line } from "react-native-svg";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
}

interface State {
	icons: Map<string, any>;
	distributionIndex: number;
	sumIndex: number;
}

class Stats extends Component<Props, State> {
	public static navigationOptions = {
		headerStyle: {
			backgroundColor: headerBackgroundColor,
		},
		headerTintColor,
		title: "Stats",
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			icons: Map(),
			distributionIndex: 0,
			sumIndex: 0
		};
		this.updateDistribution = this.updateDistribution.bind(this);
		this.updateSum = this.updateSum.bind(this);
	}

	private updateDistribution(newIndex: number) {
		this.setState({ ...this.state, distributionIndex: newIndex, });
	}

	private updateSum(newIndex: number) {
		this.setState({ ...this.state, sumIndex: newIndex, });
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

	private indexToDays(n: number): number {
		if (n == 0) {
			return 7;
		}
		if (n == 1) {
			return 30;
		}
		return 365;
	}

	public render() {
		const axesSvg = { fontSize: 10, fill: "grey" };
		const verticalContentInset = { top: 10, bottom: 10 };
		/* const ts = this.props.transactions.push({
			 amount: new Decimal(20),
			 comment: "INSURANCE",
			 date: moment().subtract(4, "days"),
		   }).push({
			 amount: new Decimal(20),
			 comment: "PARTY",
			 date: moment().subtract(4, "days"),
		   });*/
		const ts = this.props.transactions;
		const sumListData = lastNDays(ts, this.indexToDays(this.state.sumIndex)).toJS();
		const sumKeys = categories.map((c) => c.name).toArray();
		const sumColors = categories.map((c) => "#" + c.color).toArray();
		const pieData = groupedCats(filterLastDays(ts, this.indexToDays(this.state.distributionIndex)));
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
		const timeButtons = ["Week", "Month", "Year"];
		return (
			<ScrollView>
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Total of the day</Text>
					<ButtonGroup onPress={this.updateSum} selectedIndex={this.state.sumIndex} buttons={timeButtons} />
				</View>
				<View style={{ height: 300, padding: 20, flexDirection: "row" }}>
					<YAxis
						data={StackedBarChart.extractDataPoints(sumListData, sumKeys)}
						svg={axesSvg}
						contentInset={verticalContentInset}
					/>
					<StackedBarChart
						style={{ flex: 1 }}
						data={sumListData}
						keys={sumKeys}
						colors={sumColors}
						contentInset={verticalContentInset}
					>
						<Grid />
					</StackedBarChart>
				</View>
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Distribution</Text>
					<ButtonGroup onPress={this.updateDistribution} selectedIndex={this.state.distributionIndex} buttons={timeButtons} />
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
