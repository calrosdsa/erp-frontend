import { ActionFunctionArgs } from "@remix-run/node";
import { PathsWithMethod } from "openapi-typescript-helpers";
import apiClient from "~/apiclient";
import { components, paths } from "~/sdk";


type ActionData = {
    path:string
    data:components["schemas"]["ExportDataRequestBody"]
}

export const action = async({request}:ActionFunctionArgs) =>{
    const client = apiClient({request})
        const d = await request.json() as ActionData
        const url = new URL(request.url)
        console.log("ACTION T",d)
        const searchParams = url.searchParams
        console.log(searchParams.get("type"))
        try {
          const response = await client.POST(d.path as PathsWithMethod<paths, "post">, {
            parseAs: "stream",
            body: d.data,
          });
      
          // Check for errors in the response
          if (response.error) {
            console.error('API error:', response.error);
            throw new Error('Error in response from API');
          }
      
          // Check if the response is ok
          if (!response.response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const reader = response.response.body?.getReader();
          const chunks: Uint8Array[] = [];
      
          const readStream = async () => {
            while (true) {
              const { done, value } = await reader!.read();
              if (done) {
                break; // Stream is finished
              }
              chunks.push(value); // Collect chunks
            }
      
            // Create a Blob from the collected chunks
            const blob = new Blob(chunks);
            
            return blob; // Return the Blob directly
          };
      
          const blob = await readStream(); // Await the result of the readStream function
          return new Response(blob, { status: 200 }); // Return the Blob as a Response
      
        } catch (error) {
          // Handle error response appropriately
          return new Response('Internal Server Error', { status: 500 });
        }
}