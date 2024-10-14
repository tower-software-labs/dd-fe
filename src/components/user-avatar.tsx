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
import { UserIcon } from "lucide-react"

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
    sm: "w-6 h-6 text-[9px]",
    md: "w-8 h-8 text-xs",
    lg: "w-12 h-12 text-sm",
  }

  const badgeSizeClasses = {
    sm: "w-5 h-5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const avatarSizeClass = sizeClasses[size]
  const badgeSizeClass = badgeSizeClasses[size]
  const textSizeClass =
    size === "sm" ? "text-xs" : size === "md" ? "text-base" : "text-lg"
  const titleSizeClass =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex items-center gap-1.5 ${textSizeClass}`}>
            <div className="relative">
              <Avatar className={`inline-block ${avatarSizeClass}`}>
                <AvatarImage src={user.avatar_url} alt={userDisplayString} />
                <AvatarFallback>{getUserInitialsString(user)}</AvatarFallback>
              </Avatar>
              {user.is_sellside && (
                <div
                  className={`absolute -bottom-1.5 -right-1.5 ${badgeSizeClass} bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white`}
                >
                  <UserIcon className="w-3/4 h-3/4 text-primary-foreground" />
                </div>
              )}
            </div>
            {showFullName && (
              <div
                className={`flex flex-col items-start space-y-2 ${className}`}
              >
                <span className="font-medium text-left">
                  {userDisplayString}
                </span>
                {user.title && (
                  <span
                    className={`${titleSizeClass} text-slate-500 text-left`}
                  >
                    {user.title}
                  </span>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col space-y-1">
          {!showFullName && (
            <span className="font-semibold text-sm">{userDisplayString}</span>
          )}
          {!showFullName && user.title && <span>{user.title}</span>}
          {user.email && <span>{user.email}</span>}
          {user.is_sellside && <span className="font-semibold">Sellside</span>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
