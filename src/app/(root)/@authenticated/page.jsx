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
      <h2 className="text-center text-2xl mb-5 font-bold">My schedule</h2>
      <Header />
      <div className="mt-10 pb-20">
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}
export default HomePage