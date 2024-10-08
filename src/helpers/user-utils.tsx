import { User } from "@/types/user"

export function getUserDisplayString(user: User) {
  if (user.first_name) {
    return `${user.first_name} ${user.last_name}`.trim()
  }
  return user.email
}

export function getUserInitialsString(user: User) {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.trim().toUpperCase()
  }
  return user.email.slice(0, 2).toUpperCase()
}
