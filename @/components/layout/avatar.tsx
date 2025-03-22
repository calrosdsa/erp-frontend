import { type AvatarProps } from "@radix-ui/react-avatar"


import { User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { UserData } from "~/types/app-types"
import { fullName } from "~/util/convertor/convertor"
import { components } from "index"

interface UserAvatarProps extends AvatarProps {
    user: components["schemas"]["Profile"]
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.Avatar != undefined ? (
                <AvatarImage alt="Picture" src={""} />
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{fullName(user.GivenName,user.FamilyName)}</span>
                    <UserIcon className="h-4 w-4" />
                </AvatarFallback>
            )}
        </Avatar>
    )
}