"use client"

import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, where } from "firebase/firestore"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"
import { format } from "date-fns"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const { isAdmin, authLoaded, user } = useAuth()

    useEffect(() => {
      if(!authLoaded || user) return

      setLoading(true)

      let q

      if(isAdmin()) {
        q = query(
            collection(db, "tasks"), 
            orderBy("date"), 
            orderBy("order")
        )
      } else {
        q = query(
            collection(db, "tasks"),
            where("ownerId", "==", user.uid), 
            orderBy("date"), 
            orderBy("order")
        )
      }

      const unsub = onSnapshot(q, querySnap => {
        const updatedTasks = querySnap.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setTasks(updatedTasks)
        setLoading(false)
      })

      return () => unsub()

    }, [isAdmin])
    
    const getNextOrder = () => {
        if(!tasks.length) return 1000
        return Math.max(...tasks.map(task => task.order ?? 0), 0) + 1000

    }

    const addTask = async (taskData) => {

        if(!isAdmin()) return

        setLoading(true)

        try {
            const newTask = {
                ...taskData,
                date: format(taskData.date, "yyyy-MM-dd"),
                order: getNextOrder(),
                completed: false,
                createdAt: serverTimestamp()
            }

            await addDoc(collection(db, "tasks"), newTask)
            
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setLoading(false)
        }
        
    }

    const values = {
        addTask,
        loading,
        tasks
    }

    return (
        <TasksContext.Provider value={values}>
            { children }
        </TasksContext.Provider>
    )
}

export const useTasks = () => {
    const context = useContext(TasksContext)
    if(!context) {
        throw new Error("useTasks must be used inside an TasksProvider")
    }
    return context
}