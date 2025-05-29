"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useEffect, useRef, useState } from "react"
import { useTasks } from "@/context/tasksContext"
import { useAuth } from "@/context/authContext"
import { Switch } from "../ui/switch"
import { TaskProgress } from "./task-progress"
import { TaskReorder } from "./task-reorder"
import { getReadableTextColor, shade } from "@/utils/color"
import { Button } from "../ui/button"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { useTheme } from "next-themes"

export const TaskColumn = ({ user, date, className }) => {

    const [isReordering, setIsReordering] = useState(false)
    const [localTasks, setLocalTasks] = useState([])
    const [filterTasks, setFilterTasks] = useState([])
    const [inactivateSort, setInactivateSort] = useState(false)
    const [showEmptyList, setShowEmptyList] = useState(false)

    const movedTasks = useRef([])
    const { theme } = useTheme()

    useEffect(() => {
      showAllTasks()
    }, [date])

    const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()

    const tasks = getTasksByUserForDate(user.uid, date)

    let notCompleted = tasks.filter(task => !task.completed).map(t => ({ ...t }))
    let completed = tasks.filter(task => task.completed).map(t => ({ ...t }))

    const { isAdmin } = useAuth()

    const handleComplete = async(task) => {
      completeTask(task.id)
      if(tasks.length > 0 && notCompleted.length === 1){
        toast.success(`${user.displayName}: All tasks completed for the day!`)
      }
    }

    const startReorder = () => {
      const deep = tasks.map(t => ({ ...t }))

      movedTasks.current = []
      setLocalTasks(deep)
      setIsReordering(true)
      console.log(localTasks)
    }

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

    const filterCompletedTasks = () => {
      setInactivateSort(true)

      if(completed.length == 0){
        setFilterTasks([])
        setShowEmptyList(true)
        return
      }
      setFilterTasks(completed)
      setShowEmptyList(false)
    }

     const filterNotCompletedTasks = () => {
      setInactivateSort(true)

       if(notCompleted.length == 0){
        setFilterTasks([])
        setShowEmptyList(true)
        console.log(filterTasks)
        return
      }
      setFilterTasks(notCompleted)
      setShowEmptyList(false)
    }

     const showAllTasks = () => {
        setInactivateSort(false)        
        setFilterTasks([])
        setShowEmptyList(false)
        return
      }

    const bgColor = 
    theme == 'light'
    ? "#155e75"
    : "#083344"

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
          isAdmin && !inactivateSort
          ?
            <div className="flex items-center justify-between mb-5" style={{ "--track": accentColorIntense ?? "#99a1af" }}>
              <span className="font-medium">Sort</span>
              <Switch 
              checked={isReordering}
              onCheckedChange={handleCheckChange}
              className="data-[state=unchecked]:bg-[color:var(--track)] dark:data-[state=unchecked]:bg-[color:var(--track)] border border-[color:var(--track)]"
              />
            </div>
          :
          <div>
          </div>
        }
        <div className="mb-5">
          <span className="font-medium">Filter</span>
          <div className="flex mt-3">
            <Button className="w-full" variant="outline" style={{ backgroundColor: accentColor }} onClick={() => showAllTasks()}>
            Show all / Sort tasks
          </Button>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 mt-2 gap-2 mb-0">
            <Button className="sm:w-full" variant="outline" style={{ backgroundColor: accentColor }} onClick={() => filterCompletedTasks()}>
              Completed
            </Button>
            <Button className="sm:w-full" variant="outline" style={{ backgroundColor: accentColor }} onClick={() => filterNotCompletedTasks()}>
              Not completed
            </Button>
          </div>
        </div>
        <div className="flex-1">
          {
            isReordering 
            ? <TaskReorder tasks={localTasks} accentColor={accentColor} setTasks={setLocalTasks} movedTasks={movedTasks} />
            : filterTasks.length == 0 && showEmptyList
              ? <></>
              : filterTasks.length > 0
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
              style={{ borderColor: accentColorIntense, backgroundColor: accentColor, color: textColor, "--track": accentColor}}
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