import Transaction from "./Transaction";
import { List } from "immutable";

export default interface AppState {
    readonly transactions: List<Transaction>;
};
