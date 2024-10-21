import { Boxes } from "lucide-react";

export const DEFAULT_DEBOUNCE_TIME = 600;
export const DEFAULT_CURRENCY = "BOB"


export const DEFAULT_SIZE = "20";
export const DEFAULT_PAGE = "0";
export const DEFAULT_ENABLED = "true";
export const DEFAULT_ORDER = "desc"
export const DEFAULT_COLUMN = "created_at"

export const MAX_DEFAULT_SIZE = "30";

export const DEFAULT_COMPANY_NAME = "ERP";

export const CURRENCY_CODES: CurrencyCode[] = [
  { Code: "BOB" },
  { Code: "USD" },
];

export let API_URL =
  typeof process !== "undefined"
    ? process.env.API_URL || "http://localhost:9090"
    : "http://localhost:9090";

type CurrencyCode = {
  Code: string;
};

export const DEFAULT_MIN_LENGTH = 1;
export const DEFAULT_MAX_LENGTH = 50;
