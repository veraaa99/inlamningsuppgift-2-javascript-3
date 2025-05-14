"use client"

import { cn } from "@/lib/utils"

const TASKS = [
    {
        id: 1,
        title: "task 1",
    },
    {
        id: 2,
        title: "task 2",
    },
    {
        id: 3,
        title: "task 3",
    },
    {
        id: 4,
        title: "task 4",
    }
]

export const TaskColumn = ({ user, date, className }) => {

    

  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col", className)}>
        {/* TaskProgress */}
        {/* Admin switch */}
        <div className="flex-1">

        </div>
        {/* admin? Add btn */}
    </div>
  )
}