import Transaction from "./Transaction";
import { AppStateStatus } from "react-native";

export interface ActionAddTransaction {
    readonly type: "ADD_TRANSACTION";
    readonly t: Transaction;
}

export interface ActionStateChange {
    readonly type: "STATE_CHANGE";
    readonly newState: AppStateStatus;
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

export type Action = ActionAddTransaction
                   | ActionStateChange;
