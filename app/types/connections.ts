import { PartyType } from "~/gen/common";
import { Permission } from "./permission";
import { components } from "~/sdk";

export interface ConnectionModule {
  connections: Connection[];
  title: string;
}

export interface PartyTypeConnection {
  partyType:PartyType
  permission?:Permission
  routePrefix?:string[]
}

export interface Connection {
  entity: string;
  href: string;
  count?: number;
  add?: ()=>void;
  newHref?:string
}
