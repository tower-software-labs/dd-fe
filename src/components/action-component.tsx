import UserAvatar from "@/components/user-avatar"
import { Action } from "@/types/action"

export interface ActionComponentProps {
  action: Action
}

export function ActionComponent({ action }: ActionComponentProps) {
  return (
    <div className="flex flex-row">
      <UserAvatar user={action.user} size="sm" showFullName />
      <span className="text-sm text-slate-500">{action.description}</span>
      <span className="text-sm text-slate-500">{action.createdAt}</span>
    </div>
  )
}
