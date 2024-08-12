import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import DetailOrder from "./components/DetailOrder";

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
