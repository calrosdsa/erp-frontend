import {
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { loader } from "./route";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { useEffect, useState } from "react";
import DetailLayout from "@/components/layout/detail-layout";
import { NavItem } from "~/types";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { CourtState, GlobalState } from "~/types/app-types";
import CourtInfoTab from "./tabs/court-info";
import CourtSchedule from "./tabs/court-schedule";
import { ButtonToolbar } from "~/types/actions";
import { UpdateCourtRate, useUpdateCourtRate } from "./use-update-court-rate";
import {
  setUpToolbar,
  setUpToolbarDetailPage,
  setUpToolbarRegister,
} from "~/util/hooks/ui/useSetUpToolbar";
import { ActivityType } from "~/gen/common";
import ModalLayout from "@/components/ui/custom/modal-layout";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";

export default function CourtModal({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const fetcherLoader = useFetcher<typeof loader>();
  const data = fetcherLoader.data;
  const court = data?.court;
  const params = useParams();
  const { t } = useTranslation("common");
  const r = route;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const updateCourtRate = useUpdateCourtRate();
  const { setToolbar } = useToolbar();
  const [open, setOpen] = useState(true);
  const courtID = searchParams.get(route.court);

  const initData = (tab: string) => {
    fetcherLoader.load(
      route.toRoute({
        main: route.court,
        routeSufix: [courtID || ""],
        q: {
          tab: tab,
        },
      })
    );
  };

  useEffect(() => {
    initData(tab);
  }, [tab]);

  setUpToolbarRegister(() => {
    const actions: ButtonToolbar[] = [];
    actions.push({
      label: "Editar precio por hora",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Editar precio por hora",
          action: ActivityType.EDIT,
        });
      },
    });
    actions.push({
      label: "Agregar precio hora",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Agregar precio por hora",
          action: ActivityType.CREATE,
        });
      },
    });

    actions.push({
      label: "Eliminar horas",
      onClick: () => {
        updateCourtRate.onOpenDialog({
          court: court,
          title: "Eliminar horas",
          action: ActivityType.DELETE,
        });
      },
    });
    return {
      actions: actions,
    };
  }, [fetcherLoader.data]);

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.court);
      searchParams.delete("tab");
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);
  return (
    <ModalLayout
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      title={court?.name || ""}
    >
      {fetcherLoader.state == "loading" && !fetcherLoader.data ? (
        <LoadingSpinner />
      ) : (
        <>
          <TabNavigation
            defaultValue={tab}
            onValueChange={(value) => {
              searchParams.set("tab", value);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }}
            items={[
              {
                label: "Info",
                value: "info",
                children: (
                  <CourtInfoTab appContext={appContext} data={data} />
                ),
              },
              {
                label: "Horario",
                value: "schedule",
                children: <CourtSchedule />,
              },
            ]}
          />
        </>
      )}
      {updateCourtRate.open && <UpdateCourtRate />}
    </ModalLayout>
    // <ModalLayout

    //   partyID={court?.id}
    // >

    //   {tab == "info" && <CourtInfoTab />}
    //   {tab == "schedule" && <CourtSchedule />}
    // </DetailLayout>
  );
}
