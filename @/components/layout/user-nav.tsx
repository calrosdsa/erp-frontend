
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserAvatar } from "@/components/layout/avatar";
import { UserData } from "~/types/app";
import { Form } from "@remix-run/react";
import { useTranslation } from "react-i18next";

type Props = {
    user: UserData;
    openSessionDefaults: () => void;
};

export function UserNav({ user,openSessionDefaults }: Props) {
    const { t } = useTranslation()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={user}
                    className="h-8 w-8 cursor-pointer"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-4 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.FirstName && <p className="font-medium">{user.FirstName}</p>}
                        {user.Email && (
                            <p className="w-[200px] truncate text-sm text-zinc-700">
                                {user.Email}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                <Button variant={"outline"} className="w-full"
                onClick={()=>openSessionDefaults()}
                > {t("sidebar.sessionDefaults")}</Button>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                <Form action="/home" method="post">
                <input type="hidden" value="signout" name="action" />
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                    >
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        Log Out
                    </Button>
                </Form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}