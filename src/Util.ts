import { List, Range } from "immutable";
import { Decimal } from "decimal.js";
import moment from "moment";

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

export interface ClampedMonth {
	readonly month: number;
	readonly year: number;
}

export interface MonthBoundaries {
	readonly start: moment.Moment;
	readonly end: moment.Moment;
}

export function currentClampedMonth(): ClampedMonth {
	const now = moment();
	return {
		month: now.month(),
		year: now.year(),
	};
}

export function nextClampedMonth(c: ClampedMonth): ClampedMonth {
	if (c.month === 11) {
		return {
			month: 0,
			year: c.year + 1,
		};
	}
	return {
		month: c.month + 1,
		year: c.year,
	};
}

export function priorClampedMonth(c: ClampedMonth): ClampedMonth {
	if (c.month === 0) {
		return {
			month: 11,
			year: c.year - 1,
		};
	}
	return {
		month: c.month - 1,
		year: c.year,
	};
}

export function clampedMonthBoundaries(c: ClampedMonth): MonthBoundaries {
	const start = moment(c.year.toString() + "-" + (c.month + 1).toString() + "-01", "YYYY-MM-DD");
	return {
		end: start.clone().add("1", "month"),
		start,
	};
}

export function inBounds(t: moment.Moment, bounds: MonthBoundaries): boolean {
	return t.isAfter(bounds.start) && (t.isBefore(bounds.end));
}

export function isCurrent(t: ClampedMonth): boolean {
	const current = currentClampedMonth();
	return t.year === current.year && t.month === current.month;
}

export function localizeClamped(c: ClampedMonth): string {
	return clampedMonthBoundaries(c).start.format("MMMM YYYY");
}
