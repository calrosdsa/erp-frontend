import React, { useEffect, useState } from "react";
import { format, formatDistance, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, Paperclip } from "lucide-react";
import { components } from "~/sdk";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCommentSchema,
  editCommentSchema,
} from "~/util/data/schemas/core/activity-schema";
import { z } from "zod";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/api.core/route";
import FormLayout from "../custom/form/FormLayout";
import CustomFormField from "../custom/form/CustomFormField";
import { Form } from "../ui/form";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { DrawerLayout } from "../layout/drawer/DrawerLayout";
import { Textarea } from "../ui/textarea";
import CustomerPurchases from "~/routes/home._customer.purchases/route";
import CustomForm from "../custom/form/CustomForm";
import { useToast } from "../ui/use-toast";
import { ActivityType, activityTypeToJSON } from "~/gen/common";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

interface ActivityFeedProps {
  activities: components["schemas"]["ActivityDto"][] | undefined;
  partyID: number;
}

export default function ActivityFeed({
  activities = [],
  partyID,
}: ActivityFeedProps) {
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const { toast } = useToast();
  const fetcher = useFetcher<typeof action>();
  const [activity, setActivity] = useState<
    components["schemas"]["ActivityDto"] | null
  >(null);
  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      partyID: partyID,
    },
  });

  const onSubmit = (values: z.infer<typeof createCommentSchema>) => {
    fetcher.submit(
      {
        action: "create-comment",
        createComment: values,
      },
      {
        encType: "application/json",
        method: "POST",
        action: r.apiCore,
      }
    );
  };

  
  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
  },[fetcher.data])
  return (
    <>
      {activity && (
        <EditCommentDrawer
          open={true}
          onOpenChange={(e) => {
            if (!e) {
              setActivity(null);
            }
          }}
          activity={activity}
        />
      )}
      <FormLayout className="px-0">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <div className="">
              <Form {...form}>
                <fetcher.Form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center space-x-2 mt-2"
                >
                  {/* {JSON.stringify(form.formState.errors)} */}
                  <CustomFormField
                    name="comment"
                    label=""
                    className="w-full"
                    form={form}
                    children={(field) => {
                      return (
                        <Input
                          {...field}
                          placeholder="Type a reply / comment"
                        />
                      );
                    }}
                  />

                  <Button type="submit">Send</Button>
                </fetcher.Form>
              </Form>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Activity</h2>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                >
                  {activityTypeToJSON(ActivityType.COMMENT) == activity.type ?
                  <div  className="flex space-x-4 border p-2 rounded-md">

                  <Avatar>
                    <AvatarImage src={activity.profile_avatar || undefined} />
                    <AvatarFallback>
                      {activity.profile_given_name[0]}
                      {activity.profile_family_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-sm">
                          {activity.profile_given_name}{" "}
                          {activity.profile_family_name}
                        </span>
                        {/* <span className="text-muted-foreground">
                          {" "}
                          {activity.action} 
                        </span> */}
                        <span className="text-muted-foreground text-xs">
                          {" "}
                          · {format(parseISO(activity.created_at), "PPp")}
                          {/* {formatDistance(activity.created_at,new Date, { 
                        addSuffix: true,
                        })} */}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivity(activity)}
                        >
                          Editar
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1">{activity.comment}</p>
                  </div>
                  </div>
                  :
                  
                  <div className="flex space-x-4 border p-2 rounded-md"> 
                   <div className="flex-1">
                    <p className="mt-1 text-sm">{activity.comment} · 
                     <span className="text-xs text-muted-foreground"> {format(parseISO(activity.created_at), "PPp")}</span>
                      </p>
                  </div>
                  </div>
                  }
                </div>
              ))}
              {/* {activities.some((a) => a.type === "attachment") && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Paperclip className="h-4 w-4" />
              <span>Attachments</span>
            </div>
          )} */}
            </div>
          </CardContent>
        </Card>
      </FormLayout>
    </>
  );
}

const EditCommentDrawer = ({
  activity,
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  activity: components["schemas"]["ActivityDto"];
}) => {
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const r = routes;

  const onSubmit = (values: z.infer<typeof editCommentSchema>) => {
    fetcher.submit(
      {
        action: "edit-comment",
        editComment: values,
      },
      {
        method: "POST",
        action: r.apiCore,
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
      onOpenChange(false);
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      onOpenChange(false);
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("f.edit", { o: t("form.comment") })}
    >
      <CustomForm
        schema={editCommentSchema}
        fetcher={fetcher}
        onSubmit={onSubmit}
        defaultValues={
          {
            id: activity.id,
            comment: activity.comment,
          } as z.infer<typeof editCommentSchema>
        }
        formItemsData={[
          {
            typeForm: "textarea",
            name: "comment",
            label: t("form.comment"),
          },
        ]}
      />
    </DrawerLayout>
  );
};
