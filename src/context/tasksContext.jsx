"use client"

import { createContext, useContext } from "react"

const TasksContext = createContext()

export const TasksProvider = ({ children }) => {

    const values = {

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