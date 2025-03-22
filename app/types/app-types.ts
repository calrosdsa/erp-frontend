import { components } from "~/sdk";
import { SessionData } from "~/sessions";

export type Gender = {
  name: string;
  code: string;
};

export type CountrySelectItem = {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
};

export type GlobalState = {
  // appConfig?: components["schemas"]["AppConfigStruct"];
  user?: components["schemas"]["UserDto"];
  profile?: components["schemas"]["ProfileDto"];
  role?: components["schemas"]["RoleDto"];
  roleActions: components["schemas"]["RoleActionDto"][];
  companyDefaults?: components["schemas"]["CompanyDefaultsDto"];
  activeCompany?: components["schemas"]["CompanyDto"];
  session: SessionData;
  userData?: UserData;
};

//ONLY AVAILABLE FOR ROUTE CHILDREN OF /home/stock/items/$code
export type ItemGlobalState = {
  item: components["schemas"]["ItemDetailDto"];
  globalState: GlobalState;
};

export type OrderGlobalState = {
  order?: components["schemas"]["OrderDto"];
  globalState: GlobalState;
};

export type WarehouseGlobalState = {
  warehouse: components["schemas"]["WareHouseDto"];
  globalState: GlobalState;
};

export type CourtState = {
  globalState: GlobalState;
  court: components["schemas"]["CourtDto"];
};

export type UserData = {
  FirstName: string;
  LastName: string;
  Email: string;
  ID: number;
  Uuid: string;
  Image?: string;
  CompanyID?: number;
};

export type WsMessage = {
  type: string;
  message: string;
};

// export type GlobalState = {
//     // appConfig?: components["schemas"]["AppConfigStruct"];
//     data:{
//         readonly $schema?: string;
//         appConfig: components["schemas"]["AppConfigStruct"];
//         user: components["schemas"]["User"];
//     } | undefined;
//     session:SessionData;
// }
