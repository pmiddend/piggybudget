import React from "react";
import { headerBackgroundColor, headerTintColor } from "../Colors";
import { Component } from "react";
import { Decimal } from "decimal.js";
import {
	ScrollView,
	View,
} from "react-native";
import { connect } from "react-redux";
import {
	categories,
	Category,
	findCategory,
	iconClass
} from "../Categories";
import {
	amountColor,
	ClampedMonth,
	clampedMonthBoundaries,
	currentClampedMonth,
	isCurrent,
	localizeClamped,
	nextClampedMonth,
	priorClampedMonth,
} from "../Util";
import AppState from "../AppState";
import {
	filterLastDays,
	groupedCats,
	lastNDays,
	storePastExpenses,
	TransactionList,
} from "../BudgetStore";
import {
	Text,
	ButtonGroup,
	Button,
	Icon,
} from "react-native-elements";
import { Map } from "immutable";
import { StackedBarChart, Grid, YAxis, PieChart } from "react-native-svg-charts";
import { G, Circle, Image, Line } from "react-native-svg";
import { categoryDataEquals, CategoryData } from "../CategoryData";
import {
	Table,
	Rows,
} from "react-native-table-component";

interface Props {
	readonly navigation: any;
	readonly transactions: TransactionList;
	readonly assocs: Map<string, CategoryData>;
}

interface State {
	icons: Map<string, any>;
	distributionIndex: number;
	sumExpenseIndex: number;
	sumIncomeIndex: number;
	selectedMonth: ClampedMonth;
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
			sumExpenseIndex: 0,
			sumIncomeIndex: 0,
			selectedMonth: currentClampedMonth(),
		};

		console.log("--------------------++++++++++ " + JSON.stringify(currentClampedMonth()));
		this.updateDistribution = this.updateDistribution.bind(this);
		this.updateExpenseSum = this.updateExpenseSum.bind(this);
		this.previousMonth = this.previousMonth.bind(this);
		this.nextMonth = this.nextMonth.bind(this);
		this.updateIncomeSum = this.updateIncomeSum.bind(this);
	}

	private updateDistribution(newIndex: number) {
		this.setState({ ...this.state, distributionIndex: newIndex, });
	}

	private previousMonth() {
		this.setState({ ...this.state, selectedMonth: priorClampedMonth(this.state.selectedMonth), });
	}

	private nextMonth() {
		this.setState({ ...this.state, selectedMonth: nextClampedMonth(this.state.selectedMonth), });
	}

	private updateExpenseSum(newIndex: number) {
		this.setState({ ...this.state, sumExpenseIndex: newIndex, });
	}

	private updateIncomeSum(newIndex: number) {
		this.setState({ ...this.state, sumIncomeIndex: newIndex, });
	}

	public componentDidMount() {
		this.calculateIcons();
	}

	public componentDidUpdate(prevProps: Props) {
		const pa = prevProps.assocs;
		const a = this.props.assocs;

		let recalculate = false;
		const ak = a.keySeq();
		if (!ak.equals(pa.keySeq())) {
			recalculate = true;
		} else {
			recalculate = ak.some((k: string) => !categoryDataEquals(a.get(k) as CategoryData, pa.get(k) as CategoryData));
		}
		if (recalculate) {
			this.calculateIcons();
		}
	}

	private calculateIcons() {
		categories
			.forEach((c) => {
				const assoc = this.props.assocs.get(
					c.name,
					c.data);
				const ic = iconClass(assoc.icon.type);
				const icp = ic.getImageSource(assoc.icon.name, 32, "white");
				icp.then((source: any) => {
					this.setState({ icons: this.state.icons.set(c.name, source) });
				});
			});
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
		const ts = this.props.transactions;
		const sumListDataPositive = lastNDays(ts, this.indexToDays(this.state.sumIncomeIndex), true).toJS();
		const sumListDataNegative = lastNDays(ts, this.indexToDays(this.state.sumExpenseIndex), false).toJS();
		const sumKeys = categories.map((c) => c.name).toArray();
		const sumColors = categories.map((c) => "#" + c.data.color).toArray();
		const pieData = groupedCats(filterLastDays(ts, this.indexToDays(this.state.distributionIndex), false));
		const CoolLabels = ({ slices }: { slices: any }) => {
			return slices.map((slice: any, index: any) => {
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
							x={labelCentroid[0] - 9}
							y={labelCentroid[1] - 9}
							width={18}
							height={18}
							opacity="1"
							href={this.getIcon(data.key)}
						/>
					</G>
				)
			})
		};
		const timeButtonsShort = ["Week", "Month"];
		const timeButtons = ["Week", "Month", "Year"];
		const monthBoundaries = clampedMonthBoundaries(this.state.selectedMonth);
		const tableRows =
			(storePastExpenses(this.props.transactions, monthBoundaries))
				.entrySeq()
				.sortBy(
					(keyValue: [string, Decimal]) => keyValue[1],
					(a: Decimal, b: Decimal) => a.comparedTo(b))
				.map((keyValue: [string, Decimal]) => {
					const catName = keyValue[0];
					const catData = findCategory(catName) as Category;
					const amount = keyValue[1];
					const amountC = amountColor(amount);
					const assoc: CategoryData = this.props.assocs.get(
						catName,
						catData.data);
					const icon = (<Icon
						reverse
						color={"#" + assoc.color}
						name={assoc.icon.name}
						size={18}
						type={assoc.icon.type} />);
					return [
						<Text />,
						<View style={{ paddingLeft: 30 }}>{icon}</View>,
						<Text style={{ color: amountC, textAlign: "left", fontSize: 20 }}>
							{amount.toString()}
						</Text>];
				});
		const table = (<Table borderStyle={{ borderColor: "transparent" }}>
			<Rows flexArr={[1, 3, 2]} data={tableRows} textStyle={{ textAlign: "center" }} />
		</Table>);
		const empty = (<View>
			<Text style={{ textAlign: "center" }}>No entries</Text>
		</View>)
		const tableOrEmpty = tableRows.isEmpty() ? empty : table;
		return (
			<ScrollView>
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Daily Expenses</Text>
					<ButtonGroup onPress={this.updateExpenseSum} selectedIndex={this.state.sumExpenseIndex} buttons={timeButtonsShort} />
				</View>
				<View style={{ height: 300, padding: 20, flexDirection: "row" }}>
					<YAxis
						data={StackedBarChart.extractDataPoints(sumListDataNegative, sumKeys)}
						svg={axesSvg}
						contentInset={verticalContentInset}
					/>
					<StackedBarChart
						style={{ flex: 1 }}
						data={sumListDataNegative}
						keys={sumKeys}
						colors={sumColors}
						contentInset={verticalContentInset}
					>
						<Grid />
					</StackedBarChart>
				</View>
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Daily Income</Text>
					<ButtonGroup
						onPress={this.updateIncomeSum}
						selectedIndex={this.state.sumIncomeIndex}
						buttons={timeButtonsShort} />
				</View>
				<View style={{ height: 300, padding: 20, flexDirection: "row" }}>
					<YAxis
						data={StackedBarChart.extractDataPoints(sumListDataPositive, sumKeys)}
						svg={axesSvg}
						contentInset={verticalContentInset}
					/>
					<StackedBarChart
						style={{ flex: 1 }}
						data={sumListDataPositive}
						keys={sumKeys}
						colors={sumColors}
						contentInset={verticalContentInset}
					>
						<Grid />
					</StackedBarChart>
				</View>
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Distribution Expenses</Text>
					<ButtonGroup
						onPress={this.updateDistribution}
						selectedIndex={this.state.distributionIndex}
						buttons={timeButtons} />
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
				<View style={{ paddingLeft: 10 }}>
					<Text h4>Value table</Text>
					<View style={{ flex: 1, flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "center" }}>
						<Button type="outline" title="  <  " onPress={this.previousMonth} titleStyle={{ fontSize: 17 }} />
						<Text style={{ fontSize: 18 }}>{localizeClamped(this.state.selectedMonth)}</Text>
						<Button type="outline" title="  >  " onPress={this.nextMonth} disabled={isCurrent(this.state.selectedMonth)} titleStyle={{ fontSize: 17 }} />
					</View>
				</View>
				<View style={{ paddingLeft: 10, paddingRight: 10 }}>
					{tableOrEmpty}
				</View>
			</ScrollView >
		);
	}
}

const mapStateToProps = (state: AppState, ownProps: any) => {
	return {
		assocs: state.associations === undefined ? Map<string, CategoryData>() : state.associations,
		navigation: ownProps.navigation,
		transactions: state.transactions,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
