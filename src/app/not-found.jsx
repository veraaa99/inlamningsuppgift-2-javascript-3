import { Button } from "@/components/ui/button"
import Link from "next/link"

function NotFound() {
  return (
    <div className="mt-[35svh] flex flex-col gap-8 items-center">
      <h1 className="text-2xl md:text-4xl text-center font-bold">404 - The page you were looking for could not be found</h1>
      <Button asChild>
          <Link href="/" replace>Return to home</Link>
      </Button>
    </div>
  )
}
export default NotFound