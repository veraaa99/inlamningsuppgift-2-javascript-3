"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { eachDayOfInterval, parse } from "date-fns"
import { useState } from "react"
import { useUsers } from "@/context/usersContext"
import { Calendar } from "@/components/ui/calendar"
import { useTasks } from "@/context/tasksContext"
import { Button } from "@/components/ui/button"

const base = z.object({
    title: z.string().nonempty({ message: "Please enter a title for your work task" }),
    ownerId: z.string().nonempty({ message: "Please select a user" }),
    time: z.string(),
    deadline: z.string()
})

const single = base.extend({
    reoccuring: z.literal("none"),
    date: z.date()
})

const multiple = base.extend({
    reoccuring: z.literal("multiple"),
    dateMultiple: z.array(z.date()).min(1, "Please select at least one date"),
})

const range = base.extend({
    reoccuring: z.literal("range"),
    dateRange: z.object({
        from: z.date(),
        to: z.date()
    })
})

const formSchema = z.discriminatedUnion("reoccuring", [
    single,
    multiple,
    range
])

export const AddTaskForm = ({ isModal }) => {
  
  const searchParams = useSearchParams()
  const presetDate = searchParams.get("date")
  const presetTime = "00:00";
  const presetUserId = searchParams.get("userId")
  
  const { users } = useUsers()
  const { addTask, loading } = useTasks()
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        ownerId: presetUserId ?? "",
        reoccuring: "none",
        date: presetDate ? parse(presetDate, "yyyy-MM-dd", new Date()) ?? new Date() : new Date(),
        time: presetTime,
        deadline: ""
    },
  })

  const reoccuringType = form.watch("reoccuring")

  async function onSubmit(values) {

    const base = {
      title: values.title,
      ownerId: values.ownerId,
      time: values.time,
    }

    try {
      setSubmitted(true)

      if(values.reoccuring === "none") {
        const date = new Date(values.date)
        const dateString = date.toLocaleDateString()
        
        await addTask({ ...base, date: values.date, deadline: (dateString + ' ' + values.time)})
      }
      if(values.reoccuring === "multiple") {
        const lastDate = values.dateMultiple[values.dateMultiple.length - 1];

        const date = new Date(lastDate)
        const dateString = date.toLocaleDateString()

        await Promise.all(
          values.dateMultiple.map(d => addTask({ ...base, date: d, deadline: (dateString + ' ' + values.time)}))
        )
      }
      if(values.reoccuring === "range") {
        const days = eachDayOfInterval({ start: values.dateRange.from, end: values.dateRange.to })

        const date = new Date(values.dateRange.to)
        const dateString = date.toLocaleDateString()

        await Promise.all(
          days.map(d => addTask({ ...base, date: d, deadline: (dateString + ' ' + values.time)}))
        )
      }

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
                <Input className="w-80 md:w-full" {...field} />
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
                        "w-80 justify-between md:w-100",
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
                <PopoverContent className="w-80 p-0">
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reoccuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-80 md:w-100">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Once</SelectItem>
                  <SelectItem value="multiple">Multiple days</SelectItem>
                  <SelectItem value="range">From - To</SelectItem>
                </SelectContent>
              </Select>
              {/* <FormDescription>
                { reoccuringType === "none" && "Select the frequency of the work task. If you choose 'Once', the task will only be active during one selected date." }
                { reoccuringType === "multiple" && "Select multiple days for the task to be active" }
                { reoccuringType === "range" && "Select a start and an end date for the task. The task will be repeated every day between these two dates." }
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timepicker taken from: */}
        {/* https://daypicker.dev/guides/timepicker */}
        <FormField
          control={form.control}
          name="time"
          className="md:flex flex-inline"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Select deadline:</FormLabel>
                <input type="time"
                  value={field.value} 
                  onChange={field.onChange}
                  className="w-50 cursor-pointer"
                  />
              <FormMessage />
            </FormItem>
          )}
        />

        {
          reoccuringType === "none" && 
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Select date:</FormLabel>
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
                  <FormLabel>Select dates:</FormLabel>
                    <Calendar
                    mode="multiple"
                    selected={field.value}
                    onSelect={field.onChange}
                    />
                <FormMessage />
                </FormItem>
            )}
          />
        }
        {
          reoccuringType === "range" && 
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select dates:</FormLabel>
                    <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    />
                <FormMessage />
                </FormItem>
            )}
          />
        }
          
        { errorMessage && <p className="text-red-500 text-sm">{ errorMessage }</p>}
        <Button disabled={ loading || submitted } type="submit">{ loading ? "Creating work task..." : "Create work task" }</Button>
      </form>
    </Form>
  )
}