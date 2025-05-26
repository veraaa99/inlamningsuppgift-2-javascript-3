"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useRouter } from "next/navigation"

export function Modal({ children }) {
  const [open, setOpen] = React.useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const router = useRouter()

  const handleOpenChange = (isOpen) => {
    router.back()
    setOpen(isOpen)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogHeader>
            <DialogTitle>Add work task</DialogTitle>
        </DialogHeader>
        <DialogContent className="sm:max-w-[425px]">
          { children }
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
     
      <DrawerContent>
        <DrawerHeader className="text-center text-xl">
          <DrawerTitle>Add work task</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto h-[80svh]">
            { children }
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}