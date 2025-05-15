"use client"

import { cn } from "@/lib/utils"
import { TaskList } from "./task-list"
import { useEffect, useState } from "react"
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTasks } from "@/context/tasksContext"

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

    const { getTasksByUserForDate, completeTask } = useTasks()

    const tasks = getTasksByUserForDate(user.uid, date)

    const notCompleted = tasks.filter(task => !task.completed)

    const handleComplete = async(task) => {
        completeTask(task.id)
    }

  return (
    <div className={cn("bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col", className)}>
        {/* TaskProgress */}
        {/* Admin switch */}
        <div className="flex-1">
            <TaskList tasks={notCompleted} handleComplete={handleComplete}/>
        </div>
        {/* admin? Add btn */}
    </div>
  )
}