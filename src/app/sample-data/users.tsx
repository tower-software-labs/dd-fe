import { User } from "@/types/user"

export const users: User[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    title: "Partner",
    avatar_url: "/placeholder.svg?height=40&width=40",
    is_sellside: false,
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    title: "Senior Associate",
    avatar_url: "/placeholder.svg?height=40&width=40",
    is_sellside: false,
  },
  {
    id: "3",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob.johnson@example.com",
    title: "Associate",
    avatar_url: "/placeholder.svg?height=40&width=40",
    is_sellside: false,
  },
]

export const sellsideUsers: User[] = [
  {
    id: "4",
    first_name: "Garry",
    last_name: "Anders",
    email: "garry.anders@example.com",
    title: "Partner",
    avatar_url: "/placeholder.svg?height=40&width=40",
    is_sellside: true,
  },
  {
    id: "5",
    first_name: "Walter",
    last_name: "White",
    email: "walter.white@example.com",
    title: "Senior Associate",
    avatar_url: "/placeholder.svg?height=40&width=40",
    is_sellside: true,
  },
]

export const clausyUser: User = {
  id: "clausy-ai-user",
  first_name: "Clausy",
  last_name: "AI",
  email: "",
  title: "AI Assistant",
  avatar_url: "/clausy-logo.svg",
}
