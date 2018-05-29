import {Decimal} from "decimal.js";

export default interface Transaction {
    amount: Decimal;
    comment: string;
    date: number;
}
