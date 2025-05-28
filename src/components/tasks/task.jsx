"use client"
import { shade } from "@/utils/color"
import { isAfter } from "date-fns"
import { Circle, CircleCheck } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export const Task = ({ task, handleComplete, index, accentColor }) => {

  const deadline = new Date(task.deadline)
  const today = new Date()

  const deadlineHasPassed = isAfter(today, deadline)
  let bgColor = accentColor

  if(deadlineHasPassed) {
    bgColor = "#7c2d12"
  }

  return (
    <Delay delay={ 100 * index }>
      <motion.div 
        initial={{ opacity: 0, y: -100 }}
        transition={{
          y: { type: "spring", bounce: 0, duration: 0.5 },
          opacity: { duration: 0.4 }
        }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        key={task.id}
        className="p-4 bg-background rounded-lg cursor-pointer border-2"
        onClick={() => handleComplete(task)}
        style={{ backgroundColor: bgColor, borderColor: shade(bgColor, 50) }}
        >
          <div className="flex justify-between">
            <span className="text-xl font-medium">{task.title}</span>
            {
              task.completed 
              ? <CircleCheck className="self-center"></CircleCheck>
              : <Circle className="self-center"></Circle>
            }
          </div>
          <p className="text-sm font-bold mt-3">Deadline: </p>
          <p className="text-sm font-medium">{task.deadline}</p>
          {
            deadlineHasPassed && <p className="text-md font-light mt-5">Deadline has passed</p>
          }
      </motion.div>
    </Delay>
  )
}

export const Delay = ({ children, delay }) => {

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer) 
  }, [delay])
  
  if(!visible) return null

  return <>{ children }</>
}