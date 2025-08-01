import { useFetcher } from "@remix-run/react";
import { useEffect, useMemo } from "react";
import { action } from "~/routes/api.core/route";
import { components, operations } from "~/sdk";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";
import { Typography } from "../typography";
import { Badge } from "../ui/badge";
export default function ConnectionsEntity({ entity }: { entity: Entity }) {
  const fetcher = useFetcher<typeof action>();
  const initData = async () => {
    const connectionParameters: operations["connections"]["parameters"] = {
      path: {
        id: entity.toString(),
      },
    };
    fetcher.submit(
      {
        action: "connections",
        connectionParameters: connectionParameters as any,
      },
      {
        action: route.apiCore,
        method: "POST",
        encType: "application/json",
      }
    );
  };

  const groupBySectionName = useMemo(() => {
    return fetcher.data?.connections.reduce<
      Record<string, components["schemas"]["ConnectionDto"][]>
    >((acc, item) => {
      const key = item.section_name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }, [fetcher.data]);

  useEffect(() => {
    initData();
  }, []);
  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-y-3">

        <Typography variant="subtitle1" className="col-span-full">Conexiones</Typography>

        {groupBySectionName &&
          Object.entries(groupBySectionName).map(([sectionName, items]) => (
            <div key={sectionName}>
              <Typography variant="subtitle2">{sectionName}</Typography>
              <div className="grid gap-y-2">
                {items.map((t) => {
                  return (
                    <div key={t.id}>
                      <Badge variant={"outline"} className=" text-sm">
                        {t.entity_name}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
