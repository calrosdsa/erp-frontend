import { components } from "~/sdk";

export const handleError = (
  error?: components["schemas"]["ErrorModel"]
) => {
    if(error){
        console.log(error)
        throw new Response(error.detail,{
            status:error.status,
        })
    }
};
