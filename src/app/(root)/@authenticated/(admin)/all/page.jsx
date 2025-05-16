import { Header } from "@/components/header"
import { AllUsersTasksList } from "./_components/all-users-tasks-list"

function AllTasksPage() {
  return (
    <>
      <Header />
      <div className="mt-10 flex gap-4 overflow-auto pb-20">
        <AllUsersTasksList />
      </div>
    </>
  )
}
export default AllTasksPage