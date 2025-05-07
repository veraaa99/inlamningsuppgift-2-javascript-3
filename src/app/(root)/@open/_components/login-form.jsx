"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { Input } from "@/components/ui/input"

export const loginFormSchema = z.object({
    email: z.string().email({ message: "Ange en giltig epostadress" }),
    password: z.string().nonempty({ message: "Skriv in ett lösenord" })
})

export const LoginForm = ({ changeForm, form }) => {

  const [errorMessage, setErrorMessage] = useState(null)

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
        <h2 className="text-center font-semibold text-2xl mb-5">Logga in</h2>
        { errorMessage && <p className="text-red-500 text-center">{ errorMessage }</p> }
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Lösenord</FormLabel>
                    <FormControl>
                        <Input type="password" className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <p>Har du inget konto? <span onClick={() => changeForm("register")} className="underline cursor-pointer">Registrera dig här</span></p>
                <Button type="submit">Logga in</Button>
            </form>
        </Form>
    </>
  )
}