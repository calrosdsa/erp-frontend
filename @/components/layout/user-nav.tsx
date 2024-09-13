
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
import { Form, Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { components } from "~/sdk";

type Props = {
    user: components["schemas"]["ProfileDto"];
    openSessionDefaults: () => void;
};

export function UserNav({ user,openSessionDefaults }: Props) {
    const { t } = useTranslation("common")
    const r = routes
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={user}
                    className="h-8 w-8 cursor-pointer"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link  className="flex items-center justify-start gap-4 p-2 cursor-pointer" to={r.profile}>

                    <div className="flex flex-col space-y-1 leading-none">
                        {user.given_name && <p className="font-medium">{user.given_name}</p>}
                        {user.family_name && (
                            <p className="w-[200px] truncate text-sm text-zinc-700">
                                {user.family_name}
                            </p>
                        )}
                    </div>
                        </Link>
                </DropdownMenuItem>

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
                        {t("_auth.signout")}
                    </Button>
                </Form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}