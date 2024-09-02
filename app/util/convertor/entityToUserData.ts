import { components } from "index";
import { UserData } from "~/types/app";


    
export const clientToUserData = (client?:components["schemas"]["Client"]):UserData | undefined => {
    if(client == undefined) return undefined            
    return {
        ID:client.ID,
        Uuid:client.Uuid,
        FirstName:client.GivenName,
        LastName:client.FamilyName,
        Email:client.EmailAddress,
        CompanyID:client.CompanyID,
    }
}

export const administratorToUserData = (administrator?:components["schemas"]["Administrator"]):UserData | undefined =>{
    if(administrator == undefined) return undefined
    return {
        ID:administrator.ID,
        Uuid:administrator.Uuid,
        FirstName:administrator.FirstName,
        LastName:administrator.LastName,
        Email:administrator.EmailAddress,
    }
}