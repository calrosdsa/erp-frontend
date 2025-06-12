import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { GlobalState } from "~/types/app-types";
import { loader } from "../../route";
import { SerializeFrom } from "@remix-run/node";
import { Entity } from "~/types/enums";

export default function ItemActivity({
  appContext,
  data,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
}) {
  const item = data?.item;
  return (
    <div>
      {item && (
        <div className="">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={item?.id}
            partyName={item.name}
            entityID={Entity.ITEM}
          />
        </div>
      )}
    </div>
  );
}
