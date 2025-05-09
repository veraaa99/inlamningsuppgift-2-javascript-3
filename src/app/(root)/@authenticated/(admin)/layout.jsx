"use client"

import { useAuth } from "@/context/authContext"

function AdminLayout({ children }) {

    const { isAdmin } = useAuth()

  return (
    <>
        { children }
    </>
  )
}
export default AdminLayout