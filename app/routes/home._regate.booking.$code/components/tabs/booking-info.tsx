import { useLoaderData, useNavigate } from "@remix-run/react"
import { loader } from "../../route"
import DisplayTextValue from "@/components/custom/display/DisplayTextValue"
import { useTranslation } from "react-i18next"
import { routes } from "~/util/route"
import { formatCurrency } from "~/util/format/formatCurrency"
import { DEFAULT_CURRENCY } from "~/constant"
import { CalendarDays, Clock, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate"


export const BookingInfo = () =>{
    const {booking,actions} = useLoaderData<typeof loader>()
    const {t,i18n} = useTranslation("common")
    const navigate = useNavigate()
    
    const r = routes
    return (
        <div className="info-grid">
            <DisplayTextValue
            title={t("_customer.base")}
            value={booking?.party_name}
            to={r.toCustomerDetail(booking?.party_name ||"",booking?.party_uuid || "")}
            />
            <DisplayTextValue
            title={t("regate._court.base")}
            value={booking?.court_name}
            to={r.toCourtDetail(booking?.court_name || "",booking?.court_uuid || '')}
            />

            <div className="col-span-full">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3  gap-3 xl:gap-5">

                        <div className="flex-1 px-4 sm:border-r mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Precio de la Reserva</div>
                          </div>
                          <div className=" flex space-x-2">
                          {Number(booking?.discount) > 0 ? (
                            <>
                                <Badge
                                  variant="outline"
                                  className="flex items-center w-min line-through"
                                >
                                  {formatCurrency(
                                    booking?.total_price,
                                    DEFAULT_CURRENCY,
                                    i18n.language
                                  )}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center w-min"
                                >
                                  {formatCurrency(
                                    Number(booking?.total_price) - Number(booking?.discount),
                                    DEFAULT_CURRENCY,
                                    i18n.language
                                  )}
                                </Badge>
                              </>
                            ) : (
                              <Badge
                                variant="outline"
                                className="flex items-center w-min"
                              >
                                {formatCurrency(
                                  booking?.total_price,
                                  DEFAULT_CURRENCY,
                                  i18n.language
                                )}
                              </Badge>
                            )}
                        </div>
                        </div>

                        {booking?.discount != null &&
                        <div className="flex-1 px-4 sm:border-r mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Descuento</div>
                          </div>
                          <Badge variant="outline" className="flex items-center w-min">
                            {formatCurrency(booking?.discount,DEFAULT_CURRENCY,i18n.language)}
                          </Badge>
                        </div>
                        }

                        <div className="flex-1 px-4 sm:border-r mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Monto Pagado</div>
                          </div>
                          <Badge variant="outline" className="flex items-center w-min">
                            {formatCurrency(booking?.paid,DEFAULT_CURRENCY,i18n.language)}
                          </Badge>
                        </div>

                        <div className="flex-1 px-4 sm:border-r mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Fecha de la Reserva</div>
                          </div>
                          <Badge variant="outline" className="flex items-center w-min whitespace-nowrap">
                            {formatMediumDate(booking?.start_date,i18n.language)}
                          </Badge>
                        </div>


                     

                        <div className="flex-1 pl-4 mt-4 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <Clock className="mr-2 h-4 w-4" />
                            <div className="text-sm font-medium">Horas Reservadas</div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center">
                              {format(parseISO(booking?.start_date || ""), 'p')}
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {format(parseISO(booking?.end_date || ""), 'p')}
                            </Badge>
                          </div>
                        </div>

                        
                      </div>
            </div>
        </div>
    )
}