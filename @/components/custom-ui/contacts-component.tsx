import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  Mail,
  Phone,
} from "lucide-react";
import IconButton from "./icon-button";
import { components } from "~/sdk";
import { useNavigate } from "@remix-run/react";
import { route } from "~/util/route";
import { fullName } from "~/util/convertor/convertor";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ContactData } from "~/util/data/schemas/contact/contact.schema";

interface ContactListProps {
  contacts?: components["schemas"]["ContactDto"][] | null;
  onAddContact?: () => void;
}

export default function ContactList({
  contacts = [],
  onAddContact,
}: ContactListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const navigate = useNavigate();
  const r = route;
  const { t } = useTranslation("common");

  if (contacts == null || contacts.length === 0) {
    return (
      <div className="w-full flex justify-center items-center">
        <div className="text-center py-6 w-full">
          <h2 className="mb-4">{t("_contact.empty")}</h2>
          {onAddContact && (

            <Button
            variant={"ghost"}
            type="button"
            onClick={onAddContact}
            className="text-xs mt-4 underline flex w-full"
            >
            <Plus className="w-4 h-4" />
            <span>Agregar contacto</span>
          </Button>
          )}
        </div>
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full max-w-2xl mt-2 grid gap-3 ">
      {contacts.map((contact, index) => (
        <div
          key={contact.id}
          className="transition-all duration-300 ease-in-out"
        >
          <Card className="w-full overflow-hidden ">
            <CardHeader
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  {contact.name}
                </CardTitle>
              </div>

              <div className="flex space-x-2">
                {/* <IconButton
                  label={expandedIndex.includes(index) ? 'collapse' : 'expand'}
                  className='text-primary transition-transform duration-300'
                  icon={expandedIndex.includes(index) ? ChevronUp : ChevronDown}
                /> */}
              </div>
            </CardHeader>
            <div
              className={cn(
                `transition-all duration-300 ease-in-outoverflow-hidden`,
                // expandedIndex.includes(index) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                "max-h-48 opacity-100"
              )}
            >
              <CardContent className="">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <p className="text-sm">{contact.email}</p>
                  </div>
                  {contact.phone_number && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <p className="text-sm">{contact.phone_number}</p>
                    </div>
                  )}
                  {contact.gender && (
                    <p className="text-sm text-primary font-medium">
                      {t("form.gender")}: {contact.gender}
                    </p>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      ))}

      {/* <div className='col-span-full pt-2'>
        <Button onClick={onAddContact} className="w-full group underline" variant={"ghost"}>
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          {t("_contact.addAnother")}
        </Button>
      </div> */}
    </div>
  );
}
