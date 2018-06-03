import {List} from "immutable";

export interface Category {
    icon: string;
    iconType: string;
    name: string;
}

export const categories: List<Category> = List([
    {icon: "food", name: "FOOD", iconType: "material-community"},
    {icon: "tram", name: "TRAFFIC", iconType: "material-community"},
    {icon: "gift", name: "GIFT", iconType: "octicon"},
    {icon: "ios-shirt", name: "CLOTHING", iconType: "ionicon"},
    {icon: "bell", name: "AUTOMATIC", iconType: "entypo"},
]);

export function otherCategory(): Category {
    return categories.last() as Category;
}

export function findCategory(name: string): Category | undefined {
    return categories.find((c) => c.name === name);
}
