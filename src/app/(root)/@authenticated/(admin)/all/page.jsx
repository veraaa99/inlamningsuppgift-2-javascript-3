import { Header } from "@/components/header"
import { AllUsersTasksList } from "./_components/all-users-tasks-list"

function AllTasksPage() {
  return (
    <>
      <h2 className="text-center text-4xl mb-10 font-light">All schedules</h2>
      <Header />
      <div className="mt-10 flex gap-3 overflow-auto pb-10">
        <AllUsersTasksList />
      </div>
    </>
  )
}
export default AllTasksPage