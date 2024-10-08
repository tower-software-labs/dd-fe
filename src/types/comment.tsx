import { User } from "./user"

export interface Comment {
  id: string
  parentId?: string | null
  user: User
  text: string
  createdAt: string
  updatedAt: string
}
