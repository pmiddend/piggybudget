import { List } from "immutable";
import Octicon from "react-native-vector-icons/Octicons";
import Entypo from "react-native-vector-icons/Entypo";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { CategoryData } from "./CategoryData";

export interface Category {
	readonly name: string;
	readonly data: CategoryData;
}

export const categories: List<Category> = List([
	{ name: "RENT", data: { icon: { name: "home", type: "material-community" }, color: "8e9a7a" } },
	{ name: "PHONE", data: { icon: { name: "phone", type: "material-community" }, color: "8e1f7a" } },
	{ name: "DONATION", data: { icon: { name: "ribbon", type: "material-community" }, color: "e40000" } },
	{ name: "INSURANCE", data: { icon: { name: "vlc", type: "material-community" }, color: "e49d00" } },
	{ name: "RESTAURANT", data: { icon: { name: "silverware-fork-knife", type: "material-community" }, color: "e06500" } },
	{ name: "PARTY", data: { icon: { name: "glass-cocktail", type: "material-community" }, color: "0090e0" } },
	{ name: "SHOPPING", data: { icon: { name: "cart", type: "material-community" }, color: "ffe600" } },
	{ name: "FOOD", data: { icon: { name: "food", type: "material-community" }, color: "e08f00" } },
	{ name: "TRAFFIC", data: { icon: { name: "tram", type: "material-community" }, color: "d4021d" } },
	{ name: "GIFT", data: { icon: { name: "gift", type: "material-community" }, color: "d402d2" } },
	{ name: "CLOTHING", data: { icon: { name: "tshirt-crew", type: "material-community" }, color: "a402d4" } },
	{ name: "OTHER", data: { icon: { name: "dots-horizontal", type: "material-community" }, color: "d1d1d1" } },
	{ name: "AUTOMATIC", data: { icon: { name: "bell", type: "material-community" }, color: "aaaaaa" } },
]);

export function iconClass(t: string): any {
	if (t === "ionicon")
		return Ionicon;
	if (t === "entypo")
		return Entypo;
	if (t === "octicon")
		return Octicon;
	if (t === "foundation")
		return Foundation;
	if (t === "material-community")
		return MaterialCommunityIcons;
	if (t === "material")
		return MaterialIcons;
	return "";
}

export function otherCategory(): Category {
	return categories.last() as Category;
}

export function findCategory(name: string): Category | undefined {
	return categories.find((c) => c.name === name);
}
