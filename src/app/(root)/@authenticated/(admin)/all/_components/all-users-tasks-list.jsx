"use client"

import { TaskColumn } from "@/components/tasks/task-column"
import { useUsers } from "@/context/usersContext"
import { useDate } from "@/hooks/use-date"
import { useSearchParams } from "next/navigation"

export const AllUsersTasksList = () => {
    const searchParams = useSearchParams()
    const selectedDate = useDate(searchParams)

    const { users } = useUsers()

  return (
    <>
        {
          !!users.length && users.map(user => {
              if(user.verified){
                return <TaskColumn key={user.uid} date={selectedDate} user={user} className="w-72"/>
              }
          })
        }
    </>
  )
}