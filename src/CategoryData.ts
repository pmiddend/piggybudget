import { iconDescriptionEquals, IconDescription } from "./IconDescription";

export interface CategoryData {
	readonly icon: IconDescription;
	readonly color: string;
}

export function categoryDataEquals(a: CategoryData, b: CategoryData) {
	return a.color === b.color && iconDescriptionEquals(a.icon, b.icon);
}
