import Transaction from "./Transaction";

export default interface IndexedTransaction {
	transaction: Transaction;
	index: number;
}
