import { Header } from "@/components/header"
import { AllUsersTasksList } from "./_components/all-users-tasks-list"

function AllTasksPage() {
  return (
    <>
      <h2 className="text-center text-2xl mb-5 font-bold">All schedules</h2>
      <Header />
      <div className="mt-10 flex gap-4 overflow-auto pb-20">
        <AllUsersTasksList />
      </div>
    </>
  )
}
export default AllTasksPage