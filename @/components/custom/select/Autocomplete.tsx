import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";

type Props<T> = {
  selectedValue?: T;
  onSelectedValueChange: (value?: T) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: { value: T; label: string }[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
};

export function AutoComplete<T>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [query,setQuery] = useState(searchValue)

  const reset = () => {
    onSelectedValueChange(undefined);
    onSearchValueChange("");
  };
  // const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  //   if (
  //     !e.relatedTarget?.hasAttribute("cmdk-list") &&
  //     labels[selectedValue] !== searchValue
  //   ) {
  //     reset();
  //   }
  // };

  const onSelectItem = (inputValue: string) => {
    console.log("Input value",inputValue)
    if (inputValue === selectedValue) {
      reset();
    } else {
      // onSelectedValueChange(inputValue as T);
      setQuery(inputValue ?? "");
    }
    setOpen(false);
  };

  const onQueryChange = (e:string) =>{
    onSearchValueChange(e)
    setQuery(e)
  }

  return (
    <div className="flex items-center w-32">
      <Popover open={open} onOpenChange={setOpen}>
        <Command >
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={query}
              onValueChange={onQueryChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!query || !open)}
              onFocus={() => setOpen(true)}
              // onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.label}
                      value={option.label}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === option.label
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}