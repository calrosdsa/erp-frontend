import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, ChevronDown, ChevronUp, EditIcon, Edit2Icon } from "lucide-react"
import { components } from '~/sdk';
import { Link, useNavigate } from '@remix-run/react';
import IconButton from './icon-button';
import { routes } from '~/util/route';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';



interface AddressListProps {
  addresses?: components["schemas"]["AddressDto"][] | null;
  onAddAddress?: () => void;
}

export default function AddressesComponent({ addresses = [], onAddAddress }: AddressListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const r = routes
  const navigate = useNavigate()
  const {t} = useTranslation("common")

  if (addresses == null || addresses.length === 0) {
    return (
      <Card className="w-full flex justify-center items-center   ">
        <CardContent className="text-center py-6">
          <h2 className=" mb-4">{t("_address.empty")}</h2>
          <Button onClick={onAddAddress} className="group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          {t("_address.add")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl gap-2 grid sm:grid-cols-2  xl:grid-cols-1 2xl:grid-cols-2">
      {addresses.map((address, index) => (
        <div
          key={index}
          className="transition-all duration-300 ease-in-out "
        >
          <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer "
              onClick={() =>{
                if(expandedIndex.includes(index)){
                    const f = expandedIndex.filter(t => index != t)
                    setExpandedIndex(f)
                }else{
                    setExpandedIndex(t=>[...t,index])
                }

                }}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-semibold ">
                    {address.title}
                    </CardTitle>
              </div>

              <div className='flex space-x-2'>
                <IconButton
                label='edit-address'
                icon={Edit2Icon}
                onClick={(e)=>{
                    e.stopPropagation()
                   navigate(r.toAddressDetail(address.title,address.uuid))
                }}
                />
             
                
              {/* {expandedIndex.includes(index) ? (
                <IconButton
                label='edit-address'
                className=' text-primary transition-transform duration-300'
                icon={ChevronUp}
                
                />
                  
                ) : (
                    <IconButton
                    label='edit-address'
                    className=' text-primary transition-transform duration-300'
                    icon={ChevronDown}
                    />
                )} */}
                </div>
            </CardHeader>
            <div
              className={cn(`transition-all duration-300 ease-in-out overflow-hidden`,
                "max-h-48 opacity-100",
              // expandedIndex.includes(index) ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            )}
            >
              <CardContent className="">
                <div className="space-y-2">
                  {address.company && (
                    <p className="text-sm text-primary font-medium">{address.company}</p>
                  )}
                  
                  <p className="text-sm">{address.street_line1}</p>
                  {address.street_line2 && (
                    <p className="text-sm">{address.street_line2}</p>
                  )}
                  <p className="text-sm font-bold text-primary">City: {address.city}</p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      ))}
      
      <div className='col-span-full pt-2'>
      <Button onClick={onAddAddress} className="w-full group underline" variant={"ghost"}>
        <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
        {t("_address.addAnother")}
      </Button>
      </div>
    </div>
  )
}