"use client"

import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { Button } from "./ui/button"
import { AvatarDropdown } from "./avatar-dropdown"
import { useAuth } from "@/context/authContext"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"

const poppins = Poppins({
    subsets:["latin"],
    weight: ["700"]
})

export const Navbar = () => {

    const { isAdmin } = useAuth()
    const searchParams = useSearchParams()
    const date = searchParams.get("date")

    const today = new Date()
    const todayFormattedLong = format(today, "dd/MM/yyyy")
    const todayFormattedShort = format(today, "PPP")

  return (
    <nav className="flex items-center justify-between pb-10">
        <div className="">
            <h1 className="block sm:hidden sr-only">Workhandler</h1>
            <Link className={cn("text-3xl font-bold hidden sm:block xl:text-4xl", poppins.className)} href="/"><h1>Workhandler</h1></Link>
            <Link className={cn("text-4xl font-bold block sm:hidden", poppins.className)} href="/">W</Link>
            <div className="flex mt-1">
                <h2 className="font-bold block sm:hidden">{ todayFormattedLong }</h2>
                <h2 className="font-bold hidden sm:block">{ todayFormattedShort }</h2>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="lg">
                <Link href={`${date 
                    ? `/?date=${date}` 
                    : "/"
                }`
                    }>My schedule</Link>
            </Button>
            <span className="font-light hidden md:flex"> | </span>
            {
                isAdmin() && (
                    <>
                        <Button asChild variant="ghost" size="lg" className="hidden md:flex">
                            <Link href={`${
                                date
                                    ? `/all/?date=${date}`
                                    : "/all"
                            }`}>All</Link>
                        </Button>
                        <span className="font-light hidden md:flex"> | </span>
                        <Button asChild variant="ghost" size="lg" className="hidden md:flex">
                            <Link href="/add">Add new task</Link>
                        </Button>
                        <span className="font-light mr-4"> | </span>
                    </>
                )
            }
            <AvatarDropdown />
        </div>
        
    </nav>
  )
}