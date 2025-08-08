import { Typography } from "@/components/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { components } from "~/sdk";

export default function TaskObservers({
  observers = [],
  allowEdit,
  className,
}: {
  observers?: components["schemas"]["ProfileDto"][];
  allowEdit: boolean;
  className?: string;
}) {
  return (
    <div className={cn(className, "grid border rounded-lg p-2")}>
      <div className="flex justify-between items-center">
        <Typography variant="subtitle2">Observers</Typography>
      </div>
      <div className="p-2">
        {observers?.length > 0 ? (
          observers.map((observer) => (
            <div
              key={observer.uuid}
              className="flex items-center rounded-lg space-x-3 border p-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {observer.given_name[0]}
                  {observer.family_name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="">{observer.full_name}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No observers assigned to this task.
          </div>
        )}
      </div>
    </div>
  );
}