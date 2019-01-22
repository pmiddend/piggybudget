import { List } from "immutable";
import Octicon from "react-native-vector-icons/Octicons";
import Entypo from "react-native-vector-icons/Entypo";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export interface Category {
	icon: string;
	iconType: string;
	iconClass: any;
	name: string;
	color: string;
}

export const categories: List<Category> = List([
	{ icon: "home", name: "RENT", iconType: "octicon", iconClass: Octicon, color: "8e9a7a" },
	{ icon: "phone", name: "PHONE", iconType: "entypo", iconClass: Entypo, color: "8e1f7a" },
	{ icon: "awareness-ribbon", name: "DONATION", iconType: "entypo", iconClass: Entypo, color: "e40000" },
	{ icon: "safety-cone", name: "INSURANCE", iconType: "foundation", iconClass: Foundation, color: "e49d00" },
	{ icon: "ios-restaurant", name: "RESTAURANT", iconType: "ionicon", iconClass: Ionicon, color: "e06500" },
	{ icon: "drink", name: "PARTY", iconType: "entypo", iconClass: Entypo, color: "0090e0" },
	{ icon: "shopping-cart", name: "SHOPPING", iconType: "entypo", iconClass: Entypo, color: "ffe600" },
	{ icon: "food", name: "FOOD", iconType: "material-community", iconClass: MaterialCommunityIcons, color: "e08f00" },
	{ icon: "tram", name: "TRAFFIC", iconType: "material-community", iconClass: MaterialCommunityIcons, color: "d4021d" },
	{ icon: "gift", name: "GIFT", iconType: "octicon", iconClass: Octicon, color: "d402d2" },
	{ icon: "ios-shirt", name: "CLOTHING", iconType: "ionicon", iconClass: Ionicon, color: "a402d4" },
	{ icon: "dots-three-horizontal", name: "OTHER", iconType: "entypo", iconClass: Entypo, color: "d1d1d1" },
	{ icon: "bell", name: "AUTOMATIC", iconType: "entypo", iconClass: Entypo, color: "aaaaaa" },
]);

export function otherCategory(): Category {
	return categories.last() as Category;
}

export function findCategory(name: string): Category | undefined {
	return categories.find((c) => c.name === name);
}
