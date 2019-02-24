import { Decimal } from "decimal.js";
import Transaction from "./Transaction";
import { Map, List, Range } from "immutable";
import moment from "moment";
import { PieChartData } from "react-native-svg-charts";
import { categories, Category, findCategory } from "./Categories";

export type TransactionList = List<Transaction>;

export function storeTotalBudget(s: TransactionList): Decimal {
	return s
		.map((t) => t.amount)
		.reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0));
}

export function storeTodaysExpenses(s: TransactionList): Decimal {
	const startOfDay = moment().startOf("day");
	return s
		.filter((t) => moment(t.date).isAfter(startOfDay))
		.map((t) => t.amount)
		.reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0));
}

export function filterLastDays(s: TransactionList, n: number, positive: boolean): TransactionList {
	const refDate = moment().subtract(n, "days");
	return s.filter((t) => positive === new Decimal(t.amount).isPositive()).filter((t) => moment(t.date).isAfter(refDate));
}

export function lastNDaysAsMoments(n: number): List<moment.Moment> {
	const startOfDay = moment().startOf("day");
	return Range(0, n).map((d: number) => startOfDay.clone().subtract(d, "days")).toList().reverse();
}

export function lastNDays(s: TransactionList, n: number, positive: boolean): List<any> {
	return lastNDaysAsMoments(n)
		.map((d: moment.Moment) => s.filter((t) => moment(t.date).startOf("day").isSame(d)))
		.map((ts: List<Transaction>) =>
			categories.reduce((priorMap: Map<string, number>, c: Category) => priorMap.set(c.name, 0), Map()).merge(
				ts.filter((t) => positive === new Decimal(t.amount).isPositive())
					.groupBy((t) => t.comment)
					.map((tsi) => tsi.reduce(
						(sum: Decimal, x: Transaction) => sum.add(new Decimal(x.amount)),
						new Decimal(0)).toNumber())
					.toObject()));
}

export function groupedCats(s: TransactionList): PieChartData[] {
	return s.groupBy((t) => t.comment)
		.map((vs) => vs.map((t) => new Decimal(t.amount).abs())
			.reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0)).toNumber())
		.toArray()
		.map((t) => ({ key: t[0], amount: t[1], svg: { fill: "#" + (findCategory(t[0]) as Category).data.color } }));
}
