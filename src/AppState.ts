import { TransactionList } from "./BudgetStore";
import { List } from "immutable";
import Settings from "./Settings";

export default interface AppState {
    readonly transactions: TransactionList;
    readonly settings: Settings;
};
