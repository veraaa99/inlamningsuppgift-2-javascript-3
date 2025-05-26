import { isValid, parse } from "date-fns"

export function useDate( searchParams ) {
  
    const date = searchParams.get("date")
    const parsed = date
        ? parse(date, "yyyy-MM-dd", new Date())
        : new Date()
    const selectedDate = isValid(parsed) ? parsed : new Date()

    return selectedDate
}