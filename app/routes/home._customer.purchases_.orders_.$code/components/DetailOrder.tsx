import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { DataTable } from "@/components/custom/table/CustomTable";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { formatLongDate } from "~/util/format/formatDate";
import { itemLineColumns } from "./columns";
import {
  formatCurrency,
  formatTax,
  formatTotalTax,
} from "~/util/format/formatCurrency";
import SquareOrder from "./plugin/SquareOrder";
import { PluginApp } from "~/types/enums";

export default function DetailOrder({
  order,
  lines,
}: {
  order: components["schemas"]["SalesOrder"];
  lines: components["schemas"]["SalesItemLine"][];
}) {
  const { t, i18n } = useTranslation();

  const getTotalRate = () => {
    return lines
      .map((item) => item.Rate)
      .reduce((prev, curr) => prev + curr, 0);
  };
  const getTotalTax = () => {
    return lines
      .map((item) => formatTotalTax(item.ItemPrice.Tax, item.Rate))
      .reduce((prev, curr) => prev + curr, 0);
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("orderInfo")}</Typography>
        </div>

        <DisplayTextValue
          title={t("form.companyName")}
          value={order.Company.Name}
        />

        <DisplayTextValue
          title={t("table.deliverdDate")}
          value={formatLongDate(order.DeliveryDate, i18n.language)}
        />
        <DisplayTextValue
          title={t("table.createdAt")}
          value={formatLongDate(order.CreatedAt, i18n.language)}
        />

        <div className=" col-span-full">
          <Typography fontSize={title}>{t("items")}</Typography>
        </div>

        <div className=" col-span-full">
          <DataTable columns={itemLineColumns()} data={lines} />
        </div>

        <DisplayTextValue
          title={t("form.totalQuantity")}
          value={lines
            .map((item) => item.ItemQuantity)
            .reduce((prev, curr) => prev + curr, 0)
            .toString()}
        />

        {lines.length > 0 && (
          <DisplayTextValue
            title={t("form.totalTax")}
            value={formatCurrency(
              getTotalTax(),
              lines[0]?.Currency || "",
              i18n.language
            )}
          />
        )}
        {lines.length > 0 && (
          <DisplayTextValue
            title={t("form.total")}
            value={formatCurrency(
              getTotalRate(),
              lines[0]?.Currency || "",
              i18n.language
            )}
          />
        )}
      </div>

      <div className="mt-5">
        {order.SalesOrderPlugin.map((item, idx) => {
          return (
            <div key={idx}>
              {item.Plugin == PluginApp.SQUARE && (
                <SquareOrder data={item.Data} order={order} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
