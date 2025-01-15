import React, { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { format, parse } from "date-fns";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  CalendarIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";

import { components } from "~/sdk";
import { DEFAULT_ORDER } from "~/constant";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import IconButton from "../custom-ui/icon-button";
import { DateRange } from "react-day-picker";
import { toZonedTime } from "date-fns-tz";
import { Badge } from "../ui/badge";
import AutoCompleteByParty from "../custom/select/autocomple-by-party";

type FilterOption = components["schemas"]["FilterOptionDto"];
type SelectItem = { name: string; value: string };

interface FilterData {
  param: string;
  operator: string;
  value: any[];
}

const FilterSelectorValue: React.FC<{
  filterOption: FilterOption;
  current: FilterData;
  onChange: (value: any[]) => void;
}> = ({ filterOption, current, onChange }) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    if (filterOption.type === "date") {
      setDates(current.value.map((t) => parse(t, "yyyy-MM-dd", new Date())));
    }
  }, [current.value, filterOption.type]);

  const handleDateChange = (
    newDates: Date | Date[] | DateRange | undefined
  ) => {
    if (!newDates) return;

    let updatedDates: Date[] = [];
    if (Array.isArray(newDates)) {
      updatedDates = newDates;
    } else if ("from" in newDates && "to" in newDates) {
      if (newDates.from && newDates.to) {
        updatedDates = [newDates.from, newDates.to];
      }
    } else {
      if (newDates) {
        updatedDates = [newDates as Date];
      }
    }

    setDates(updatedDates);
    onChange(updatedDates.map((d) => format(d, "yyyy-MM-dd")));
  };

  if (filterOption.type === "date") {
    return (
      <>
        <Input
          className="flex space-x-2 truncate w-32"
          value={dates?.map((t) => format(t, "yyyy-MM-dd")).join(",")}
          readOnly
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost">
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {/* {JSON.stringify(dates)} */}
            {current.operator == "in" && (
              <Calendar
                mode={"multiple"}
                // selected={new Date()}
                selected={dates}
                // onSelect={(e) => e && setDates(e)}
                onSelect={handleDateChange}
                initialFocus
              />
            )}
            {current.operator == "between" && (
              <Calendar
                mode={"range"}
                // selected={new Date()}
                selected={{
                  from: dates.length > 0 ? dates[0] : undefined,
                  to: dates.length > 1 ? dates[1] : undefined,
                }}
                // onSelect={(e) => {
                //   if (e?.to && e?.from) {
                //     setDates([e.from, e.to]);
                //   }
                // }}
                onSelect={handleDateChange}
                initialFocus
              />
            )}
            {current.operator != "between" && current.operator != "in" && (
              <Calendar
                mode={"single"}
                selected={dates.length > 0 ? dates[0] : new Date()}
                // selected={dates}
                // onSelect={(e) => e && setDates([e])}
                onSelect={handleDateChange}
                initialFocus
              />
            )}
          </PopoverContent>
        </Popover>
      </>
    );
  }

  if (filterOption.type === "string" && filterOption.options) {
    return (
      <Select
        value={current.value[0]}
        onValueChange={(value) => onChange([value])}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filterOption.options.map((option, idx) => (
            <SelectItem key={idx} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (filterOption.type === "string" && filterOption.party_type != "") {
    return <AutoCompleteByParty partyType={filterOption.party_type} />;
  }
  if (filterOption.type === "string") {

    return (
      <Input
        className="w-min"
        onChange={(e) => onChange([e.target.value])}
        value={current.value[0]}
      />
    );
  }

  return null;
};

const FilterPopoverContent: React.FC<{
  filterOptions: FilterOption[];
  onApplyFilters: (filters: FilterData[]) => void;
  filters: FilterData[];
  setFilters: React.Dispatch<React.SetStateAction<FilterData[]>>;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}> = ({
  filterOptions,
  onApplyFilters,
  setSearchParams,
  filters,
  setFilters,
}) => {
  // const [filters, setFilters] = useState<FilterData[]>([]);
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();

  const handleFilterChange = (
    index: number,
    field: keyof FilterData,
    value: any
  ) => {
    setFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      newFilters[index] = {
        ...newFilters[index],
        [field]: value,
      } as FilterData;
      return newFilters;
    });
  };

  const addNewFilter = () => {
    if (filterOptions.length > 0) {
      const newFilter: FilterData = {
        param: filterOptions[0]?.param || "",
        operator: filterOptions[0]?.operators[0] || "",
        value: [],
      };
      setFilters((prevFilters) => [...prevFilters, newFilter]);
    }
  };
  const tOperator = (o: string) => {
    switch (o) {
      case "=": {
        return "Igual a";
      }
      case "!=": {
        return "No igual a";
      }
      case "between": {
        return "Entre";
      }
      case ">": {
        return "Mayor que";
      }
      case "<": {
        return "Menor que";
      }
      case "in": {
        return "En";
      }
      case "<=": {
        return "Menor o igual que";
      }
      case ">=": {
        return "Mayor o igual que";
      }
    }
    return o;
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter, idx) => {
          const filterOption = filterOptions.find(
            (t) => t.param === filter.param
          );
          if (!filterOption) return null;

          return (
            <div key={idx} className="space-x-2 flex items-center">
              <Select
                value={filter.param}
                onValueChange={(value) =>
                  handleFilterChange(idx, "param", value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option, optionIdx) => (
                    <SelectItem key={optionIdx} value={option.param}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filter.operator}
                onValueChange={(value) =>
                  handleFilterChange(idx, "operator", value)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOption.operators.map((operator, operatorIdx) => (
                    <SelectItem key={operatorIdx} value={operator}>
                      {tOperator(operator)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FilterSelectorValue
                filterOption={filterOption}
                current={filter}
                onChange={(value) => handleFilterChange(idx, "value", value)}
              />

              <Button
                variant={"ghost"}
                onClick={() => {
                  const newFilters = filters.filter((_, i) => i !== idx);
                  setFilters(newFilters);
                  searchParams.delete(filter.param);
                  const newParams = deleteRelatedQuery(
                    filter.param,
                    filterOption.party_type,
                    searchParams
                  );
                  setSearchParams(newParams, { preventScrollReset: true });
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={addNewFilter} variant="outline">
          Add Filter
        </Button>
        <Button onClick={() => onApplyFilters(filters)}>{t("apply")}</Button>
      </CardFooter>
    </Card>
  );
};

const DataLayout: React.FC<{
  children: ReactNode;
  fixedFilters?: () => JSX.Element;
  orderOptions?: SelectItem[];
  filterOptions?: FilterOption[] | null;
}> = ({ children, fixedFilters, orderOptions = [], filterOptions = [] }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [filters, setFilters] = useState<FilterData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("common");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = (filters: FilterData[]) => {
    filters.forEach((filter) => {
      searchParams.set(
        filter.param,
        JSON.stringify([filter.operator, ...filter.value])
      );
    });
    setSearchParams(searchParams, { preventScrollReset: true });
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    let newSearchParams = new URLSearchParams(searchParams);
    filters.forEach((filter) => {
      const filterOption = filterOptions?.find((t) => t.param == filter.param);
      newSearchParams.delete(filter.param);
      if (filterOption) {
        newSearchParams = deleteRelatedQuery(
          filter.param,
          filterOption.party_type,
          newSearchParams
        );
      }
    });
    setFilters([]);
    setSearchParams(newSearchParams, { preventScrollReset: true });
  };

  useEffect(() => {
    if(filterOptions?.length == 0 ){
      return
    }

    const filterParams = new Set(filterOptions?.map((option) => option.param));
    const filterDataList = Array.from(searchParams.entries())
      .filter(([key]) => filterParams.has(key))
      .map(([key, value]): FilterData => {
        try {
          const parsedValue = JSON.parse(decodeURIComponent(value));
          if (Array.isArray(parsedValue) && parsedValue.length >= 2) {
            return {
              param: key,
              operator: parsedValue[0],
              value: parsedValue.slice(1),
            };
          }
        } catch (error) {
          console.warn(`Failed to parse filter value for ${key}:`, error);
        }

        return {
          param: key,
          operator: "=",
          value: [value],
        };
      });
    setFilters(filterDataList);
  }, [filterOptions]);

  return (
    <div className="h-full flex flex-col pt-1">
      <div className="grid gap-3 xl:flex xl:justify-between">
        <div className="flex space-x-1">
          {filterOptions != null && filterOptions.length > 0 && (
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <div className="flex space-x-1 items-center">
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilterIcon className="mr-1 h-4 w-4" />
                    <span>Filtros</span>
                    {filters.length > 0 && (
                      <Badge
                        variant={"outline"}
                        className=" flex items-center justify-center w-5 h-5"
                      >
                        {filters.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                {filters.length > 0 && (
                  <Button
                    variant={"ghost"}
                    className=" rounded-full"
                    onClick={clearFilter}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
              <PopoverContent className="sm:w-[500px] p-0">
                <FilterPopoverContent
                  filters={filters}
                  setFilters={setFilters}
                  filterOptions={filterOptions}
                  onApplyFilters={handleApplyFilters}
                  setSearchParams={setSearchParams}
                />
              </PopoverContent>
            </Popover>
          )}
          {/* {JSON.stringify(filters)} */}
          {fixedFilters && fixedFilters()}
        </div>
        {/* <div></div> */}
        <div className="flex space-x-2">
          {orderOptions.length > 0 && (
            <DropdownMenu>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="rounded-r-none"
                  size="sm"
                  onClick={() => {
                    const order = searchParams.get("orientation");
                    // if (orderOptions.length > 0 && orderOptions[0]) {
                    //   searchParams.set("column", orderOptions[0].value);
                    //   searchParams.set("columnName", orderOptions[0].name);
                    // }
                    searchParams.set(
                      "orientation",
                      order === DEFAULT_ORDER ? "asc" : DEFAULT_ORDER
                    );
                    setSearchParams(searchParams, { preventScrollReset: true });
                  }}
                >
                  {searchParams.get("orientation") === DEFAULT_ORDER ? (
                    <ArrowDownWideNarrow size={13} />
                  ) : (
                    <ArrowUpWideNarrow size={13} />
                  )}
                </Button>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-l-none"
                  >
                    {searchParams.get("columnName") ||
                      orderOptions[0]?.name ||
                      ""}
                  </Button>
                </DropdownMenuTrigger>
              </div>
              <DropdownMenuContent>
                {orderOptions.map((item, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => {
                      searchParams.set("column", item.value);
                      searchParams.set("columnName", item.name);
                      setSearchParams(searchParams, {
                        preventScrollReset: true,
                      });
                    }}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="py-2 w-full">{children}</div>
    </div>
  );
};

export default DataLayout;

const deleteRelatedQuery = (
  param: string,
  partyType: string,
  searchParams: URLSearchParams
): URLSearchParams => {
  if (partyType != "") {
    const word = param;
    const cleanedWord = word.includes("_") ? word.split("_")[0] : word;
    const escapedWord = cleanedWord?.replace(
      /[.*+?^=!:${}()|\[\]\/\\]/g,
      "\\$&"
    );

    // Create the regex pattern dynamically
    const pattern = `^${escapedWord}(_.*)?$`;

    // Return the constructed regex
    const regExpr = new RegExp(pattern);
    console.log("HAS PARTY TYPE", regExpr);
    searchParams.forEach((v, k) => {
      console.log("TEST", k, regExpr.test(k));
      if (regExpr.test(k)) {
        searchParams.delete(k);
      }
    });
  }
  return searchParams;
};
