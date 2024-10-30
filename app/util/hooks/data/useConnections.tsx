import { useMemo } from "react";
import { partyTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import {
  Connection,
  ConnectionModule,
  PartyTypeConnection,
} from "~/types/connections";
import { routes } from "~/util/route";

interface UseConnectionsProps {
  moduleName?: string;
  data: components["schemas"]["PartyConnections"][];
  references: PartyTypeConnection[];
  querySearch?: Record<string, string | undefined>;
}

export const useConnections = ({
  moduleName = "Relateds",
  data,
  references,
  querySearch,
}: UseConnectionsProps): ConnectionModule => {
  const r = routes;

  const connections = useMemo(() => {
    return references.reduce((acc, t) => {
      const party = partyTypeToJSON(t.partyType);
      const d = data.find((item) => item.party_type === party);
      if(moduleName) {
        t.routePrefix = [moduleName]
      }
      if (t.permission?.view) {
        const connection: Connection = {
          entity: party,
          href: r.toRoute({
            main: party,
            routePrefix: t.routePrefix,
            q: querySearch,
          }),
          count: d?.connections,
        };

        if (t.permission?.create) {
          connection.newHref = r.toRoute({
            main: party,
            routePrefix: t.routePrefix,
            routeSufix: [`new`],
            q: querySearch,
          });
        }

        acc.push(connection);
      }

      return acc;
    }, [] as Connection[]);
  }, [references]);

  return {
    title: moduleName,
    connections,
  };
};