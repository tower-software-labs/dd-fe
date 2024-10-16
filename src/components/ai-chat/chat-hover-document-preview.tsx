import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { DocumentData } from "@/types/document"
import { ScrollMode, SpecialZoomLevel, Viewer } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import {
  HighlightArea,
  highlightPlugin,
  RenderHighlightsProps,
  Trigger,
} from "@react-pdf-viewer/highlight"
import "@react-pdf-viewer/highlight/lib/styles/index.css"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import { Button } from "../ui/button"

interface DocumentPreviewPopoverProps {
  document: DocumentData
  highlightAreas: HighlightArea[]
  buttonText?: string
}

export default function DocumentPreviewHoverCard({
  document,
  highlightAreas,
  buttonText = "Preview",
}: DocumentPreviewPopoverProps) {
  const renderHighlights = (props: RenderHighlightsProps) => {
    return (
      <div>
        {highlightAreas.map((area, idx) => (
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
      </div>
    )
  }

  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.None,
    renderHighlights,
  })

  const zoomPluginInstance = zoomPlugin()

  const { jumpToHighlightArea } = highlightPluginInstance

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal">
          {buttonText}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[600px] h-[400px] p-0 relative overflow-hidden">
        <div className="absolute inset-0 w-[110%] h-full left-1/2 -translate-x-1/2">
          <Viewer
            fileUrl={document.url}
            plugins={[highlightPluginInstance, zoomPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
            scrollMode={ScrollMode.Page}
            onDocumentLoad={(e) => {
              if (highlightAreas.length > 0) {
                jumpToHighlightArea(highlightAreas[0])
              }
            }}
          />
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          Page {highlightAreas.length > 0 ? highlightAreas[0].pageIndex + 1 : 1}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
