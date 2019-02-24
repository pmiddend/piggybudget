import { TransactionList } from "./BudgetStore";
import Settings from "./Settings";
import { ImportData } from "./ImportData";
import { Map } from "immutable";
import { CategoryAssociation } from "./CategoryAssociation";

export default interface AppState {
	readonly transactions: TransactionList;
	readonly settings: Settings;
	readonly firstStart: number;
	readonly importError?: string;
	readonly importSuccess?: ImportData[];
	readonly associations?: Map<string, CategoryAssociation>;
}
