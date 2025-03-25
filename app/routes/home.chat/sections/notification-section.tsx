import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { BellIcon } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_SIZE } from "~/constant";
import { action } from "~/routes/home.chat/route";
import { components, operations } from "~/sdk";
import { fullName } from "~/util/convertor/convertor";
import { formatLongDate } from "~/util/format/formatDate";
import { route } from "~/util/route";

export default function NotificationSection() {
  const fetcher = useFetcher<typeof action>();
  const { i18n } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchData = () => {
    const query: operations["notification"]["parameters"]["query"] = {
      size: "100",
    };
    fetcher.submit(
      {
        action: "notification",
        notificationQuery: query,
      },
      {
        method: "POST",
        action: route.toRoute({ main: route.chat }),
        encType: "application/json",
      }
    );
  };

  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    console.log("REDER NOTIFICATION SECTION...");
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className=" border-b p-2 w-full flex space-x-4 items-center">
        <div className=" p-2 rounded-full border border-sky-500">
          <BellIcon className="w-8 h-8 text-sky-500" />
        </div>
        <span className=" text-lg">Notificaciones</span>
      </div>
      <div className=" overflow-auto">
        {fetcher.state == "submitting" && <LoadingSpinner className="mt-2" />}
        {fetcher.data?.notifications.map((item) => {
          return (
            <div key={item.id} className=" flex  space-x-2 p-2 xl:p-4 w-full">
              <Avatar className="w-12 h-12">
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback>
                  {item.profile_gn[0]}
                  {item.profile_fn[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="flex justify-between">
                  <span className=" font-semibold">
                    {fullName(item.profile_gn, item.profile_fn)}
                  </span>
                  <span className=" text-xs">
                    {formatLongDate(item.send_at, i18n.language)}
                  </span>
                </div>
                <RenderMentionText
                  openModal={openModal}
                  mentionText={item.payload}
                  mentions={item.mentions || []}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RenderMentionText = ({
  mentionText,
  mentions,
  openModal,
}: {
  mentionText: string;
  mentions: components["schemas"]["MentionDto"][];
  openModal: (key: string, value: string) => void;
}) => {
  // Sort mentions by start_index to process them in order
  const sortedMentions = [...mentions].sort(
    (a, b) => a.start_index - b.start_index
  );

  // Create an array of text segments and mentions
  const segments: JSX.Element[] = [];
  let lastIndex = 0;

  sortedMentions.forEach((mention, index) => {
    // Add text before the mention
    if (mention.start_index > lastIndex) {
      segments.push(
        <Fragment key={`text-${index}`}>
          {mentionText.substring(lastIndex, mention.start_index)}
        </Fragment>
      );
    }

    // Add the mention as a link
    segments.push(
      <span
        key={`mention-${mention.entity_id}`}
        onClick={() => {
          openModal(mention.entity_href, mention.party_id);
        }}
        className="text-blue-700 rounded px-1 cursor-pointer"
      >
        {mention.party_name}
      </span>
    );

    lastIndex = mention.end_index + 1;
  });

  // Add any remaining text after the last mention
  if (lastIndex < mentionText.length) {
    segments.push(
      <Fragment key="text-end">{mentionText.substring(lastIndex)}</Fragment>
    );
  }

  return <div className="text-sm">{segments}</div>;
};
