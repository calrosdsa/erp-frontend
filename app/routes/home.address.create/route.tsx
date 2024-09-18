import { z } from "zod";
import AddressCreateClient from "./address-create.client";
import { createAddressSchema } from "~/util/data/schemas/address/address-schema";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import apiClient from "~/apiclient";

type ActionData = {
    createAddress:z.infer<typeof createAddressSchema>
    action:string
    redirectRoute:string
}

export const action = async({request}:ActionFunctionArgs)=>{
    const client = apiClient({request})
    const data = await request.json() as ActionData
    let message:string | undefined = undefined
    let error:string | undefined = undefined
    switch(data.action){
        case "create-address":{
            const d = data.createAddress
            const res = await client.POST("/party/address",{
                body:{
                    address:{
                        title:d.title,
                        city:d.city,
                        street_line_1:d.streetLine1,
                        street_line_2:d.streetLine2,
                        country_code:d.countryCode,
                        province:d.province,
                        phone_number:d.phoneNumber,
                        email:d.email,
                        postal_code:d.postalCode,
                        identification_number:d.identificationNumber,
                        company:d.company,
                    }
                }
            })
            console.log(res.data,res.error)
            error = res.error?.detail
            if(res.data){
                return redirect(data.redirectRoute)
            }
        }
    }
    return json({
        message,error
    })
}

export default function AddressCreate(){

    return <AddressCreateClient/>
}