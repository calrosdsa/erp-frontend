import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Plus, ChevronDown, ChevronUp, Edit2, Mail, Phone } from "lucide-react"
import IconButton from './icon-button'
import { components } from '~/sdk'
import { useNavigate } from '@remix-run/react'
import { routes } from '~/util/route'
import { fullName } from '~/util/convertor/convertor'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'


interface ContactListProps {
  contacts?: components["schemas"]["ContactDto"][] | null;
  onAddContact?: () => void;
}

export default function ContactList({ contacts = [], onAddContact }: ContactListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const navigate = useNavigate()
  const r = routes
  const {t} = useTranslation("common")

  if (contacts == null || contacts.length === 0) {
    return (
      <Card className="w-full flex justify-center items-center">
        <CardContent className="text-center py-6">
          <h2 className="mb-4">{t("_contact.empty")}</h2>
          <Button onClick={onAddContact} className="group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            {t("_contact.add")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full max-w-2xl gap-2 grid sm:grid-cols-2  xl:grid-cols-1 2xl:grid-cols-2">
      {contacts.map((contact, index) => (
        <div
          key={contact.id}
          className="transition-all duration-300 ease-in-out"
        >
          <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  {contact.given_name} {contact.family_name}
                </CardTitle>
              </div>

              <div className='flex space-x-2'>
                <IconButton
                  label='edit-contact'
                  icon={Edit2}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(r.toContactDetail(fullName(contact.given_name,contact.family_name),contact.uuid))
                  }}
                />
                
                {/* <IconButton
                  label={expandedIndex.includes(index) ? 'collapse' : 'expand'}
                  className='text-primary transition-transform duration-300'
                  icon={expandedIndex.includes(index) ? ChevronUp : ChevronDown}
                /> */}
              </div>
            </CardHeader>
            <div
              className={cn(`transition-all duration-300 ease-in-outoverflow-hidden`,
                // expandedIndex.includes(index) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                'max-h-48 opacity-100' 
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
                    <p className="text-sm text-primary font-medium">{t("form.gender")}: {contact.gender}</p>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      ))}
     
      <div className='col-span-full pt-2'>
        <Button onClick={onAddContact} className="w-full group underline" variant={"ghost"}>
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          {t("_contact.addAnother")}
        </Button>
      </div>
    </div>
  )
}