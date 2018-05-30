import AppState from "./AppState";
import { List } from "immutable";
import { ActionAddTransaction, Action } from "./Actions";
import { Decimal } from "decimal.js";

export default (state: AppState | undefined, action: Action) => {
    if (state === undefined) {
        const initialSettings = {
            incomeType: 'daily',
            income: new Decimal(0),
        };
        return { transactions: List(), settings: initialSettings, };
    }
    switch (action.type) {
        case "ADD_TRANSACTION":
            return {
                ...state,
                transactions: state.transactions.push(action.t),
            };
        case "STATE_CHANGE":
            return state;
        case "INCOME_CHANGE":
            return {
                ...state,
                settings: {
                    ...state.settings,
                    income: action.newIncome
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
        default:
            console.log("Unknown action: " + action.type);
            break;
    }
    return state;
};

