import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { phaseColumns } from "@/components/custom/table/columns/plugin/square/phasesColumns";
import { DataTable } from "@/components/custom/table/CustomTable";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SquareCatalogObject } from "~/types/plugin/square/catalog";
import { formatLongDate } from "~/util/format/formatDate";

export default function SquareItemPrice({ data }: { data: string }) {
  const { t, i18n } = useTranslation();
  const [squareObject, setSquareObject] = useState<
    SquareCatalogObject | undefined
  >(undefined);
  const parse = () => {
    const d = JSON.parse(data) as SquareCatalogObject;
    setSquareObject(d);
  };
  useEffect(() => {
    parse();
  }, [data]);
  return (
    <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}> Square Catalog Object</Typography>
        </div>
        {squareObject != undefined && (
          <>
            <DisplayTextValue
              title={t("_object.objectId")}
              value={squareObject.object.id}
            />
            <DisplayTextValue
              title={t("_object.objectType")}
              value={squareObject.object.type}
            />
            <DisplayTextValue
              title={t("table.updatedAt")}
              value={formatLongDate(
                squareObject.object.updated_at,
                i18n.language
              )}
            />
            <DisplayTextValue
              title={t("table.createdAt")}
              value={formatLongDate(
                squareObject.object.created_at,
                i18n.language
              )}
            />
            <DisplayTextValue
              title={t("_object.presentAtAllLocations")}
              value={squareObject.object.present_at_all_locations.toString()}
            />
            {squareObject.object.subscription_plan_variation_data && (
              <>
                <DisplayTextValue
                  title={t("form.name")}
                  value={
                    squareObject.object.subscription_plan_variation_data.name
                  }
                />
                <DisplayTextValue
                  title={t("_object.subscriptionPlanVariation")}
                  value={
                    squareObject.object.subscription_plan_variation_data
                      .subscription_plan_id
                  }
                />
              </>
            )}
          </>
        )}

        <div className="col-span-full">
          <div className="py-2">
            <Typography fontSize={subtitle}>{t("_object.phases")}</Typography>
          </div>
          <DataTable
            columns={phaseColumns()}
            data={
              squareObject?.object.subscription_plan_variation_data?.phases ||
              []
            }
          />
        </div>
      </div>
    </div>
  );
}
