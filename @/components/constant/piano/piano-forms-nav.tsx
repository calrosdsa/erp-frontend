import { CreditCardIcon, DollarSign, NotepadText, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON, PianoPartyType, pianoPartyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app";
import { Entity } from "~/types/enums";
import { routes } from "~/util/route";

export const PianoFormsNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = routes
  let pianoFormsChildren:NavItem[] = [];
  if(entities?.includes(Entity.PIANO_FORMS_ENTITY_ID)){
    pianoFormsChildren.push({
      title: t("Relocation & Moving"),
      href: r.toParty("relocationAndMoving"),
    });
  }
 

  const pianoForms: NavItem = {
    title: "pianoForms",
    icon: NotepadText,
    href:r.customers,
    isChildren: true,
    children: pianoFormsChildren,
  };


  return pianoForms
}