import Transaction from "./Transaction";
import { ImportData } from "./ImportData";
import IndexedTransaction from "./IndexedTransaction";
import { AppStateStatus } from "react-native";
import { Decimal } from "decimal.js";
import { CategoryData } from "./CategoryData";

export interface ActionAddTransaction {
	readonly type: "ADD_TRANSACTION";
	readonly t: Transaction;
}

export interface ActionChangeAssociation {
	readonly type: "CHANGE_ASSOCIATION";
	readonly originalName: string;
	readonly newIcon: CategoryData;
}

export interface ActionImportFailed {
	readonly type: "IMPORT_FAILED";
	readonly error: string;
}

export interface ActionDoImport {
	readonly type: "DO_IMPORT";
	readonly result: ImportData[];
}

export interface ActionDoExport {
	readonly type: "DO_EXPORT";
}

export interface ActionRemoveImportError {
	readonly type: "REMOVE_IMPORT_ERROR";
}

export interface ActionRemoveImportSuccess {
	readonly type: "REMOVE_IMPORT_SUCCESS";
}

export interface ActionImportSuccess {
	readonly type: "IMPORT_SUCCESS";
	readonly result: ImportData[];
}

export interface ActionEditTransaction {
	readonly type: "EDIT_TRANSACTION";
	readonly t: IndexedTransaction;
}

export interface ActionDeleteTransaction {
	readonly type: "DELETE_TRANSACTION";
	readonly index: number;
}

export interface ActionToggleTransaction {
	readonly type: "TOGGLE_TRANSACTION";
	readonly index: number;
}

export interface ActionStateChange {
	readonly type: "STATE_CHANGE";
	readonly newState: AppStateStatus;
}

export interface ActionIncomeTypeChange {
	readonly type: "INCOME_TYPE_CHANGE";
	readonly newIncomeType: string;
}

export interface ActionIncomeChange {
	readonly type: "INCOME_CHANGE";
	readonly newIncome: Decimal;
}

export interface ActionCurrencyChange {
	readonly type: "CURRENCY_CHANGE";
	readonly newCurrency: string;
}

export interface ActionClear {
	readonly type: "CLEAR";
}

export function actionAddTransaction(t: Transaction): ActionAddTransaction {
	return {
		t,
		type: "ADD_TRANSACTION",
	};
}

export function actionEditTransaction(t: IndexedTransaction): ActionEditTransaction {
	return {
		t,
		type: "EDIT_TRANSACTION",
	};
}

export function actionDeleteTransaction(index: number): ActionDeleteTransaction {
	return {
		index,
		type: "DELETE_TRANSACTION",
	};
}

export function actionToggleTransaction(index: number): ActionToggleTransaction {
	return {
		index,
		type: "TOGGLE_TRANSACTION",
	};
}

export function actionStateChange(newState: AppStateStatus): ActionStateChange {
	return {
		newState,
		type: "STATE_CHANGE",
	};
}

export function actionCurrencyChange(newCurrency: string): ActionCurrencyChange {
	return {
		newCurrency,
		type: "CURRENCY_CHANGE",
	};
}

export function actionClear(): ActionClear {
	return {
		type: "CLEAR",
	};
}

export function actionIncomeChange(newIncome: Decimal): ActionIncomeChange {
	return {
		newIncome,
		type: "INCOME_CHANGE",
	};
}

export function actionChangeAssociation(originalName: string, newIcon: CategoryData): ActionChangeAssociation {
	return {
		newIcon,
		originalName,
		type: "CHANGE_ASSOCIATION",
	};
}

export function actionIncomeTypeChange(newIncomeType: string): ActionIncomeTypeChange {
	return {
		newIncomeType,
		type: "INCOME_TYPE_CHANGE",
	};
}

export function actionImportFailed(error: string): ActionImportFailed {
	return {
		error,
		type: "IMPORT_FAILED",
	};
}

export function actionImportSuccess(result: ImportData[]): ActionImportSuccess {
	return {
		result,
		type: "IMPORT_SUCCESS",
	};
}

export function actionDoImport(result: ImportData[]): ActionDoImport {
	return {
		result,
		type: "DO_IMPORT",
	};
}

export function actionDoExport(): ActionDoExport {
	return {
		type: "DO_EXPORT",
	};
}

export function actionRemoveImportError(): ActionRemoveImportError {
	return {
		type: "REMOVE_IMPORT_ERROR",
	};
}

export function actionRemoveImportSuccess(): ActionRemoveImportSuccess {
	return {
		type: "REMOVE_IMPORT_SUCCESS",
	};
}

export type Action = ActionAddTransaction
	| ActionStateChange
	| ActionClear
	| ActionIncomeTypeChange
	| ActionDeleteTransaction
	| ActionToggleTransaction
	| ActionEditTransaction
	| ActionCurrencyChange
	| ActionImportFailed
	| ActionImportSuccess
	| ActionDoImport
	| ActionDoExport
	| ActionRemoveImportError
	| ActionChangeAssociation
	| ActionRemoveImportSuccess
	| ActionIncomeChange;
