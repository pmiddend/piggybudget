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
    {icon: "dots-three-horizontal", name: "OTHER", iconType: "entypo"},
]);
