"use client"

import { useAuth } from "@/context/authContext"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUsers } from "@/context/usersContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const UserRolesManager = () => {

    const { isAdmin } = useAuth()
    const { users, changeRole, loading } = useUsers()

    if(!isAdmin()) return null

  return (
    <div className="mt-15">
        <div className="mb-15"> 
            <p className="font-semibold text-lg text-center">Admin</p>
            <p className="text-sm text-muted-foreground">Change users' access roles</p>
        </div>
         <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Username</TableHead>
                <TableHead className="w-[100px] sm:w-auto">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!!users.length && users.map((user) => (
                <TableRow key={user.uid}>
                    <TableCell>
                        <p className="truncate w-[100px]">{user.displayName}</p>
                    </TableCell>
                    <TableCell>
                        <p className="truncate w-[100px] sm:w-auto">{user.email}</p>
                    </TableCell>
                    <TableCell>
                        <Badge className={ user.role === "admin" && "bg-blue-600 text-white" }>
                            { user.role === "admin" ? "Admin" : "Users"}
                        </Badge>
                    </TableCell>
                     <TableCell className="text-right">
                        <Button variant={ user.role === "admin" ? "destructive" : "default" } size="sm" disabled={ loading } onClick={() => changeRole(user.uid, user.role === "admin" ? "user" : "admin")}>
                            {
                                loading
                                ? "Loading..."
                                : user.role === "admin"
                                    ? "Remove admin"
                                    : "Promote to admin"
                            }
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}