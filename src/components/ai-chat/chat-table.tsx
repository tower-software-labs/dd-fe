"use client"

import { sampleAIChatTableData } from "@/app/sample-data/ai-chat"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AIChatTableData } from "@/types/ai"
import { Worker } from "@react-pdf-viewer/core"
import { Download, ExternalLink } from "lucide-react"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import DocumentPreviewHoverCard from "./chat-hover-document-preview"

export default function AIChatTable() {
  const [tableData, setTableData] = useState<AIChatTableData>(
    sampleAIChatTableData,
  )
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Exporting table as Word document")
    // Implement actual export logic here
  }

  const handleExpand = () => {
    // Placeholder for expand functionality
    console.log("Expanding all rows")
    // Implement actual expand logic here
  }

  return (
    <div className="w-full max-w-[80svh] border p-2">
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{tableData.name}</h2>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleExport} size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export as Word document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleExpand} size="icon" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expand all rows</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agreement Name</TableHead>
                {tableData.columns.map((column) => (
                  <TableHead key={column.id}>{column.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      onClick={() =>
                        console.log(`View agreement: ${row.document.name}`)
                      }
                    >
                      {row.document.name}
                    </Button>
                  </TableCell>
                  {tableData.columns.map((column) => {
                    const cell = row.cells.find((c) => c.columnId === column.id)
                    return (
                      <TableCell key={column.id}>
                        {cell && (
                          <DocumentPreviewHoverCard
                            document={row.document}
                            highlightAreas={cell.highlightAreas}
                            buttonText={cell.value}
                          />
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {expandedRow !== null && (
            <div
              id={`expanded-content-${expandedRow}`}
              className="mt-4 p-4 bg-muted rounded-md"
              role="region"
              aria-label={`Expanded content for ${tableData.rows[expandedRow].document.name}`}
            >
              <h3 className="text-lg font-semibold mb-2">
                {tableData.rows[expandedRow].document.name} - Expanded View
              </h3>
              <p>
                This is where you would display more detailed information about
                the selected agreement. You can include additional clauses, full
                text of the agreement, or any other relevant details.
              </p>
            </div>
          )}
        </div>
      </Worker>
    </div>
  )
}
