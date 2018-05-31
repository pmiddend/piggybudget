import {List} from "immutable";

export interface Category {
    icon: string;
    name: string;
}

export const categories: List<Category> = List([
    {icon: "food", name: "FOOD"},
    {icon: "tram", name: "TRAFFIC"},
    {icon: "gift", name: "GIFT"},
    {icon: "dots-three-horizontal", name: "OTHER"},
    {icon: "ios-shirt", name: ""},
]);
