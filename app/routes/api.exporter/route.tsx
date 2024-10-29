import { ActionFunctionArgs } from "@remix-run/node";
import { endOfMonth, formatRFC3339, startOfMonth } from "date-fns";
import { z } from "zod";
import apiClient from "~/apiclient";
import { exportDataSchema } from "~/util/data/schemas/exporter/exporter-schema";
import type {
    PathsWithMethod,
  } from "openapi-typescript-helpers";
import { paths } from "~/sdk";
type ActionData = {
    exportData:z.infer<typeof exportDataSchema>
}
export const action = async ({ request }: ActionFunctionArgs) => {
    const client = apiClient({ request });
    const data = await request.json() as ActionData
    const url = new URL(request.url)
    console.log("ACTION T")
    const searchParams = url.searchParams
    console.log(searchParams.get("type"))
    try {
      console.log(data.exportData)
      const d=  data.exportData
      const response = await client.POST(d.path as PathsWithMethod<paths, "post">, {
        parseAs: "stream",
        body: {
          from_date: formatRFC3339(d.fromDate),
          to_date: formatRFC3339(d.toDate),
        },
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
      console.error('Error:', error);
      // Handle error response appropriately
      return new Response('Internal Server Error', { status: 500 });
    }
  };
