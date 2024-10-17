import { User } from "./user"

export type Project = {
  id: string
  name: string
  description: string
  slug: string
  created: string
  client: string
  clientNumber: string
  users: User[]
  matterNumber: string
}
