"use client"

import { Header } from "@/components/header"
import { TaskColumn } from "@/components/tasks/task-column"
import { useAuth } from "@/context/authContext"
import { useDate } from "@/hooks/use-date"
import { useSearchParams } from "next/navigation"

function HomePage() {

  const searchParams = useSearchParams()
  const selectedDate = useDate(searchParams)

  const { user } = useAuth()
  
  return (
    <>
      <Header />
      <div className="mt-10 pb-20">
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}
export default HomePage