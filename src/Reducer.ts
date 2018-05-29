import AppState from "./AppState";
import { List } from "immutable";

export default (state: AppState | undefined, action: any) => {
    if (state === undefined) {
        console.log("reducer, state undefined");
        return { transactions: List() };
    }
    console.log("reducer called: " + JSON.stringify(state.transactions));
    return state;
};

