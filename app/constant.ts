import { Boxes } from "lucide-react";

export const DEFAULT_DEBOUNCE_TIME = 600;
export const DEFAULT_CURRENCY = "BOB"


export const DEFAULT_SIZE = "20";
export const MAX_SIZE = "1000";
export const DEFAULT_PAGE = "0";
export const DEFAULT_ENABLED = "true";
export const DEFAULT_ORDER = "desc"
export const DEFAULT_COLUMN = "id"


export const MAX_DEFAULT_SIZE = "30";

export const DEFAULT_COMPANY_NAME = "ERP";

//Action for loader
export const LOAD_ACTION = "load"

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

export const DEFAULT_COLOR = "#d97706";


export const CREATE = "create"
export const DELETE = "delete"
export const EDIT = "edit"

export const SUCCESS_EXPORT_MESSAGE = "Documento descargado con éxito"
export const ERROR_EXPORT_MESSAGE = "Error al descargar el documento."