import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

export function localDateTime(date: string, type: string): string {
  if (type === "full") {
    return dayjs(date).format("MMM DD, YYYY h:mm A")
  } else if (type === "date") {
    return dayjs(date).format("MMM DD, YYYY")
  }
  return ""
}

export function UTCDateTime(date: string, type: string): string {
  if (type === "full") {
    return dayjs(date).utc().format("MMM DD, YYYY h:mm A")
  }
  return ""
}

export function minimalLocalDateTime(
  date: string,
  type: string = "full",
): string {
  const dateObj = dayjs(date)
  const now = new Date()
  let formatStr = "MMM D"
  if (now.getFullYear() !== dateObj.year()) {
    formatStr += ", YYYY"
  }
  if (type === "full") {
    formatStr += " h:mm A"
  }
  return dateObj.format(formatStr)
}
