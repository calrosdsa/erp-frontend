import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import DetailLayout from "@/components/layout/detail-layout";
import { route } from "~/util/route";
import { fullName } from "~/util/convertor/convertor";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { subtitle } from "@/components/typography/Typography";
import { formatMediumDate } from "~/util/format/formatDate";

export default function MovingFormDetailClient() {
  const { pianoForm, activities } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("info");
  const { t,i18n } = useTranslation("common");
  const r = route;
  const tabs = [
    {
      title: t("info"),
      href: r.toPartyDetail(
        "relocationAndMoving",
        fullName(pianoForm?.first_name, pianoForm?.last_name),
        {
          tab: "info",
        }
      ),
    },
  ];
  return (
    <DetailLayout
      partyID={pianoForm?.id}
      activities={activities}
      navItems={tabs}
    >
      <div className="info-grid">
      <DisplayTextValue
          title={t("form.pianoType")}
          value={pianoForm?.piano_type}
        />
         <DisplayTextValue
          title={t("form.rentPiano")}
          value={pianoForm?.rent_piano}
        />
         <DisplayTextValue
          title={t("form.movingDate")}
          value={formatMediumDate(pianoForm?.moving_date,i18n.language)}
        />
        <Typography className=" col-span-full" fontSize={subtitle}>
          Customer Info
        </Typography>
        <DisplayTextValue
          title={t("form.name")}
          value={fullName(pianoForm?.first_name, pianoForm?.last_name)}
        />
        <DisplayTextValue title={t("form.email")} value={pianoForm?.email} />
        <DisplayTextValue
          title={t("form.phoneNumber")}
          value={pianoForm?.phone_number}
        />
        <Typography className=" col-span-full" fontSize={subtitle}>
          Pickup info
        </Typography>
        <DisplayTextValue
          title={t("form.city")}
          value={pianoForm?.pickup_city}
        />
        <DisplayTextValue
          title={t("form.state")}
          value={pianoForm?.pickup_state}
        />
        <DisplayTextValue
          title={t("form.street")}
          value={pianoForm?.pickup_street}
        />
        <DisplayTextValue
          title={t("form.stairs")}
          value={pianoForm?.stairs_pickup}
        />
        <DisplayTextValue
          title={t("form.flights")}
          value={pianoForm?.pickup_flights}
        />
        <DisplayTextValue title={t("form.zip")} value={pianoForm?.pickup_zip} />

        <Typography className=" col-span-full" fontSize={subtitle}>
          DropOff info
        </Typography>
        <DisplayTextValue
          title={t("form.city")}
          value={pianoForm?.dropoff_city}
        />
        <DisplayTextValue
          title={t("form.state")}
          value={pianoForm?.dropoff_state}
        />
        <DisplayTextValue
          title={t("form.street")}
          value={pianoForm?.dropoff_street}
        />
        <DisplayTextValue
          title={t("form.stairs")}
          value={pianoForm?.stairs_dropoff}
        />
        <DisplayTextValue
          title={t("form.flights")}
          value={pianoForm?.dropoff_zip}
        />
        <DisplayTextValue title={t("form.zip")} value={pianoForm?.pickup_zip} />
      </div>
    </DetailLayout>
  );
}
