import { ConnectionModule } from "~/types/connections";
import Typography, { subtitle } from "../typography/Typography";
import { Badge } from "../ui/badge";
import IconButton from "../custom-ui/icon-button";
import { PlusIcon } from "lucide-react";
import { Link } from "@remix-run/react";

export default function Connections({
  connections,
}: {
  connections: ConnectionModule[];
}) {
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {connections.map((item, idx) => {
        return (
          <div key={idx}>
            <Typography fontSize={subtitle}>{item.title}</Typography>

            <div className=" flex flex-col space-y-2 py-2 px-0">
              {item.connections.map((t, idx) => {
                return (
                  <div key={idx} className="flex space-x-2">
                    <Badge variant={"outline"} className="flex space-x-2 h-9">
                      {t.count && (
                        <Badge
                          variant={"outline"}
                          className=" rounded-full h-7 w-7"
                        >
                          {t.count}
                        </Badge>
                      )}
                      <Link to={t.href} className="link">
                        {t.entity}
                      </Link>
                    </Badge>
                    {t.newHref && (
                      <Link to={t.newHref}>
                      <IconButton
                        icon={PlusIcon}
                        size="md"
                        />
                        </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
