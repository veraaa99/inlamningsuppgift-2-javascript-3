import { AddTaskForm } from "../../../add/_components/add-task-form"
import { Modal } from "./_components/modal"

function AddFormModalPage() {
  return (
    <Modal>
        <AddTaskForm isModal/>
    </Modal>
  )
}
export default AddFormModalPage