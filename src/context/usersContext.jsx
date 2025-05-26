"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./authContext"
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import toast from "react-hot-toast"

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const { isAdmin } = useAuth()

    useEffect(() => {
        if(!isAdmin()) return

        const q = query(collection(db, "users"))
        const unsub = onSnapshot(q, querySnapshot => {

            const usersData = []
            querySnapshot.forEach(doc => {
                usersData.push({ ...doc.data(), id: doc.id })
            })

            setUsers(usersData)
        })

        return () => unsub()
      
    }, [isAdmin])

    const changeRole = async (uid, role) => {
        if(!isAdmin()) {
            toast.error("Access denied")
            return
        }
        if(role !== "admin" && role !== "user"){
            toast.error("Invalid role given")
            return
        }

        const amountOfAdmins = users.filter(users => users.role === "admin").length
        if(amountOfAdmins <= 1 && role === "user") {
            toast.error("There must be at least one admin")
            return
        }

        setLoading(true)
        try {
            const useRef = doc(db, "users", uid)
            await updateDoc(useRef, { role })
            toast.success(`User has been changed to ${role} role`)
        } catch (error) {
            console.error("Error updating user role: ", error)
            toast.error("Something went wrong. Please try again")
        } finally {
            setLoading(false)
        }

    }

    const values = {
        users,
        loading,
        changeRole
    }

    return (
        <UsersContext.Provider value={values}>
            { children }
        </UsersContext.Provider>
    )
}

export const useUsers = () => {
    const context = useContext(UsersContext)
    if(!context) {
        throw new Error("useUsers must be used inside an UsersProvider")
    }
    return context
}