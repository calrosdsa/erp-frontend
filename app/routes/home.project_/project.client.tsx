import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import { DataTable } from "@/components/custom/table/CustomTable";
import { costCenterColumns } from "@/components/custom/table/columns/accounting/cost-center-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { NewProject, useNewProject } from "./use-new-project";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { projectColumns } from "@/components/custom/table/columns/project/project-columns";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function ProjectClient() {
  const { paginationResult, actions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const newProject = useNewProject();
  return (
    <>
      {newProject.open && (
        <NewProject
          open={newProject.open}
          onOpenChange={newProject.onOpenChange}
        />
      )}
      <ListLayout
        title="Proyecto"
        {...(permission.create && {
          onCreate: () => {
            newProject.onOpenChange(true);
          },
        })}
      >
        <DataTable
          paginationOptions={{
            rowCount: paginationResult?.total,
          }}
          data={paginationResult?.results || []}
          columns={projectColumns({})}
          enableSizeSelection={true}
        />
      </ListLayout>
    </>
  );
}
