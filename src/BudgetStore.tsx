import {Decimal} from "decimal.js";
import Transaction from "./Transaction";
import { List } from "immutable";

export type TransactionList = List<Transaction>;

export function storeTotalBudget(s: TransactionList): Decimal {
    return s
        .map((t) => t.amount)
        .reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0));
}
