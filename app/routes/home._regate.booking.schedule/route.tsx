import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import BookingScheduleClient from "./booking-schedule.client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  return json({});
};

export default function BookingSchedule() {
  return <BookingScheduleClient />;
}
