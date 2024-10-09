import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import {
  highlightPlugin,
  RenderHighlightsProps,
  Trigger,
} from "@react-pdf-viewer/highlight"

import { Note } from "@/types/document"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"
import { Fragment } from "react"

interface PDFViewerProps {
  fileUrl: string
  notes: Note[]
}

export default function PDFViewer({ fileUrl, notes }: PDFViewerProps) {
  const renderHighlights = (props: RenderHighlightsProps) => {
    return (
      <div>
        {notes.map((note) => (
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

  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
    >
      <div className="flex h-full">
        <div className="w-1/3 px-4 border-r">
          <h1 className="text-2xl font-bold px-2 mb-4">Document Preview</h1>
          {notes.length === 0 && <p>No notes yet</p>}
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => jumpToHighlightArea(note.highlightAreas[0])}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <h3 className="font-bold">{note.header}</h3>
              <p className="text-sm text-gray-600">{note.body}</p>
            </div>
          ))}
        </div>
        <div className="w-2/3">
          <div className="h-full">
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance, highlightPluginInstance]}
            />
          </div>
        </div>
      </div>
    </Worker>
  )
}
