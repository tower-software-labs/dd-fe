import { HighlightArea } from "@react-pdf-viewer/highlight"
import { DocumentData } from "./document"

export interface AISuggestedAction {
  id: string
  name: string
  description: string
}

export interface AIChatTableColumn {
  id: string
  name: string
}

export interface AIChatTableCell {
  columnId: string
  value: string
  highlightAreas: HighlightArea[]
}

export interface AIChatTableRow {
  document: DocumentData
  cells: AIChatTableCell[]
}

export interface AIChatTableData {
  name: string
  columns: AIChatTableColumn[]
  rows: AIChatTableRow[]
}
