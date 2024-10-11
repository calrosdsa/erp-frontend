import { useTranslation } from "react-i18next";
import { ConnectionModule } from "~/types/connections";

export const orderConnections = (): ConnectionModule[] => {
  const { t } = useTranslation("common");
  let res: ConnectionModule[] = [];

  let payment:ConnectionModule = {
    title: "Payment",
    connections: [
      {
        entity: "Payments",
        href: "",
        add: () => {},
      },
      {
        entity: "Journal Entry",
        href: "",
      },
    ],
  }

  let related: ConnectionModule = {
    title: "Related",
    connections: [
      {
        entity: "Purchase Receipt",
        href: "",
      },
      {
        entity: "Purchase Invoice",
        href: "",
      },
    ],
  };

  res.push(related);
  res.push(payment)
  return res;
};
