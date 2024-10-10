import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import {
  highlightPlugin,
  RenderHighlightsProps,
  Trigger,
} from "@react-pdf-viewer/highlight"
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DocumentData } from "@/types/document"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"
import { Fragment, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

interface PDFViewerProps {
  document: DocumentData
  onClose: () => void
}

export default function PDFViewer({ document, onClose }: PDFViewerProps) {
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false)

  console.log("document", document)
  const renderHighlights = (props: RenderHighlightsProps) => {
    return (
      <div>
        {document.notes.map((note) => (
          <Fragment key={note.id}>
            {note.highlightAreas
              .filter((area) => area.pageIndex === props.pageIndex)
              .map((area, idx) => (
                <div
                  key={idx}
                  className="highlight-area"
                  style={Object.assign(
                    {},
                    {
                      background: "yellow",
                      opacity: 0.4,
                    },
                    props.getCssProperties(area, props.rotation),
                  )}
                />
              ))}
          </Fragment>
        ))}
      </div>
    )
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Bookmarks tab
      defaultTabs[1], // Thumbnails tab
    ],
  })

  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.None,
    renderHighlights,
  })

  const { jumpToHighlightArea } = highlightPluginInstance

  const toggleLeftColumn = () => {
    setIsLeftColumnCollapsed(!isLeftColumnCollapsed)
  }

  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
    >
      <div className="flex h-full relative">
        <div
          className={`${isLeftColumnCollapsed ? "w-auto" : "w-1/3"} transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex">
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLeftColumn}
                  className="ml-2 mr-4"
                >
                  {isLeftColumnCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {!isLeftColumnCollapsed && (
              <div className="flex-grow overflow-y-auto mr-4 space-y-6">
                <div className="flex flex-col px-2">
                  <div className="text-lg font-bold">{document.name}</div>
                  <div className="text-md px text-slate-500 mb-2">
                    {document.stateOfCause}
                  </div>
                  <div className="text-sm text-slate-500">
                    {document.summary}
                  </div>
                </div>
                {document.issues.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between font-semibold text-md p-2 mb-4"
                      >
                        Issues ({document.issues.length})
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-2">
                      {document.issues.map((issue) => (
                        <div
                          key={issue.id}
                          onClick={() =>
                            jumpToHighlightArea(issue.highlightAreas[0])
                          }
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        >
                          <div className="font-semibold text-sm">
                            {issue.header}
                          </div>
                          <div className="text-sm text-gray-600">
                            {issue.body}
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={`${isLeftColumnCollapsed ? "flex-grow" : "w-2/3"}`}>
          <div className="h-full">
            <Viewer
              fileUrl={document.url}
              plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
            />
          </div>
        </div>
      </div>
    </Worker>
  )
}
