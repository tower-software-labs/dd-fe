import { DataroomItem } from "./dataroom"
import { Citation } from "./document"

export interface ChatSuggestedOption {
  id: string
  label: string
  tooltip: string
  multiple?: boolean
}

export interface Message {
  sender: "ai" | "user"
  content: string
  citations?: Citation[]
  referenceItems?: DataroomItem[]
  suggestedActions?: ChatSuggestedOption[]
  showWritingAnimation?: boolean
}
