"use client";

import React from 'react'
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import { fullName } from "~/util/convertor/convertor";
import { Form, Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
// import { useSessionDefaults } from "~/routes/home/components/SessionDefaults";
import { Separator } from "@/components/ui/separator";
import { useSessionDefaults } from '~/routes/home/components/SessionDefaults';

export function NavUser({
  user,
}: {
  user: components["schemas"]["ProfileDto"];
}) {
  const { isMobile } = useSidebar();
  const { t } = useTranslation("common");
  const sessionDefaults = useSessionDefaults();
  const r = routes;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage  alt={fullName(user.given_name, user.family_name)} />
                <AvatarFallback className="rounded-lg">
                  {user.given_name?.[0]}{user.family_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {fullName(user.given_name, user.family_name)}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width]rounded-lg p-4"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex flex-col space-y-2">
              <Link
                className="flex items-center justify-start gap-4 p-2 hover:bg-accent rounded-md transition-colors"
                to={r.profile}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage  alt={fullName(user.given_name, user.family_name)} />
                  <AvatarFallback>
                    {user.given_name?.[0]}{user.family_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{fullName(user.given_name, user.family_name)}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </Link>

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => sessionDefaults.onOpenChange(true)}
              >
                {t("sidebar.sessionDefaults")}
              </Button>

              <Form action="/home" method="post">
                <input type="hidden" value="signout" name="action" />
                <Button type="submit" variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("_auth.signout")}
                </Button>
              </Form>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}