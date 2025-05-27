"use client";

import type React from "react";

import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useOutletContext } from "@remix-run/react";
import { useForm } from "react-hook-form";
import type { action } from "~/routes/home.activity/route";
import {
  ActivityData,
  type ActivityDeadlineData,
  activityDeadlineSchema,
} from "~/util/data/schemas/core/activity-schema";
import { useState, useRef, useEffect } from "react";
import { BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/custom/popover/color-picker";
import { DEFAULT_COLOR, LOADING_MESSAGE } from "~/constant";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { addDays } from "date-fns";
import { TooltipLayout } from "@/components/layout/tooltip-layout";
import { Textarea } from "@/components/ui/textarea";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { ActivityType, activityTypeToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app-types";
import { toZonedTime } from "date-fns-tz";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActivityStore } from "../activity-store";

export default function ActivityDeadlineTab({
  partyID,
  partyName,
  entityID,
  appContext,
  defaultSelected = false,
  defaultFocused = false,
  className,
  onClose,
}: {
  partyID: number;
  partyName: string;
  entityID: number;
  appContext: GlobalState;
  defaultSelected?: boolean;
  defaultFocused?: boolean;
  className?: string;
  onClose?: () => void;
}) {
  const [isSelected, setIsSelected] = useState(defaultSelected);
  const [isFocused, setIsFocused] = useState(defaultFocused);
  const expandedRef = useRef<HTMLDivElement>(null);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const { profile } = appContext;
  const handleBlur = (e: React.FocusEvent) => {
    // Check if the next focused element is within our container
    const isChildFocused = e.currentTarget.contains(e.relatedTarget as Node);
    if (!isChildFocused) {
      setIsFocused(false);
    }
  };

  const form = useForm<ActivityDeadlineData>({
    resolver: zodResolver(activityDeadlineSchema),
    defaultValues: {
      color: DEFAULT_COLOR,
      deadline: addDays(new Date(), 3),
      profile_id: profile?.id,
    },
  });
  const formValues = form.getValues();
  const fetcher = useFetcher<typeof action>();
  const [toastID, setToastID] = useState<string | number>("");
  const { addActivity } = useActivityStore();

  const onSubmit = (e: ActivityDeadlineData) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const activityData: ActivityData = {
      party_id: partyID,
      party_name: partyName,
      entity_id: entityID,
      type: activityTypeToJSON(ActivityType.ACTIVITY),
      activity_deadline: e,
    };
    // console.log("ACTIVITY DATA"activityData)
    // return
    fetcher.submit(
      {
        action: "create",
        activityData: activityData as any,
      },
      {
        action: route.toRoute({ main: route.activity }),
        encType: "application/json",
        method: "POST",
      }
    );
    form.reset();
    setIsSelected(false);
  };

  useDisplayMessage(
    {
      toastID: toastID,
      success: fetcher.data?.message,
      error: fetcher.data?.error,
      onShowMessage: () => {
        //If the activity is created from a dialog, close the dialog; otherwise, add the new activity to the list of activities.
        if (onClose) {
          onClose();
        } else {
          if (fetcher.data?.activity) {
            addActivity(fetcher.data.activity);
          }
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div
      className={cn(
        "w-full transition-all duration-500 ease-in-out",
        className
      )}
    >
      <div
        className={`transition-all duration-500 ease-in-out ${
          isSelected
            ? "opacity-100 max-h-[1000px]"
            : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
        }`}
      >
        <div ref={expandedRef}>
          <FormLayout className="w-full px-0 mt-2">
            <Form {...form}>
              {/* {JSON.stringify(form.getValues())} */}
              <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-full">
                  <Card
                    className={`relative transform transition-all duration-500 ease-in-out ${
                      isFocused ? "ring-ring ring-2" : ""
                    }`}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Input
                        placeholder="Actividad"
                        {...form.register("title")}
                        className="border-0 p-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <div className="flex items-center gap-2">
                        <ColorPicker
                          defaultColor={formValues.color}
                          onChange={(e) => {
                            form.setValue("color", e);
                          }}
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <Textarea
                        {...form.register("content")}
                        rows={1}
                        placeholder="Cosas por hacer..."
                        className="border-0 p-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CustomFormDate
                            control={form.control}
                            isDatetime={true}
                            name={"deadline"}
                          />
                          {/* <CustomFormDate
                            isDatetime={true}
                            disableXButtdon={true}
                            control={form.control}
                            name="deadline"
                          /> */}
                          {/* <TooltipLayout content="Recordar">
                            <BellIcon className="icon-button w-5 h-5" />
                          </TooltipLayout> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="pt-4 flex justify-start gap-2">
                    <Button
                      size="xs"
                      type="submit"
                      className="rounded-full px-3 h-7"
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      type="button"
                      className="rounded-full px-3 h-7"
                      onClick={() => setIsSelected(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </fetcher.Form>
            </Form>
          </FormLayout>
        </div>
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
              placeholder="Actividad"
              onFocus={() => {
                form.setFocus("content");
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
