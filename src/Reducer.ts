import AppState from "./AppState";
import { List } from "immutable";
import { ActionAddTransaction, Action } from "./Actions";
import { Decimal } from "decimal.js";
import { TransactionList } from "./BudgetStore";
import Transaction from "./Transaction";
import moment from "moment";

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
        amount: incomeType === "daily" ? income : income.div(day.daysInMonth()),
        comment: "AUTOMATIC",
        date: day.toDate().getTime(),
    };
}

export default (state: AppState | undefined, action: Action) => {
    if (state === undefined) {
        const initialSettings = {
            income: new Decimal(0),
            incomeType: "daily",
        };
        return {
            firstStart: Date.now(),
            settings: initialSettings,
            transactions: List(),
        };
    }
    switch (action.type) {
        case "ADD_TRANSACTION":
            return {
                ...state,
                transactions: state.transactions.push(action.t),
            };
        case "CLEAR":
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

            console.log("Missing days: " + missingDays);

            const missingTransactions = missingDays.map(
                (d) => createDailyTransaction(
                    d,
                    state.settings.incomeType,
                    income));

            return {
                ...state,
                transactions: state.transactions.concat(missingTransactions),
            };
        case "INCOME_CHANGE":
            return {
                ...state,
                settings: {
                    ...state.settings,
                    income: action.newIncome.toString()
                }
            };
        case "INCOME_TYPE_CHANGE":
            return {
                ...state,
                settings: {
                    ...state.settings,
                    incomeType: action.newIncomeType
                }
            };
    }
    return state;
};

