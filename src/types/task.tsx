import { User } from "./user"

export type TaskState = "Not Applicable" | "To Be Provided" | "Provided" | null

export type StakeholderStatus = "buyside" | "sellside" | "verified"
export interface Task {
  id: string
  title: string
  description: string
  state: TaskState
  assignee: User | null
  stakeholderStatus: StakeholderStatus
  parentTaskId?: string
  sellsideComments?: string
}

export interface Section {
  id: string
  title: string
  tasks: Task[]
}
