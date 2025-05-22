"use client"

import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./authContext"
import { db } from "@/lib/firebase"
import { format } from "date-fns"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([])
    const { isAdmin, authLoaded, user } = useAuth()

    useEffect(() => {
      if(!authLoaded || !user) return

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
        const updatedTasks = querySnap.docs.map(doc => ({
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

    const saveReorder = async (orderedTasks, moved) => {
        setLoading(true)

        const prevTasks = tasks

        setTasks(orderedTasks)

        const batch = writeBatch(db)

        moved.forEach(({ id, newOrder }) => {
            batch.update(doc(db, "tasks", id), { order: newOrder })
        })

        try {
            await batch.commit()
        } catch (error) {
            console.error("Batch error", error)
            setTasks(prevTasks)
        } finally {
            setLoading(false)
        }
    }

    const getTasksByUserForDate = (uid, dateObj) => {

        const iso = useMemo(() => format(dateObj, "yyyy-MM-dd"), [dateObj])
        return useMemo(() => {
            return tasks.filter(task => task.ownerId === uid && task.date === iso)
            .sort((a, b) => a.order - b.order)
        }, [tasks, uid, iso])
    }

    const completeTask = async (taskId) => {
        setLoading(true)
        try {
            const taskRef = doc(db, "tasks", taskId)
            await updateDoc(taskRef, {
                completed: true
            })
        } catch (error) {
            console.error("Error when updating work task: ", error)
        } finally {
            setLoading(false)
        }
    }

    const values = {
        addTask,
        loading,
        tasks,
        getTasksByUserForDate,
        completeTask,
        saveReorder
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