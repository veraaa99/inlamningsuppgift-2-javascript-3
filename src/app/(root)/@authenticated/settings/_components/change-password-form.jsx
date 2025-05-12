"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/authContext"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    currentPassword: z.string().nonempty({ message: "Skriv in ditt nuvarande lösenord"}),
    newPassword: z.string().min(6, { message: "Minst 6 tecken krävs" }),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"]
  })

export const ChangePaswordForm = ({ className }) => {

    const { changePassword, loading, user } = useAuth()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        },
    })

    function onSubmit(values) {
        changePassword(values.currentPassword, values.newPassword)
    }

  return (
    <div className={cn("border p-4 rounded-2xl not-dark:border-gray-300", className)}>
        <h2 className="text-center font-semibold text-2xl mb-5">Byt lösenord</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
            
            <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nuvarande lösenord:</FormLabel>
                <FormControl>
                    <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nytt lösenord:</FormLabel>
                <FormControl>
                    <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bekräfta lösenord:</FormLabel>
                <FormControl>
                    <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button disabled={loading} type="submit" className="self-end">{ loading ? "Laddar..." : "Ändra"}</Button>
        </form>
        </Form>
    </div>

  )
}