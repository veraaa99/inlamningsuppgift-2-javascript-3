"use client"
import { Circle, CircleCheck } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export const Task = ({ task, handleComplete, index, accentColor }) => {
  return (
    <Delay delay={ 100 * index }>
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        transition={{
          x: { type: "spring", bounce: 0, duration: 0.5 },
          opacity: { duration: 0.4 }
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        key={task.id}
        className="p-4 shadow-sm bg-background rounded-lg cursor-pointer"
        onClick={() => handleComplete(task)}
        style={{ backgroundColor: accentColor }}
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