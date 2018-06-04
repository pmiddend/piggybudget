import {List} from "immutable";

export interface Category {
    icon: string;
    iconType: string;
    name: string;
}

export const categories: List<Category> = List([
    {icon: "home", name: "RENT", iconType: "octicon"},
    {icon: "phone", name: "PHONE", iconType: "entypo"},
    {icon: "awareness-ribbon", name: "DONATION", iconType: "entypo"},
    {icon: "safety-cone", name: "INSURANCE", iconType: "foundation"},
    {icon: "ios-restaurant", name: "RESTAURANT", iconType: "ionicon"},
    {icon: "drink", name: "PARTY", iconType: "entypo"},
    {icon: "shopping-cart", name: "SHOPPING", iconType: "entypo"},
    {icon: "food", name: "FOOD", iconType: "material-community"},
    {icon: "tram", name: "TRAFFIC", iconType: "material-community"},
    {icon: "gift", name: "GIFT", iconType: "octicon"},
    {icon: "ios-shirt", name: "CLOTHING", iconType: "ionicon"},
    {icon: "dots-three-horizontal", name: "OTHER", iconType: "entypo"},
    {icon: "bell", name: "AUTOMATIC", iconType: "entypo"},
]);

export function otherCategory(): Category {
    return categories.last() as Category;
}

export function findCategory(name: string): Category | undefined {
    return categories.find((c) => c.name === name);
}
