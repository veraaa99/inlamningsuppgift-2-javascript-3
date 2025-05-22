// TODO: 
// Städa upp kod
// Koppla till rätt databas
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useSearchParams } from "next/navigation"
import { eachDayOfInterval, eachHourOfInterval, eachMinuteOfInterval, getHours, getMinutes, parse, setHours, setMinutes } from "date-fns"
import { useState } from "react"
import { useUsers } from "@/context/usersContext"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { useTasks } from "@/context/tasksContext"

const base = z.object({
    title: z.string().nonempty({ message: "Titel på uppgift är obligatorisk" }),
    ownerId: z.string().nonempty({ message: "Du måste välja en användare" }),
})

// const single = base.extend({
//     reoccuring: z.literal("none"),
//     date: z.date()
// })

// const multiple = base.extend({
//     reoccuring: z.literal("multiple"),
//     dateMultiple: z.array(z.date()).min(1, "Välj minst ett datum"),
// })

const range = base.extend({
    // reoccuring: z.literal("range"),
    dateRange: z.object({
        from: z.date(),
        to: z.date()
    })
})

// const formSchema = z.discriminatedUnion("reoccuring", [
//     // single,
//     // multiple,
//     range
// ])

export const AddTaskForm = ({ isModal }) => {

    const searchParams = useSearchParams()
    const presetDate = searchParams.get("date")
    const [timeDeadline, setTimeDeadline] = useState("00:00");
    const presetUserId = searchParams.get("userId")

    const { users } = useUsers()
    const { addTask, loading } = useTasks()
    const [submitted, setSubmitted] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [selected, setSelected] = useState();


    const router = useRouter()

    const form = useForm({
        // resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            ownerId: presetUserId ?? "",
            // reoccuring: "none",
            date: presetDate ? parse(presetDate, "yyyy-MM-dd", new Date()) ?? new Date() : new Date(),
            timeRange: timeDeadline,
            deadline: ""
        },
    })

    // https://daypicker.dev/guides/timepicker
    const handleTimeChange = (e) => {
    const time = e.target.value;
    console.log(time)
    // if (!selected) {
    //   setTimeDeadline(time);
    //   return;
    // }
   
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
    setTimeDeadline(time);
    setSelected(newSelectedDate);
    console.log(timeDeadline)

    form.setValue("timeRange", timeDeadline)

  };

    // const reoccuringType = form.watch("reoccuring")
    // const reoccuringType = "range"

    async function onSubmit(values) {

      const test = new Date().toLocaleDateString( values.dateRange.to )
      const deadline = (test + ' ' + values.timeRange)

        const base = {
            title: values.title,
            ownerId: values.ownerId,
            timeRange: values.timeRange,
            deadline: deadline
        }

        try {
          setSubmitted(true)

          // if(values.reoccuring === "none") {
          //   await addTask({ ...base, dateDeadl: values.date })
          // }
          // if(values.reoccuring === "multiple") {
          //   await Promise.all(
          //     values.dateMultiple.map(d => addTask({ ...base, date: d }))
          //   )
          // }
          // if(values.reoccuring === "range") {
            const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to })
            const time = values.timeRange

            console.log(time)

            await Promise.all(
              days.map(d => addTask({ ...base, date: d }))
            )
          // }

          form.reset()
          if(!isModal)
            router.push("/")
          else
            router.back()

        } catch (error) {
            console.error(error)
            setErrorMessage("Something went wrong, please try again.")
            setSubmitted(false)
        }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work task</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assign to</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-52 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find(
                            (user) => user.uid === field.value
                          )?.displayName
                        : "Select a user"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search user..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.displayName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid)
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
{/* 
        <FormField
          control={form.control}
          name="reoccuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upprepning</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="Välj upprepning" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ingen</SelectItem>
                  <SelectItem value="multiple">Flera dagar</SelectItem>
                  <SelectItem value="range">Från - Till</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                { reoccuringType === "none" && "Välj hur ofta uppgiften ska upprepas. Väljer du 'ingen' så är det engångsuppgift." }
                { reoccuringType === "multiple" && "Välj flera dagar som du vill ha uppgiften på." }
                Välj ett start- och slutdatum för uppgiften. Uppgiften kommer at upprepas varje dag mellan dessa datum.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}


        {/* {
            reoccuringType === "none" && 
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                        <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        />
                    <FormMessage />
                    </FormItem>
                )}
            />
        }

        {
            reoccuringType === "multiple" && 
            <FormField
                control={form.control}
                name="dateMultiple"
                render={({ field }) => (
                    <FormItem>
                        <Calendar
                        mode="multiple"
                        selected={field.value}
                        onSelect={field.onChange}
                        />
                    <FormMessage />
                    </FormItem>
                )}
            />
        } */}

                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Select date range</FormLabel>
                            <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            />
                        <FormMessage />
                        </FormItem>
                    )}
                />
        
          <FormField
                    control={form.control}
                    name="timeRange"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Select deadline:</FormLabel>
                            <input type="time"
                             value={field.value} 
                             onChange={field.onChange}
                             />
                        <FormMessage />
                        </FormItem>
                    )}
                />
        

        { errorMessage && <p className="text-red-500 text-sm">{ errorMessage }</p>}
        <Button disabled={ loading || submitted } type="submit">{ loading ? "Creating work task..." : "Create work task" }</Button>
      </form>
    </Form>
  )
}