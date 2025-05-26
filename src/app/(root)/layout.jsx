"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/authContext"
import { Loader2Icon } from "lucide-react"
import { Toaster } from "react-hot-toast"

function ApplicationLayout({ authenticated, open }) {

  const { user, authLoaded, verifyEmail } = useAuth()

  if(!authLoaded) {
    return (
      <div className="flex items-center justify-center h-[90svh]">
        <Loader2Icon className="size-20 animate-spin"/>
      </div>
    )
  }

  return (
    <>
        {
            user === null
            ? open 
            : user.verified
              ? authenticated
              : (
                <div className="flex flex-col gap-4 items-center justify-center mt-50">
                  <h2 className="text-2xl font-bold">Verify your email address</h2>
                  <p>A verification link has been sent to your mail. Please check your inbox.</p>
                  <Button onClick={verifyEmail}>Send link again</Button>
                </div>
              )
        }
        <Toaster 
          position="top-center"
          reverseOrder={false}
        />
    </>
  )
}
export default ApplicationLayout