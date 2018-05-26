import {Decimal} from "decimal.js";
import Transaction from "./Transaction";
import { List } from "immutable";
import {
    AsyncStorage,
} from "react-native";

export interface BudgetStore {
    transactions: List<Transaction>;
}

interface InternalTransaction {
    amount: string;
    comment: string;
    date: number;
}

interface InternalBudgetStore {
    transactions: Array<InternalTransaction>;
};

function toInternalTransaction(t: Transaction): InternalTransaction {
    return {
        amount: t.amount.toString(),
        comment: t.comment,
        date: t.date,
    };
}

function fromInternalTransaction(t: InternalTransaction): Transaction {
    return {
        amount: new Decimal(t.amount),
        comment: t.comment,
        date: t.date,
    };
}

const storeItemName = "budgetstore";

function serializeStore(s: BudgetStore): string {
    return JSON.stringify({
        transactions: s.transactions.map((t) => toInternalTransaction(t)),
    });
}

export function emptyStore(): BudgetStore {
    return {
        transactions: List(),
    };
}

function saveEmptyStore(): BudgetStore {
    const result = emptyStore();
    AsyncStorage.setItem(storeItemName, serializeStore(result));
    return result;
}

export function storeInit(
    initCallback: (store: BudgetStore) => void,
    errorCallback: (reason: any) => void) {
    // Remove old store
    AsyncStorage.removeItem("state");
    return AsyncStorage.getItem(storeItemName).then(
        (item: string) => {
            if (item === null) {
                console.log("empty store, initing properly");
                AsyncStorage.setItem(storeItemName, serializeStore(emptyStore()))
                initCallback(emptyStore());
            } else {
                console.log("store: " + item);
                const internalStore = JSON.parse(item) as InternalBudgetStore;
                initCallback({
                    transactions: List(internalStore.transactions).map((t) => fromInternalTransaction(t)),
                });
            }
        },
        (e: any) => {
            AsyncStorage.setItem(storeItemName, serializeStore(emptyStore()));
        });
}

export function storeAddTransaction(s: BudgetStore, newT: Transaction): BudgetStore {
    const result = {
        transactions: s.transactions.push(newT),
    };
    console.log('original '+JSON.stringify(s));
    console.log('add result '+JSON.stringify(result));
    AsyncStorage.setItem(storeItemName, serializeStore(result));
    return result;
}

export function storeTotalBudget(s: BudgetStore): Decimal {
    return s.transactions
        .map((t) => t.amount)
        .reduce((sum: Decimal, x: Decimal) => sum.add(x), new Decimal(0));
}
