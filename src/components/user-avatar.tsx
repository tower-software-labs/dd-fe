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
  size?: "sm" | "md" | "lg"
}

export default function UserAvatar({
  user,
  className = "",
  showFullName = false,
  size = "sm",
}: UserAvatarProps) {
  const userDisplayString = getUserDisplayString(user)

  const sizeClasses = {
    sm: "w-5 h-5 text-[9px]",
    md: "w-8 h-8 text-xs",
    lg: "w-12 h-12 text-sm",
  }

  const avatarSizeClass = sizeClasses[size]
  const textSizeClass =
    size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex items-center gap-1.5 ${textSizeClass}`}>
            <Avatar className={`inline-block ${avatarSizeClass}`}>
              <AvatarImage src={user.avatar_url} alt={userDisplayString} />
              <AvatarFallback>{getUserInitialsString(user)}</AvatarFallback>
            </Avatar>
            {showFullName && (
              <span className={`font-medium ${className}`}>
                {userDisplayString}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col space-y-1">
          {!showFullName && (
            <span className="font-semibold text-sm">{userDisplayString}</span>
          )}
          {user.title && <span>{user.title}</span>}
          {user.email && <span>{user.email}</span>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
