import { HighlightArea } from "@react-pdf-viewer/highlight"

export interface Note {
  id: number
  header: string
  body: string
  highlightAreas: HighlightArea[]
}

export interface DocumentData {
  id: string
  name: string
  summary: string
  stateOfCause: string
  url: string
  notes: Note[]
  issues: Note[]
  createdAt: string
  updatedAt: string
}
