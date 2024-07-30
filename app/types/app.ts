import { components } from "~/sdk";

export type CountrySelectItem = {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
}

export type GlobalState = {
    account: {
        user: components["schemas"]["User"];
    } | undefined;
}