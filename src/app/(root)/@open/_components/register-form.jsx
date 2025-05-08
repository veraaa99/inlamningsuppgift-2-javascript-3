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
import { useAuth } from "@/context/authContext"
import { getErrorMessage } from "@/lib/getFirebaseError"

export const registerFormSchema = z.object({
    displayName: z.string()
    .nonempty({ message: "Ange ett användarnamn" })
    .min(3, { message: "Användarnamnet måste vara minst 3 tecken långt" })
    .max(50, { messsage: "Användarnamnet får inte vara längre än 50 tecken" }),
    email: z.string().email({ message: "Ange en giltig epostadress" }),
    password: z.string().nonempty({ message: "Skriv in ett lösenord" })
    .min(6, {message: "Lösenorden måste vara minst 6 tecken långt"}),
    confirmPassword: z.string().nonempty({ message: "Bekräfta lösenordet" })
}).refine(data => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"]
})

export const RegisterForm = ({ changeForm, form }) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const { register, loading } = useAuth()

  async function onSubmit(values) {

    try {
        const { email, password, displayName } = values
        await register(email, password, displayName)
    } catch (err) {
        const errorMessage = getErrorMessage(err.code)
        setErrorMessage(errorMessage)
    }
    
  }

  return (
    <>
        <h2 className="text-center font-semibold text-2xl mb-5">Registera ett nytt konto</h2>
        { errorMessage && <p className="text-red-500 text-center">{ errorMessage }</p> }
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Användarnamn</FormLabel>
                    <FormControl>
                        <Input className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormDescription>Detta kommer vara ditt publika användarnamn på plattformen</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

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

                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Bekräfta lösenord</FormLabel>
                    <FormControl>
                        <Input type="password" className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <p>Har du redan ett konto? <span onClick={() => changeForm("login")} className="underline cursor-pointer">Logga in här</span></p>
                <Button disabled={loading} className="w-full sm:w-auto" type="submit">Skapa konto</Button>
            </form>
        </Form>
    </>
  )
}