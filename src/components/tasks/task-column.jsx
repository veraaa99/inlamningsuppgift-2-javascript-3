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

  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col", className)}>
        <TaskProgress total={tasks.length} user={user} completed={tasks.length - notCompleted.length} className="mb-5"/>
        {
          isAdmin && (
            <div className="flex items-center justify-between mb-5">
              <span className="font-medium">Sortera</span>
              <Switch 
              checked={isReordering}
              onCheckedChange={handleCheckChange}
              />
            </div>
          )
        }
        {/* Admin switch */}
        <div className="flex-1">
          {
            isReordering
            ? <TaskReorder tasks={localTasks} setTasks={setLocalTasks} movedTasks={movedTasks} />
            : <TaskList tasks={notCompleted} handleComplete={handleComplete}/>
          }
        </div>
        {/* admin? Add btn */}
    </div>
  )
}