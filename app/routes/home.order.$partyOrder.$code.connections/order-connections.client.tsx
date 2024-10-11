import Typography, { subtitle } from "@/components/typography/Typography";
import { orderConnections } from "./order-connections";
import { Badge } from "@/components/ui/badge";
import IconButton from "@/components/custom-ui/icon-button";
import { PlusIcon } from "lucide-react";
import Connections from "@/components/layout/connections";

export default function OrderConnectionsClient() {
  const connections = orderConnections();
  return (
   <Connections
   connections={connections}
   />
  );
}
