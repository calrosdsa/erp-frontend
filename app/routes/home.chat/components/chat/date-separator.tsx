import { format, isToday, isYesterday } from "date-fns"

type DateSeparatorProps = {
  date: string
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  let displayDate = date

  try {
    const dateObj = new Date(date)

    if (isToday(dateObj)) {
      displayDate = "Today"
    } else if (isYesterday(dateObj)) {
      displayDate = "Yesterday"
    } else {
      displayDate = format(dateObj, "MMMM d, yyyy")
    }
  } catch (error) {
    // Fallback to original date string if parsing fails
  }

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">{displayDate}</div>
    </div>
  )
}

