import { Decimal } from "decimal.js";
import Transaction from "./Transaction";
import { List } from "immutable";
import moment from "moment";
import { PieChartData } from "react-native-svg-charts";

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

export function lastNDays(s: TransactionList, n: number): List<number> {
	const refDate = moment().subtract(n, "days");
	return s.filter((t) => moment(t.date).isAfter(refDate))
		.groupBy((t) => moment(t.date).startOf("day"))
		.map((ts) => ts.map((t) => t.amount).reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0)).toNumber())
		.toOrderedMap()
		.toList();
}

export function groupedCats(s: TransactionList): PieChartData[] {
	return s.groupBy((t) => t.comment)
		.map((vs) => vs.map((t) => new Decimal(t.amount).abs())
			.reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0)).toNumber())
		.toArray()
		.map((t) => ({ key: t[0], amount: t[1] }));
}
