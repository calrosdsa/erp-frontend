import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatTax } from "~/util/format/formatCurrency";

export default function FormCuatropfDetail() {
  const { data } = useLoaderData<typeof loader>();
  const { t,i18n } = useTranslation("common");
  const planVariation =
    data.plan_variation.object.subscription_plan_variation_data;

  const squareObject =
    data.square_object;

  
  return (
    <div className="h-full">
      <div className="space-y-8 max-w-xl mx-auto pt-20 px-4">
        <Typography fontSize={title}>{t("form.orderConfirmation")}</Typography>
        {planVariation.phases.length > 0 && (
          <Card className="p-2 bg-card">
            <CardHeader>
              <CardTitle>
                <Typography
                  className=" text-card-foreground"
                  fontSize={subtitle}
                >
                  {planVariation.name}
                </Typography>
              </CardTitle>
            </CardHeader>

            <CardContent className=" grid gap-y-2">
              <div className="flex space-x-2 justify-between">
                <Typography
                  className=" text-card-foreground"
                  fontSize={subtitle}
                >
                  {t("form.total")}
                </Typography>
                <Typography fontSize={subtitle}>
                  {planVariation.phases[0]?.pricing.price.currency}{" "}
                  {formatCurrency(squareObject.ItemPrice.Rate,squareObject.ItemPrice.ItemPriceList.Currency,i18n.language)}
                </Typography>
              </div>

              <div className="flex space-x-2 justify-between">
                <Typography
                  className=" text-card-foreground"
                  fontSize={subtitle}
                >
                  {t("form.totalTax")}
                </Typography>
                <Typography fontSize={subtitle}>
                  {planVariation.phases[0]?.pricing.price.currency} {formatTax(squareObject.ItemPrice.Tax,squareObject.ItemPrice.Rate,squareObject.ItemPrice.ItemPriceList.Currency,i18n.language)}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}
        <Separator />

        {planVariation.phases.length > 0 && (
          <div className="flex space-x-2 justify-between">
            <div>
              <Typography fontSize={subtitle}>
                {t("form.orderTotal")}
              </Typography>
            </div>

            <div>
              <Typography fontSize={subtitle}>
                {planVariation.phases[0]?.pricing.price.currency}{" "}
                {formatCurrency(planVariation.phases[0]?.pricing.price.amount,
                  planVariation.phases[0]?.pricing.price.currency || squareObject.ItemPrice.ItemPriceList.Currency,i18n.language)}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
