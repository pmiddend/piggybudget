import Transaction from "./Transaction";
import { AppStateStatus } from "react-native";
import { Decimal } from "decimal.js";

export interface ActionAddTransaction {
    readonly type: "ADD_TRANSACTION";
    readonly t: Transaction;
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

export function actionIncomeTypeChange(newIncomeType: string): ActionIncomeTypeChange {
    return {
        newIncomeType,
        type: "INCOME_TYPE_CHANGE",
    };
}

export type Action = ActionAddTransaction
    | ActionStateChange
    | ActionClear
    | ActionIncomeTypeChange
    | ActionCurrencyChange
    | ActionIncomeChange;
