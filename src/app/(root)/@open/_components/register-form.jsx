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
    .nonempty({ message: "Please enter a username" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { messsage: "Username cannot be longer than 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().nonempty({ message: "Enter a password" })
    .min(6, {message: "Password must be at least 6 characters long"}),
    confirmPassword: z.string().nonempty({ message: "Confirm password" })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
        <h2 className="text-center font-semibold text-2xl mb-5">Register a new account</h2>
        { errorMessage && <p className="text-red-500 text-center">{ errorMessage }</p> }
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormDescription>This will be your public name</FormDescription>
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
                    <FormLabel>Password</FormLabel>
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
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                        <Input type="password" className="not-dark:border-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <p>Already have an account? <span onClick={() => changeForm("login")} className="underline cursor-pointer">Login here</span></p>
                <Button disabled={loading} className="w-full sm:w-auto" type="submit">Create account</Button>
            </form>
        </Form>
    </>
  )
}