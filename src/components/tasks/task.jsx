"use client"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

export const Task = ({ task, handleComplete, index }) => {
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
        onClick={() => handleComplete(task)}>
          <span className="text-xl font-medium">{task.title}</span>
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