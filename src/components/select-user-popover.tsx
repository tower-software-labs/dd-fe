"use client"

import { users } from "@/app/sample-data/users"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import UserAvatar from "@/components/user-avatar"
import { getUserDisplayString } from "@/helpers/user-utils"
import { cn } from "@/lib/utils"
import { User } from "@/types/user"
import { CommandList } from "cmdk"
import { Check, UserRoundPlus } from "lucide-react"
import { useState } from "react"

export interface SelectUserPopoverProps {
  selectedUser: User | null
  setSelectedUser: (value: User | null) => void
  showTextInTrigger?: boolean
  size?: "sm" | "md" | "lg"
  iconColor?: string
}

export default function SelectUserPopover({
  selectedUser,
  setSelectedUser,
  showTextInTrigger = false,
  size = "md",
  iconColor = "text-slate-200",
}: SelectUserPopoverProps) {
  const [open, setOpen] = useState(false)

  const iconSize = size === "sm" ? 4 : size === "md" ? 6 : 8

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={showTextInTrigger ? "default" : "icon"}>
          {selectedUser ? (
            <UserAvatar
              user={selectedUser}
              showFullName={showTextInTrigger}
              size={size}
            />
          ) : (
            <div className="flex items-center gap-x-2">
              <UserRoundPlus
                className={`h-${iconSize} w-${iconSize} ${iconColor}`}
              />
              {showTextInTrigger && (
                <span className="text-base text-slate-600">
                  Select Assignee
                </span>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    if (selectedUser?.id === currentValue) {
                      setSelectedUser(null)
                    } else {
                      setSelectedUser(
                        users.find((user) => user.id === currentValue) || null,
                      )
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser?.id === user.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {getUserDisplayString(user)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
