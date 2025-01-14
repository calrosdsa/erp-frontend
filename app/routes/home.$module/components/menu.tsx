import React, { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { components } from "~/sdk";
import { route } from "~/util/route";
import { Link } from "@remix-run/react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/typography";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";

interface MenuItem {
  id: number;
  name: string;
  href: string;
}

interface Section {
  section_name: string;
  name: string;
  href: string;
  id: number;
  //   items: MenuItem[]
}

interface Module {
  id: number;
  href: string;
  label: string;
  icon: string;
}

interface MenuData {
  module: Module;
  sections: Section[];
}

export default function Menu({
  data,
  roleActions,
}: {
  data: components["schemas"]["ModuleDetailDto"];
  roleActions?: components["schemas"]["RoleActionDto"][];
}) {
  const r = route;
  const groupedSections = useMemo(() => {
    const entities = roleActions
      ?.filter((item) => item.action.name == "view")
      .map((item) => item.action.entity_id);
    return data.sections.reduce((acc, item) => {
      if (entities?.includes(item.id)) {
        const { section_name } = item;
        if (!acc[section_name]) {
          acc[section_name] = [];
        }
        acc[section_name].push(item);
      }
      return acc;
    }, {} as Record<string, typeof data.sections>);
  }, [data, roleActions]);

  return (
    <Card>
      <div className="bg-background text-foreground ">
        <nav className="p-6">
          {/* <h1 className="text-3xl font-bold mb-8">{menuData.module.label}</h1> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedSections)
              .sort()
              .map(([sectionName, items]) => (
                <div key={sectionName} className="space-y-4">
                  <Typography
                    variant="title2"
                    className="font-semibold text-primary"
                  >
                    {sectionName}
                  </Typography>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={r.to(item.href)}
                          className="block py-1 px-4 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </nav>
      </div>
    </Card>
  );
}
