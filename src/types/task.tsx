import { User } from "./user"

export type TaskState = "Not Applicable" | "To Be Provided" | "Provided" | null

export interface Task {
  id: string
  title: string
  description: string
  state: TaskState
  assignee: User | null
  verified: boolean
}

export interface Section {
  id: string
  title: string
  tasks: Task[]
}
