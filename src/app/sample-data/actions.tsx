import { Action } from "@/types/action"
import { users } from "./users"

export const actions: Action[] = [
  {
    id: "1",
    user: users[0],
    description: "created task",
    createdAt: "2 days ago",
  },
  {
    id: "1",
    user: users[1],
    description: "marked as not applicable",
    createdAt: "2 days ago",
  },
]
