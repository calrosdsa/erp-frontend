import { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { LOAD_ACTION } from "~/constant";

export default function revalidate({
  actionResult,
  defaultShouldRevalidate,
  formMethod,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.action == LOAD_ACTION) {
    return defaultShouldRevalidate;
  }
  if (formMethod === "POST") {
    return false;
  }
  return defaultShouldRevalidate;
}
