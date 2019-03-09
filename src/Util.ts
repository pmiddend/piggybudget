import { List, Range } from "immutable";
import { Decimal } from "decimal.js";

export function groupRows<T>(list: List<T>, groupSize: number): List<List<T>> {
	return Range(0, Math.ceil(list.size / groupSize))
		.map((idx) => list.slice(idx * groupSize, Math.min(list.size, (idx + 1) * groupSize)))
		.toList();
}

export const addColor = "#89c440";
export const removeColor = "#ff5606";

export function amountColor(d: Decimal) {
	return d.isPositive() ? addColor : removeColor;
}
