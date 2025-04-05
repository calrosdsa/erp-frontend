import { SelectOption } from "@/components/form/smart-field";
import { DealType, dealTypeToJSON } from "~/gen/common";

export const dueDateBaseOnOptions: SelectItem[] = [
  {
    name: "Días después de la fecha de factura",
    value: "DAYS_AFTER_INVOICE_DATE",
  },
  {
    name: "Meses después de la fecha de factura",
    value: "MONTHS_AFTER_INVOICE_DATE",
  },
];

export const dealTypes: SelectOption[] = [
  {
    label: "Ventas",
    value: dealTypeToJSON(DealType.Sales),
  },
  {
    label: "Servicios",
    value: dealTypeToJSON(DealType.Services),
  },
  {
    label: "Ventas Integradas",
    value: dealTypeToJSON(DealType.IntegratedSales),
  },
  {
    label: "Ventas de Mercancías",
    value: dealTypeToJSON(DealType.MerchadiseSales),
  },
  {
    label: "Postventa",
    value: dealTypeToJSON(DealType.AfterSales),
  },
];
