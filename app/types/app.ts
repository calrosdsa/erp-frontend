import { components } from "~/sdk";
import { SessionData } from "~/sessions";

export type CountrySelectItem = {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
}

export type GlobalState = {
    appConfig?: components["schemas"]["AppConfigStruct"];
    user?: components["schemas"]["User"];
    session:SessionData;
}

// export type GlobalState = {
//     // appConfig?: components["schemas"]["AppConfigStruct"];
//     data:{
//         readonly $schema?: string;
//         appConfig: components["schemas"]["AppConfigStruct"];
//         user: components["schemas"]["User"];
//     } | undefined;
//     session:SessionData;
// }
