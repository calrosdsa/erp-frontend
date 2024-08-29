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
    activeCompany?: components["schemas"]["Company"];
    session:SessionData;
    userData?:UserData  
}

//ONLY AVAILABLE FOR ROUTE CHILDREN OF /home/stock/items/$code
export type ItemGlobalState = {
    item:components["schemas"]["Item"]
    globalState:GlobalState
}

export type UserData = {
    FirstName:string
    LastName:string
    Email:string
    ID:number
    Uuid:string
    Image?:string
    CompanyID?:number
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


