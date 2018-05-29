import Transaction from "./Transaction";

export interface ActionAddTransaction {
    readonly type: "ADD_TRANSACTION";
    readonly t: Transaction;
}

export function actionAddTransaction(t: Transaction): ActionAddTransaction {
    return {
        t,
        type: "ADD_TRANSACTION",
    };
}

export type Action = ActionAddTransaction;
