import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "../../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { formatCurrency } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { CalendarDays, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";
import { GlobalState } from "~/types/app-types";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import { DisplayValue } from "@/components/ui/custom/display-info";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BookingInfo = ({ appContext }: { appContext: GlobalState }) => {
  const fetcherLoader = useFetcher<typeof loader>({ key: "booking" });
  const data = fetcherLoader.data;
  const booking = fetcherLoader.data?.booking;
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();

  const r = route;
  return (
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm">Detalles de la Reserva</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <DisplayValue
              label={t("_customer.base")}
              value={booking?.party_name}
            />

            <DisplayValue
              label={t("regate._court.base")}
              value={booking?.court_name}
            />

            <DisplayValue label={"Evento"} value={booking?.evento_name} />

            <DisplayValue
              label={"Precio de la Reserva"}
              value={formatCurrency(
                booking?.total_price,
                DEFAULT_CURRENCY,
                i18n.language
              )}
            />

            <DisplayValue
              label={"Monto Pagado"}
              value={formatCurrency(
                booking?.paid,
                DEFAULT_CURRENCY,
                i18n.language
              )}
            />

            <DisplayValue
              label={"Saldo"}
              value={formatCurrency(
                (booking?.total_price || 0) -
                  (booking?.discount || 0) -
                  (booking?.paid || 0),
                DEFAULT_CURRENCY,
                i18n.language
              )}
            />

            <DisplayValue
              label={"Descuento"}
              value={formatCurrency(
                booking?.discount,
                DEFAULT_CURRENCY,
                i18n.language
              )}
            />

            <DisplayValue
              label={"Fecha de la Reserva"}
              value={formatMediumDate(booking?.start_date, i18n.language)}
            />

            <DisplayValue
              label={"Fecha de la Reserva"}
              value={`${format(parseISO(booking?.start_date || ""), "p")} - ${format(parseISO(booking?.end_date || ""), "p")}`}
            />
           
          </CardContent>
        </Card>

  
      </div>

      {booking?.id && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={booking?.id}
            partyName={booking?.code}
            entityID={Entity.BOOKING}
          />
        </div>
      )}
    </div>
  );
};
