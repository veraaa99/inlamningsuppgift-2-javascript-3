"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useRef, useState } from "react"
import { useTasks } from "@/context/tasksContext"
import { useAuth } from "@/context/authContext"
import { Switch } from "../ui/switch"
import { TaskProgress } from "./task-progress"
import { TaskReorder } from "./task-reorder"
import { useConfetti } from "@/context/confettiContext"
import { getReadableTextColor, shade } from "@/utils/color"
import { Button } from "../ui/button"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { format } from "date-fns"

export const TaskColumn = ({ user, date, className }) => {

    const [isReordering, setIsReordering] = useState(false)
    const [localTasks, setLocalTasks] = useState([])
    const [filterTasks, setFilterTasks] = useState()

    const movedTasks = useRef([])

    const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()
    const { showConfetti } = useConfetti()

    const tasks = getTasksByUserForDate(user.uid, date)

    // const notCompleted = tasks.filter(task => !task.completed)
    // const completed = tasks.filter(task => !task.completed)

    const notCompleted = tasks.filter(task => !task.completed).map(t => ({ ...t }))
    const completed = tasks.filter(task => task.completed).map(t => ({ ...t }))

    const { isAdmin } = useAuth()

    const handleComplete = async(task) => {
      completeTask(task.id)
      if(tasks.length > 0 && notCompleted.length === 1){
        showConfetti()
      }
    }

    const startReorder = () => {
      const deep = tasks.map(t => ({ ...t }))

      movedTasks.current = []
      setLocalTasks(deep)
      setIsReordering(true)
    }

    // const filtertasks = (tasksToFilter) => {
    //   setFilterTasks(tasksToFilter)
    // }

    // const filterCompleted = () => {
    //   const deep = tasks.filter(task => task.completed).map(t => ({ ...t }))

    //   setFilterTasks(deep)
    // }

    const handleCheckChange = (checked) => {
      if(!checked) {
        const payload = movedTasks.current.filter(mt => {
          const original = localTasks.find(t => t.id === mt.id)
          return original && original.order !== mt.newOrder
        })
        
      if(payload.length > 0) {
        saveReorder(localTasks, payload)
      }
      } else {
        startReorder()
      }
      setIsReordering(checked)
    }

    const bgColor = "#083344"
    const textColor = getReadableTextColor(bgColor)

    const columnStyle = {
      backgroundColor: bgColor,
      color: textColor
    }

    const accentColor = 
      textColor === "#000000"
        ? shade(bgColor, -40)
        : shade(bgColor, 40)

    const accentColorIntense = 
      textColor === "#000000"
        ? shade(bgColor, -60)
        : shade(bgColor, 60)


  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-lg flex flex-col", className)}
    style={columnStyle}
    >
        <TaskProgress total={tasks.length} user={user} accentColor={accentColorIntense} completed={tasks.length - notCompleted.length} className="mb-5"/>
        {
          isAdmin && (
            <div className="flex items-center justify-between mb-5" style={{ "--track": accentColorIntense ?? "#99a1af" }}>
              <span className="font-medium">Sort</span>
              <Switch 
              checked={isReordering}
              onCheckedChange={handleCheckChange}
              className="data-[state=unchecked]:bg-[color:var(--track)] dark:data-[state=unchecked]:bg-[color:var(--track)] border border-[color:var(--track)]"
              />
            </div>
          )
        }
        <div className="mb-5">
          <span className="font-medium">Filter</span>
          <div className="flex mt-2">
            <Button className="w-full" variant="outline" onClick={() => setFilterTasks(tasks)}>
            Show all
          </Button>
          </div>
          <div className="flex flex-row justify-between mt-2 xl:justify-around">
            <Button variant="outline" onClick={() => setFilterTasks(completed)}>
              Completed
            </Button>
            <Button variant="outline" onClick={() => setFilterTasks(notCompleted)}>
              Not completed
            </Button>
          </div>
        </div>
        <div className="flex-1">
          {
            isReordering
            ? <TaskReorder tasks={localTasks} accentColor={accentColor} setTasks={setLocalTasks} movedTasks={movedTasks} />
              : filterTasks
                ? <TaskList tasks={filterTasks} accentColor={accentColor} handleComplete={handleComplete}/>
                : <TaskList tasks={tasks} accentColor={accentColor} handleComplete={handleComplete}/>
          }
        </div>
        {
          isAdmin() && (
            <div className="flex items-center justify-center mt-6">
              <Button asChild
              variant="outline"
              className="border-2 border-primary rounded-lg size-10 hover:bg-[color:var(--track)] hover:text-secondary transition-colors"
              style={{ borderColor: accentColorIntense, color: textColor, "--track": accentColor}}
              >
                <Link href={`/add?date=${format(date, "yyyy-MM-dd")}&userId=${user.uid}`} aria-label="Add new work task">
                  <PlusIcon className="size-5"/>
                </Link>
              </Button>
            </div>
          )
        }
    </div>
  )
}