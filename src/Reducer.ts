import AppState from "./AppState";
import { List } from "immutable";
import { AsyncStorage, ToastAndroid } from "react-native";
import { Action, ActionDoImport, ActionDoExport } from "./Actions";
import { Decimal } from "decimal.js";
import { TransactionList } from "./BudgetStore";
import { ImportData } from "./ImportData";
import Transaction from "./Transaction";
import moment from "moment";
import { ExportIntent } from "./ExportIntentModule";
import Settings from "./Settings";
import { Currency, currencies } from "./Currencies";

function dayRange(from: moment.Moment, to: moment.Moment): List<moment.Moment> {
	const result = [];
	for (const m = from.clone(); m.isBefore(to); m.add(1, "days")) {
		result.push(m.clone());
	}
	return List(result);
}

function isIncomeTransaction(t: Transaction, day: moment.Moment) {
	return moment(t.date).startOf("day").isSame(moment(day).startOf("day")) && t.comment === "AUTOMATIC";
}

function hasIncomeTransaction(ts: TransactionList, day: moment.Moment) {
	return ts.some((t: Transaction) => isIncomeTransaction(t, day));
}

function determineMissingDays(
	ts: TransactionList,
	firstStart: moment.Moment,
	currentDay: moment.Moment): List<moment.Moment> {
	return dayRange(firstStart.startOf("day"), currentDay)
		.filter((m: moment.Moment) => !hasIncomeTransaction(ts, m));
}

function createDailyTransaction(
	day: moment.Moment,
	incomeType: string,
	income: Decimal): Transaction {
	return {
		amount: incomeType === "daily" ? income : new Decimal(income).div(new Decimal(day.daysInMonth())).toDecimalPlaces(2),
		comment: "AUTOMATIC",
		date: day.toDate().getTime(),
	};
}

function convertImportData(e: ImportData): Transaction {
	return {
		amount: new Decimal(e.amount),
		comment: e.comment,
		date: parseInt(e.date, 10),
	};
}

function doImport(action: ActionDoImport, state: AppState): AppState {
	const stringArray: ImportData[] = action.result;
	const stringList: List<ImportData> = List(stringArray);
	const { importSuccess: firstSuccess, ...newState } = state;
	return {
		...newState,
		transactions: stringList.map((e: ImportData) => convertImportData(e)),
	};
}

function doExport(_: ActionDoExport, state: AppState): AppState {
	const csv = state.transactions
		.map((t: Transaction) => t.amount.toString() + "," + t.comment + "," + t.date)
		.join("\n");
	ExportIntent.exportCsv(
		csv,
		() => { },
		(message: string, technicalMessage: string) => {
			ToastAndroid.show("Export failed", ToastAndroid.LONG);
		});
	return state;
}

export default (state: AppState | undefined, action: Action) => {
	if (state === undefined) {
		const initialSettings: Settings = {
			currency: "EUR",
			income: "0",
			incomeType: "daily",
		};
		return {
			firstStart: Date.now(),
			settings: initialSettings,
			transactions: List(),
		};
	}
	switch (action.type) {
		case "DO_IMPORT":
			return doImport(action, state);
		case "DO_EXPORT":
			return doExport(action, state);
		case "IMPORT_FAILED":
			return {
				...state,
				importError: action.error,
			};
		case "REMOVE_IMPORT_ERROR":
			const { importError, ...newState } = state;
			return newState;
		case "REMOVE_IMPORT_SUCCESS":
			const { importSuccess, ...newState2 } = state;
			return newState2;
		case "IMPORT_SUCCESS":
			return {
				...state,
				importSuccess: action.result,
			};
		case "ADD_TRANSACTION":
			return {
				...state,
				transactions: state.transactions.push(action.t),
			};
		case "EDIT_TRANSACTION":
			ToastAndroid.show("Item edited", ToastAndroid.SHORT);
			return {
				...state,
				transactions: state.transactions.update(
					action.t.index,
					(ignored: Transaction) => action.t.transaction),
			};
		case "TOGGLE_TRANSACTION":
			ToastAndroid.show("Item toggled", ToastAndroid.SHORT);
			const updater = (t: Transaction) => ({ ...t, amount: new Decimal(t.amount).negated() });
			return {
				...state,
				transactions: state.transactions.update(action.index, updater),
			};
		case "DELETE_TRANSACTION":
			ToastAndroid.show("Item deleted", ToastAndroid.SHORT);
			// Yes, this is highly convoluted. However, with just "delete"
			// from immutable.js, stuff didn't work. :( Have to re-evaluate that.
			const asArray = state.transactions.toArray();
			asArray.splice(action.index, 1);
			return {
				...state,
				transactions: List(asArray),
			};
		case "CLEAR":
			AsyncStorage.clear();
			ToastAndroid.show("Cleared all caches", ToastAndroid.SHORT);
			return {
				...state,
				transactions: List(),
			};
		case "STATE_CHANGE":
			const income = new Decimal(state.settings.income);
			if (income.isZero())
				return state;

			const missingDays = determineMissingDays(
				state.transactions,
				moment(state.firstStart),
				moment(),
			);

			const missingTransactions = missingDays.map(
				(d) => createDailyTransaction(
					d,
					state.settings.incomeType,
					income));

			const symbol: string = (currencies.get(state.settings.currency) as Currency).symbol;
			if (missingTransactions.size > 0)
				ToastAndroid.show(
					"Added " +
					missingTransactions
						.map((t) => t.amount)
						.reduce((sum, x) => sum.add(x), new Decimal(0)) +
					symbol +
					" for " +
					missingTransactions.size +
					" day(s)",
					ToastAndroid.LONG);

			return {
				...state,
				transactions: state.transactions.concat(missingTransactions),
			};
		case "INCOME_CHANGE":
			return {
				...state,
				settings: {
					...state.settings,
					income: action.newIncome.toString(),
				},
			};
		case "INCOME_TYPE_CHANGE":
			return {
				...state,
				settings: {
					...state.settings,
					incomeType: action.newIncomeType,
				},
			};
		case "CURRENCY_CHANGE":
			return {
				...state,
				settings: {
					...state.settings,
					currency: action.newCurrency,
				},
			};
	}
	return state;
};
