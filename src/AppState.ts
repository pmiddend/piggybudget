import { TransactionList } from "./BudgetStore";
import Settings from "./Settings";
import { Map } from "immutable";
import { CategoryData } from "./CategoryData";

export default interface AppState {
	readonly transactions: TransactionList;
	readonly settings: Settings;
	readonly firstStart: number;
	readonly importError?: string;
	readonly importSuccess?: string;
	readonly associations?: Map<string, CategoryData>;
}
