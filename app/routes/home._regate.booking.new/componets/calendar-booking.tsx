import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const viewOptions = ["Today", "Day", "Week", "Work Week", "Month", "Agenda"];

export default function CalendarBooking() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 14)); // October 14, 2024
  const [currentView, setCurrentView] = useState("Week");

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const formatDateRange = (date: Date, view: string) => {
    if (view === "Day") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6);
    return `${date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} - ${endDate.toLocaleDateString("en-US", {
      day: "numeric",
      year: "numeric",
    })}`;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (currentView === "Day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const renderDayView = () => (
    <div className="grid grid-cols-1">
      <div className="border-b p-2 text-center">
        <div>{weekDays[currentDate.getDay() - 1]}</div>
        <div className="text-2xl">{currentDate.getDate()}</div>
      </div>
      <div>
        {timeSlots.map((slot, index) => (
          <div key={slot} className="h-8 border-b flex">
            <div className="w-16 text-xs text-gray-500 p-1">
              {index % 2 === 0 ? slot : ""}
            </div>
            <div className="flex-grow">
              {slot === "06:00" && (
                <div className="bg-green-500 text-white p-1 text-xs h-16">
                  Lifecycle of Bumblebee
                  <br />
                  6:00 AM - 7:00 AM
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <>
      <ScrollArea className="min-w-[800px] w-full border rounded-lg shadow-lg">
        <div className="flex border-b overflow-auto">
          <div className=" border-r w-20"></div>
          <div className="grid grid-cols-7 w-full">
            {weekDays.map((day, index) => (
              <div key={day} className="p-2 text-center border-r">
                <div>{day}</div>
                <div className={cn("text-2xl", index === 0 && "text-blue-500")}>
                  {new Date(
                    currentDate.getTime() + index * 24 * 60 * 60 * 1000
                  ).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full overflow-auto">
          <div className="border-r w-20">
            {timeSlots.map((slot, index) => (
              <div
                key={slot}
                className="h-8 border-b p-1 text-xs text-gray-500"
              >
                {index % 2 === 0 ? slot : ""}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 w-full">
            {weekDays.map((day, dayIndex) => (
              <div key={day} className="border-r">
                {timeSlots.map((slot, slotIndex) => (
                  <div key={`${day}-${slot}`} className="h-8 border-b">
                    {dayIndex === 0 && slot === "06:00" && (
                      <div className="bg-green-500 text-white p-1 text-xs h-16">
                        Lifecycle of Bumblebee
                        <br />
                        6:00 AM - 7:00 AM
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Select
            value={formatDateRange(currentDate, currentView)}
            onValueChange={(value) => setCurrentDate(new Date(value))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue
                placeholder={formatDateRange(currentDate, currentView)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={currentDate.toISOString()}>
                {formatDateRange(currentDate, currentView)}
              </SelectItem>
              {/* Add more date range options here */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          {viewOptions.map((option) => (
            <Button
              key={option}
              variant={currentView === option ? "default" : "outline"}
              onClick={() => setCurrentView(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        {currentView === "Day" ? renderDayView() : renderWeekView()}
      </div>
    </div>
  );
}
