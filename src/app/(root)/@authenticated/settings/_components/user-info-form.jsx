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

const formSchema = z.object({
    displayName: z.string()
        .nonempty({ message: "Please enter a username" })
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(50, { messsage: "Username cannot be longer than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" })
  })

export const UserInfoForm = ({ user }) => {

    const { updateUser, loading } = useAuth()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          displayName: user.displayName || "",
          email: user.email || ""
        },
    })

    function onSubmit(values) {
        const newUserData = {
            displayName: values.displayName
        }
        updateUser(user, newUserData)
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit" className="self-end">{ loading ? "Loading..." : "Change"}</Button>
      </form>
    </Form>
  )
}