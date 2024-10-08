import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  getUserDisplayString,
  getUserInitialsString,
} from "@/helpers/user-utils"
import { User } from "@/types/user"

interface UserAvatarProps {
  user: User
  className?: string
  showFullName?: boolean
}

export default function UserAvatarSmall({
  user,
  className = "",
  showFullName = false,
}: UserAvatarProps) {
  const userDisplayString = getUserDisplayString(user)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1.5 text-sm">
            <Avatar className="inline-block w-5 h-5">
              <AvatarImage src={user.avatar_url} alt={userDisplayString} />
              <AvatarFallback className="text-[9px]">
                {getUserInitialsString(user)}
              </AvatarFallback>
            </Avatar>
            {showFullName && (
              <span className={`font-medium ${className}`}>
                {userDisplayString}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col space-y-1">
          {!showFullName && userDisplayString}
          {user.title && <span>{user.title}</span>}
          {user.email && <span>{user.email}</span>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
