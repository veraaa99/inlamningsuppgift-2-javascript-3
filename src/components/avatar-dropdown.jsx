"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/authContext"
import Link from "next/link"
import { LogOutIcon, SettingsIcon } from "lucide-react"

export const AvatarDropdown = () => {

    const { user, logout, isAdmin } = useAuth()
    console.log(user.photoURL)

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar className="size-9 cursor-pointer">
                <AvatarImage src={user?.photoURL || ""} className="h-full w-full object-cover"/>
                <AvatarFallback className="bg-gray-700/30">{user?.displayName?.slice(0,2).toUpperCase() || "TR"}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
            {
                isAdmin() && (
                    <>
                        <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                            <Link href="/all" className="flex items-center gap-2 text-xl md:text-base">
                                All
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer md:hidden">
                            <Link href="/add" className="flex items-center gap-2 text-xl md:text-base">
                                Add new work task
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="md:hidden"/>
                    </>
                )
            }

            <DropdownMenuItem asChild className="not-dark:hover:bg-gray-200 cursor-pointer">
                <Link href="/settings" className="flex items-center gap-2 text-xl md:text-base">
                    <SettingsIcon className="size-5 md:size-4"/>
                    Settings
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logout} className="not-dark:hover:bg-gray-200 cursor-pointer text-xl md:text-base">
                    <LogOutIcon className="size-5 md:size-4"/>
                    Logout
            </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
  )
}