import { HighlightArea } from "@react-pdf-viewer/highlight"

export interface Note {
  id: number
  header: string
  body: string
  highlightAreas: HighlightArea[]
}

export interface Document {
  id: string
  name: string
  url: string
  notes: Note[]
  createdAt: string
  updatedAt: string
}
