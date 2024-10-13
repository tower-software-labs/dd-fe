import { DataroomItem } from "./dataroom"
import { Citation } from "./document"

export interface Message {
  sender: "ai" | "user"
  content: string
  citations?: Citation[]
  referenceItems?: DataroomItem[]
}
