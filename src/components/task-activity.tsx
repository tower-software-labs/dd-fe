"use client"

import { clausyUser, sellsideUsers, users } from "@/app/sample-data/users"
import { ScrollArea } from "@/components/ui/scroll-area"
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { User } from "@/types/user"
import {
  CalendarClock,
  CheckCircle,
  Circle,
  File,
  FilePlus,
  MessageSquare,
  PlusCircle,
  Send,
  Sparkles,
} from "lucide-react"
import { Fragment } from "react"
import UserAvatar from "./user-avatar"

type ActivityType =
  | "created"
  | "sent"
  | "updated"
  | "commented"
  | "uploaded"
  | "verified"

type Activity = {
  id: string
  type: ActivityType
  user: User
  timestamp: string
  description: string
  details?: string
  files?: string[]
}

const activities: Activity[] = [
  {
    id: "3",
    type: "updated",
    user: sellsideUsers[1],
    timestamp: "2024-05-14T15:45:00Z",
    description: 'marked "Provided"',
    details:
      "We've uploaded all contractor agreements in the Employment Agreements folder.",
  },
  {
    id: "4",
    type: "uploaded",
    user: clausyUser,
    timestamp: "2024-05-18T10:30:00Z",
    description: "found relevant documents",
    files: [
      "John_Doe_Contractor_Agreement_2024.pdf",
      "Jane_Smith_Consulting_Contract_2023.docx",
      "TechConsult_LLC_Service_Agreement_2024.pdf",
      "Marketing_Specialist_Contract_2023.pdf",
      "Software_Developer_Freelance_Agreement_2024.docx",
    ],
  },
  {
    id: "5",
    type: "commented",
    user: users[0],
    timestamp: "2024-05-17T00:00:00Z",
    description: "commented",
    details:
      "<@Jane Smith> can you take a look at all of the french agreements here?",
  },
  {
    id: "6",
    type: "commented",
    user: users[1],
    timestamp: "2024-05-17T00:00:00Z",
    description: "commented",
    details: "<@John Doe> nothing abnormal with the french contracts.",
  },
  {
    id: "7",
    type: "verified",
    user: users[1],
    timestamp: "2024-05-17T00:00:00Z",
    description: "verified the documents",
  },
]

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "created":
      return <PlusCircle className="h-4 w-4" />
    case "sent":
      return <Send className="h-4 w-4" />
    case "updated":
      return <CalendarClock className="h-4 w-4" />
    case "commented":
      return <MessageSquare className="h-4 w-4" />
    case "uploaded":
      return <FilePlus className="h-4 w-4" />
    case "verified":
      return <CheckCircle className="h-4 w-4" />
  }
}

const formatUserTags = (text: string) => {
  const parts = text.split(/(<@.*?>)/g)
  return parts.map((part, index) => {
    if (part.startsWith("<@") && part.endsWith(">")) {
      return (
        <span key={index} className="font-bold text-blue-400 hover:underline">
          {part.slice(1, -1)}
        </span>
      )
    }
    return <Fragment key={index}>{part}</Fragment>
  })
}

export default function TaskActivity() {
  return (
    <ScrollArea className="h-[600px] pr-4">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="mb-1 items-start pb-2 last:mb-0 last:pb-0"
        >
          <div className="flex flex-col items-start justify-start">
            <div className="flex items-center gap-x-1">
              <span className="mr-4 text-slate-500">
                {getActivityIcon(activity.type)}
              </span>
              {activity.user.id === "clausy-ai-user" ? (
                <div className="flex items-center text-sm font-semibold text-blue-600">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>Clausy AI</span>
                </div>
              ) : (
                <UserAvatar user={activity.user} size="sm" showFullName />
              )}
              <span className="ml-1 text-sm text-slate-600">
                {activity.description}
              </span>
              <span className="text-sm text-muted-foreground/70 flex items-center">
                <Circle className="h-1 w-1 fill-current ml-0.5 mr-1.5" />
                {minimalLocalDateTime(activity.timestamp, "full")}
              </span>
            </div>

            {activity.details && (
              <div className="w-[94%] ml-8 mt-1 p-2 bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {formatUserTags(activity.details)}
                </p>
              </div>
            )}
            {activity.files && (
              <div className="w-[94%] ml-8 mt-1 p-2 bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-sm text-slate-600 font-semibold">
                  {activity.files.map((file) => (
                    <span key={file} className="flex items-center">
                      <File className="w-3 h-3 mr-1 flex-shrink-0" />
                      {file}
                    </span>
                  ))}
                </p>
              </div>
            )}
            {index < activities.length - 1 && <div className="h-4" />}
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}
