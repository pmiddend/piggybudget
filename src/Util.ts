import { List, Range } from "immutable";

export function groupRows<T>(list: List<T>, groupSize: number): List<List<T>> {
	return Range(0, Math.ceil(list.size / groupSize))
		.map((idx) => list.slice(idx * groupSize, Math.min(list.size, (idx + 1) * groupSize)))
		.toList();
}
