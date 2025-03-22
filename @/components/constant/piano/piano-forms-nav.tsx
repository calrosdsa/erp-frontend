import { CreditCardIcon, DollarSign, NotepadText, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON, PianoPartyType, pianoPartyTypeToJSON } from "~/gen/common";
import { NavItem } from "~/types";
import { GlobalState } from "~/types/app-types";
import { Entity } from "~/types/enums";
import { route } from "~/util/route";

export const PianoFormsNav = ({ entities }: { 
    entities: number[] | undefined
}): NavItem => {
  const { t } = useTranslation("common");
  const r = route
  let pianoFormsChildren:NavItem[] = [];
  if(entities?.includes(Entity.PIANO_FORS)){
    pianoFormsChildren.push({
      title: t("Relocation & Moving"),
      href: r.toParty("relocationAndMoving"),
    });
  }
 

  const pianoForms: NavItem = {
    title: t("pianoForms"),
    icon: NotepadText,
    href:r.customers,
    isChildren: true,
    children: pianoFormsChildren,
  };


  return pianoForms
}