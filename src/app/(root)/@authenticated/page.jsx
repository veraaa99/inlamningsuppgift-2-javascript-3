"use client"

import { Header } from "@/components/header"
import { TaskColumn } from "@/components/tasks/task-column"
import { useAuth } from "@/context/authContext"

import { isValid, parse } from "date-fns"
import { useSearchParams } from "next/navigation"

function HomePage() {

  // TODO: Gör detta till en hook istället
  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const parsed = date
      ? parse(date, "yyyy-MM-dd", new Date())
      : new Date()
  const selectedDate = isValid(parsed) ? parsed : new Date()

  const { user } = useAuth()
  
  return (
    <>
      <Header />
      <div>
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}
export default HomePage