"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useEffect, useRef, useState } from "react"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
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

// const TASKS = [
//     {
//         id: 1,
//         title: "task 1",
//     },
//     {
//         id: 2,
//         title: "task 2",
//     },
//     {
//         id: 3,
//         title: "task 3",
//     },
//     {
//         id: 4,
//         title: "task 4",
//     }
// ]

export const TaskColumn = ({ user, date, className }) => {

    // const [tasks, setTasks] = useState([])

    // useEffect(() => {

    //     const getTasks = async() => {
    //         const querySnapshot = await getDocs(collection(db, "tasks"))
    //         const data = []
    //         querySnapshot.forEach(doc => {
    //             data.push({
    //                 id: doc.id,
    //                 ...doc.data()
    //             })
    //         })
    //         // const updatedTasks = querySnapshot.map(doc => ({
    //         // id: doc.id,
    //         // ...doc.data()
    //         // }))
    //         setTasks(data)
    //     }
    //     getTasks()
      
    // }, [])

    const [isReordering, setIsReordering] = useState(false)
    const [localTasks, setLocalTasks] = useState([])

    const movedTasks = useRef([])

    const { getTasksByUserForDate, completeTask, saveReorder } = useTasks()
    const { showConfetti } = useConfetti()

    const tasks = getTasksByUserForDate(user.uid, date)

    const notCompleted = tasks.filter(task => !task.completed)

    const { isAdmin } = useAuth()

    const handleComplete = async(task) => {
        completeTask(task.id)
        if(tasks.length > 0 && notCompleted.length === 1){
          showConfetti()
        }
    }

    const startReorder = () => {
      const deep = tasks
        .filter(t => !t.completed)
        .map(t => ({ ...t }))

        movedTasks.current = []
        setLocalTasks(deep)
    }

    const handleCheckChange = (checked) => {
      if(!checked) {
        const payload = movedTasks.current.filter(mt => {
          const original = localTasks.find(t => t.id === mt.id)
          return original && original.order !== mt.newOrder
        })
        
      if(payload.length > 0) {
        saveReorder(localTasks)
      }
      } else {
        startReorder()
      }
      setIsReordering(checked)
    }

    const bgColor = user.color ?? "#ffffff"
    const textColor = getReadableTextColor(bgColor)

    const columnStyle = user.color
    ? {
      backgroundColor: bgColor,
      color: textColor
    }
    : undefined

    const accentColor = 
      textColor === "#000000"
        ? shade(bgColor, -40)
        : shade(bgColor, 40)

    const accentColorIntense = 
      textColor === "#000000"
        ? shade(bgColor, -60)
        : shade(bgColor, 60)


  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col", className)}
    style={columnStyle}
    >
        <TaskProgress total={tasks.length} user={user} accentColor={accentColorIntense} completed={tasks.length - notCompleted.length} className="mb-5"/>
        {
          isAdmin && (
            <div className="flex items-center justify-between mb-5" style={{ "--track": accentColorIntense ?? "#99a1af" }}>
              <span className="font-medium">Sortera</span>
              <Switch 
              checked={isReordering}
              onCheckedChange={handleCheckChange}
              className="data-[state=unchecked]:bg-[color:var(--track)] dark:data-[state=unchecked]:bg-[color:var(--track)] border border-[color:var(--track)]"
              />
            </div>
          )
        }
        {/* Admin switch */}
        <div className="flex-1">
          {
            isReordering
            ? <TaskReorder tasks={localTasks} accentColor={accentColor} setTasks={setLocalTasks} movedTasks={movedTasks} />
            : <TaskList tasks={notCompleted} accentColor={accentColor} handleComplete={handleComplete}/>
          }
        </div>
        {
          isAdmin() && (
            <div className="flex items-center justify-center mt-6">
              <Button asChild
              variant="icon"
              className="border-4 border-primary rounded-full p-2 size-12 hover:bg-[color:var(--track)] hover:text-secondary transition-colors"
              style={{ borderColor: accentColorIntense, color: textColor, "--track": accentColor}}
              >
                <Link href={`/add?date=${format(date, "yyyy-MM-dd")}&userId=${user.uid}`} aria-label="Lägg till uppgift">
                  <PlusIcon className="size-5"/>
                </Link>
              </Button>
            </div>
          )
        }
    </div>
  )
}