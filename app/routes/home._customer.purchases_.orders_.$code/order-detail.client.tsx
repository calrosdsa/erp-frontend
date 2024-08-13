import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { action, loader } from "./route";
import DetailOrder from "./components/DetailOrder";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function OrderDetailClient() {
  const { data } = useLoaderData<typeof loader>();
 

  return (
    <div>
      {data != undefined && (
        <DetailOrder
          order={data.result.Body.order}
          lines={data.result.Body.lines}
        />
      )}
    </div>
  );
}
