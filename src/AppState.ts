import { TransactionList } from "./BudgetStore";
import Settings from "./Settings";

export default interface AppState {
	readonly transactions: TransactionList;
	readonly settings: Settings;
	readonly firstStart: number;
}
