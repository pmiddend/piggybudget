import { Decimal } from "decimal.js";
import Transaction from "./Transaction";
import { List } from "immutable";
import moment from "moment";

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
