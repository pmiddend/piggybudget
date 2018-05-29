import { TransactionList } from "./BudgetStore";
import { List } from "immutable";

export default interface AppState {
    readonly transactions: TransactionList;
};
