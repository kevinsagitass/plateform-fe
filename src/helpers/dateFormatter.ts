import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatDateClient = (date: string | Date): string => {
  const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(new Date(date), clientTimezone);
  return format(zonedDate, "dd MMMM yyyy HH:mm:ss");
};

export const formatDateWIB = (date: string | Date): string => {
  const zonedDate = toZonedTime(new Date(date), "Asia/Jakarta");
  return format(zonedDate, "dd MMMM yyyy HH:mm:ss") + " WIB";
};

export const formatDateTZ = (
  date: string | Date,
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  pattern: string = "dd MMMM yyyy HH:mm:ss"
): string => {
  const zonedDate = toZonedTime(new Date(date), timezone);
  return format(zonedDate, pattern);
};
