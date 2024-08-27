import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { SalesOrderType } from "~/types/enums";
import {
  SquareSalesOrderResponse,
  SquareSubscriptionStatus,
} from "~/types/plugin/square/subscription";
import { subscriptionActionsColumns } from "../columns";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom/dialog/CustomAlertDialog";
import { useFetcher } from "@remix-run/react";
import { action } from "../../route";
import { useToast } from "@/components/ui/use-toast";

export default function SquareOrder({
  data,
  order,
}: {
  data: string;
  order: components["schemas"]["SalesOrder"];
}) {
  const { t } = useTranslation("common");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const fetcher = useFetcher<typeof action>();
  const [squareOrderSubscription, setSquareOrderSubscription] = useState<
    SquareSalesOrderResponse | undefined
  >(undefined);
  const { toast } = useToast();

  const parseData = () => {
    try {
      switch (order.OrderType) {
        case SalesOrderType.ORDER_TYPE_SERVICE: {
          let d = JSON.parse(data) as SquareSalesOrderResponse;
          setSquareOrderSubscription(d);
          break;
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (fetcher.data?.errorAction != undefined) {
      toast({
        title: fetcher.data.errorAction,
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    parseData();
  }, [data]);
  return (
    <>
      <CustomAlertDialog
        open={confirmCancel}
        loading={fetcher.state == "submitting"}
        onOpenChange={(e) => setConfirmCancel(e)}
        onContinue={() => {
          if (squareOrderSubscription == undefined) return;
          const body: components["schemas"]["RequestSubscriptionCancelBody"] = {
            subscriptionId:
              squareOrderSubscription.subscription.subscription.id,
          };
          fetcher.submit(
            {
              action: "square-cancel-subscription",
              data: JSON.stringify(body),
            },
            {
              method: "POST",
              encType: "application/json",
            }
          );
        }}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {/* <Button
          onClick={() => {
            parseData();
          }}
        >
          PARSE
        </Button> */}
        {squareOrderSubscription != undefined && (
          <>
            <div className=" col-span-full">
              {order.OrderType == SalesOrderType.ORDER_TYPE_SERVICE && (
                <Typography fontSize={title}>
                  {t("subscription.base")}
                </Typography>
              )}
            </div>
            <DisplayTextValue
              title={t("form.startDate")}
              value={
                squareOrderSubscription.subscription.subscription.start_date
              }
            />
            <DisplayTextValue
              title={t("form.status")}
              value={squareOrderSubscription.subscription.subscription.status}
            />
          </>
        )}

        <div className=" col-span-full gap-3">
          <Typography fontSize={subtitle}>
            {t("subscription.actions")}
          </Typography>
        </div>
        <div className="col-span-full">
          <DataTable
            data={
              squareOrderSubscription?.subscription.subscription.actions || []
            }
            columns={subscriptionActionsColumns()}
          />
        </div>

        
        <div className=" col-span-full flex space-x-4">
              {squareOrderSubscription?.subscription.subscription.status ==
                SquareSubscriptionStatus.ACTIVE && (
                <Button onClick={() => setConfirmCancel(true)}>
                  {t("subscription.cancel")}
                </Button>
              )}
            </div>


      </div>
    </>
  );
}
