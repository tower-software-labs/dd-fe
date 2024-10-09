import { User } from "./user"

export interface Action {
  id: string
  user: User
  description: string
  createdAt: string
}
