import { FormEvent, useRef, useState } from "react";
import MentionTextarea from "../components/activity-comment";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  ActivityData,
  MentionData,
} from "~/util/data/schemas/core/activity-schema";
import { Button } from "@/components/ui/button";
import { useFetcher } from "@remix-run/react";
import type { action } from "~/routes/home.activity/route";
import { ActivityType, activityTypeToJSON } from "~/gen/common";
import { route } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function CommentActivityTab({ partyID }: { partyID: number }) {
  const [isSelected, setIsSelected] = useState(false);
  const expandedRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [mentions, setMentions] = useState<MentionData[]>([]);
  const fetcher = useFetcher<typeof action>();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: ActivityData = {
      type: activityTypeToJSON(ActivityType.COMMENT),
      party_id: partyID,
      activity_comment: {
        comment: value,
        mentions: mentions,
      },
      entity_id: 0,
      party_name: ""
    };
    fetcher.submit(
      {
        action: "create",
        activityData: body as any,
      },
      {
        action: route.toRoute({ main: route.activity }),
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useDisplayMessage(
    {
      success: fetcher.data?.message,
      error: fetcher.data?.error,
    },
    [fetcher.data]
  );

  return (
    <div className="w-full transition-all duration-500 ease-in-out">
      <div
        className={`transition-all duration-500 ease-in-out ${
          isSelected
            ? "opacity-100 max-h-[1000px]"
            : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        }`}
      >
        {isSelected && (
          <>
            <fetcher.Form onSubmit={onSubmit}>
              <MentionTextarea
                mentions={mentions}
                setMentions={setMentions}
                value={value}
                setValue={setValue}
              />
              <div className="pt-4 flex justify-start gap-2">
                <Button
                  type="submit"
                  size="xs"
                  className="rounded-full px-3 h-7"
                >
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="rounded-full px-3 h-7"
                  onClick={() => setIsSelected(false)}
                >
                  Cancelar
                </Button>
              </div>
            </fetcher.Form>
          </>
        )}
      </div>

      <div
        className={`transition-all duration-500 ease-in-out ${
          isSelected
            ? "opacity-0 max-h-0 overflow-hidden"
            : "opacity-100 max-h-[1000px]"
        }`}
      >
        <Card className="w-full transform transition-all duration-500 ease-in-out">
          <CardContent className="p-3">
            <Input
              placeholder="Comentario"
              onFocus={() => {
                setIsSelected(true);
              }}
              className="border-0 p-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
