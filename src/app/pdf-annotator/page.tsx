"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Viewer, Worker } from "@react-pdf-viewer/core"
import {
  HighlightArea,
  highlightPlugin,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"

export default function Page() {
  const [highlightAreas, setHighlightAreas] = useState<HighlightArea[]>([])
  const [documentUrl, setDocumentUrl] = useState<string>(
    "http://localhost:3000/contracts/Customer-Contract-1.pdf",
  )

  function renderHighlightTarget(props: RenderHighlightTargetProps) {
    if (
      JSON.stringify(highlightAreas) !== JSON.stringify(props.highlightAreas)
    ) {
      setHighlightAreas([...props.highlightAreas])
    }
    return (
      <div
        style={{
          background: "#eee",
          display: "flex",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          transform: "translate(0, 8px)",
        }}
      ></div>
    )
  }

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
  })

  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(highlightAreas, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100">
        <Input
          type="text"
          placeholder="Enter document URL"
          value={documentUrl}
          onChange={(e) => setDocumentUrl(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="flex flex-1">
        <div className="w-1/3 p-4 bg-gray-100 overflow-auto">
          <h2 className="text-lg font-bold mb-2">Highlight Coordinates:</h2>
          <div className="relative">
            <pre className="whitespace-pre-wrap bg-white p-4 rounded shadow-sm">
              {JSON.stringify(highlightAreas, null, 2)}
            </pre>
            <Button
              className="absolute top-2 right-2"
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>
        <div className="w-2/3">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={documentUrl} plugins={[highlightPluginInstance]} />
          </Worker>
        </div>
      </div>
    </div>
  )
}
