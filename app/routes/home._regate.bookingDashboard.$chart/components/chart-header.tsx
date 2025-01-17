import { DatePickerWithRange } from "@/components/custom/datetime/date-picker-with-range";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "@remix-run/react";
import { format, formatRFC3339 } from "date-fns";
import { Filter, Settings } from "lucide-react";
import ChartSetting, { useChartSetting } from "./chart-setting-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Typography, { labelF } from "@/components/typography/Typography";
import { ChartType, TimeUnit, timeUnitToJSON } from "~/gen/common";
import { getTimeUnitOptions } from "../util";
import { useTranslation } from "react-i18next";

export default function ChartHeader({timeUnit,chartType}: {
  timeUnit:TimeUnit
  chartType:ChartType
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const chartSetting = useChartSetting();
  const {t } = useTranslation("common")
  const changeTimeUnit = (timeUnit:TimeUnit)=>{
    searchParams.set("time_unit",timeUnitToJSON(timeUnit))
    setSearchParams(searchParams, {
       preventScrollReset: true,
     });
  }
  return (
    <>
      {chartSetting.open && (
        <ChartSetting
          open={chartSetting.open}
          onOpenChange={chartSetting.onOpenChange}
        />
      )}
      <div className="flex justify-between flex-wrap gap-3">
        <DatePickerWithRange
          onChange={(s, e) => {
            if (s) {
              searchParams.set("start", format(s, "yyyy-MM-dd"));
            }
            if (e) {
              searchParams.set("end", format(e, "yyyy-MM-dd"));
            }
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
        />

        <div className="flex space-x-2">
          {/* <Button variant="outline" className="w-full sm:w-auto mb-4">
            <Filter className="hidden sm:block h-4 w-4 mr-2" />
            AÑADIR FILTRO
          </Button> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" >
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1 sm:p-2" align="end">
                <div className="">
                    <Typography fontSize={labelF}>
                    Unidad de tiempo
                    </Typography>
                    <div className=" flex space-x-2 py-2">
                      {getTimeUnitOptions(chartType).map((tU,idx)=>{
                        const timeU = TimeUnit[tU]
                          return (
                            <Button size={"xs"} key={idx}
                           variant={timeUnit == tU ? "default" : "outline"}
                           onClick={()=>{
                             changeTimeUnit(tU)
                          }}>
                              {t(`timeUnit.${timeU}`)}
                          </Button>
                          )
                      })}
                        {/* <Button size={"xs"}
                         variant={timeUnit == TimeUnit.hour ? "default" : "outline"}
                         onClick={()=>{
                           changeTimeUnit(TimeUnit.hour)
                        }}>
                            Hora
                        </Button>
                        <Button size={"xs"} variant={timeUnit == TimeUnit.day ? "default" : "outline"}
                        onClick={()=>{
                           changeTimeUnit(TimeUnit.day)
                        }}>
                            Dia
                        </Button>
                        <Button size={"xs"}  variant={timeUnit == TimeUnit.week ? "default" : "outline"}
                         onClick={()=>{
                           changeTimeUnit(TimeUnit.week)
                        }}>
                            Semana
                        </Button>
                        <Button size={"xs"}  variant={timeUnit == TimeUnit.month ? "default" : "outline"}
                         onClick={()=>{
                           changeTimeUnit(TimeUnit.month)
                        }}>
                            Mes
                        </Button>
                        
                        <Button size={"xs"}  variant={timeUnit == TimeUnit.year ? "default" : "outline"}
                        onClick={()=>{
                           changeTimeUnit(TimeUnit.year)
                        }}>
                            Year
                        </Button> */}
                    </div>

                </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

const ChartHeaderFilterDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  return (
    <DrawerLayout onOpenChange={onOpenChange} open={open}>
      dasd
    </DrawerLayout>
  );
};
