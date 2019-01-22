import { List } from "immutable";

export interface Category {
	icon: string;
	iconType: string;
	name: string;
	color: string;
}

export const categories: List<Category> = List([
	{ icon: "home", name: "RENT", iconType: "octicon", color: "8e9a7a" },
	{ icon: "phone", name: "PHONE", iconType: "entypo", color: "8e1f7a" },
	{ icon: "awareness-ribbon", name: "DONATION", iconType: "entypo", color: "e40000" },
	{ icon: "safety-cone", name: "INSURANCE", iconType: "foundation", color: "e49d00" },
	{ icon: "ios-restaurant", name: "RESTAURANT", iconType: "ionicon", color: "e06500" },
	{ icon: "drink", name: "PARTY", iconType: "entypo", color: "0090e0" },
	{ icon: "shopping-cart", name: "SHOPPING", iconType: "entypo", color: "ffe600" },
	{ icon: "food", name: "FOOD", iconType: "material-community", color: "e08f00" },
	{ icon: "tram", name: "TRAFFIC", iconType: "material-community", color: "d4021d" },
	{ icon: "gift", name: "GIFT", iconType: "octicon", color: "d402d2" },
	{ icon: "ios-shirt", name: "CLOTHING", iconType: "ionicon", color: "a402d4" },
	{ icon: "dots-three-horizontal", name: "OTHER", iconType: "entypo", color: "d1d1d1" },
	{ icon: "bell", name: "AUTOMATIC", iconType: "entypo", color: "aaaaaa" },
]);

export function otherCategory(): Category {
	return categories.last() as Category;
}

export function findCategory(name: string): Category | undefined {
	return categories.find((c) => c.name === name);
}
