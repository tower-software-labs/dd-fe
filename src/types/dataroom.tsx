import { User } from "./user"

export type FlagType =
  | "expiration"
  | "page-missing"
  | "signature-missing"
  | "reference-missing"

export type FlagSubtype = "expired" | "expiring-soon" | null

export interface Flag {
  type: FlagType
  subtype: FlagSubtype
  affectedPages: number[]
}

export interface DataroomItem {
  id: string
  parentId?: string
  name: string
  type: "folder" | "file"
  alerts: string[]
  numSubfolders?: number
  numDocuments?: number
  newItems?: string
  createdAt: string
  updatedAt: string
  flags: Flag[]
  assignee?: User
}

export function createDataroomItem(
  item: Omit<DataroomItem, "flags"> & { flags?: Flag[] },
): DataroomItem {
  return {
    ...item,
    flags: [],
  }
}
