"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataroomItem } from "@/types/dataroom"
import { Citation } from "@/types/document"
import { ChevronRight, FileText, Folder } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export interface ChatMessageProps {
  sender: "ai" | "user"
  content: string
  citations?: Citation[]
  onCitationClick?: (citation: Citation) => void
  referenceItems?: DataroomItem[]
}

export default function ChatMessage({
  sender,
  content,
  citations = [],
  onCitationClick,
  referenceItems,
}: ChatMessageProps) {
  const [isScrollable, setIsScrollable] = useState(false)
  const [showChevron, setShowChevron] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const isScrollable =
          scrollContainerRef.current.scrollWidth >
          scrollContainerRef.current.clientWidth
        setIsScrollable(isScrollable)
        setShowChevron(isScrollable)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [referenceItems])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowChevron(scrollLeft < scrollWidth - clientWidth - 10) // 10px threshold
    }
  }

  function renderContent() {
    if (citations.length === 0) {
      return <p className="whitespace-pre-wrap">{content}</p>
    }

    const parts = content.split(/(\[citation\])/)
    return (
      <p className="whitespace-pre-wrap">
        {parts.map((part, index) => {
          if (part === "[citation]" && index < citations.length) {
            return (
              <Button
                key={index}
                variant="link"
                size="sm"
                className="px-1 py-0 h-auto font-normal text-blue-500 hover:text-blue-700"
                onClick={() =>
                  onCitationClick &&
                  onCitationClick(citations[Math.floor(index / 2)])
                }
              >
                <FileText className="w-3 h-3 mr-1" />[
                {citations[Math.floor(index / 2)].fileName}:
                {citations[Math.floor(index / 2)].highlightAreas[0].pageIndex}]
              </Button>
            )
          }
          return part
        })}
      </p>
    )
  }

  function renderSelectedItems() {
    if (!referenceItems || referenceItems.length === 0) {
      return null
    }

    return (
      <div className="w-full mt-2 relative">
        <div
          ref={scrollContainerRef}
          className={`overflow-x-auto ${isScrollable ? "pb-4" : ""}`}
          onScroll={handleScroll}
          onMouseEnter={() => setShowChevron(false)}
          onMouseLeave={() => setShowChevron(isScrollable)}
        >
          <div className="flex space-x-1.5 pr-4 whitespace-nowrap">
            {referenceItems.map((item, index) => (
              <Badge
                key={`item-${index}`}
                variant="outline"
                className="inline-flex items-center bg-white px-1 py-0"
              >
                {item.type === "folder" ? (
                  <Folder className="w-3 h-3 mr-1 flex-shrink-0" />
                ) : (
                  <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                )}
                {item.name}
              </Badge>
            ))}
          </div>
        </div>
        {showChevron && (
          <div className="absolute right-0 top-0 flex items-start pointer-events-none">
            <div className="bg-black rounded-full p-0.5 shadow-md border-2 border-white relative">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className="max-w-[80%]">
        <div
          className={`flex flex-col ${sender === "user" ? "items-end" : "items-start"}`}
        >
          <span className="text-xs mb-1 text-gray-500">
            {sender === "user" ? "You" : "Clausy AI"}
          </span>
          <div
            className={`w-full rounded-lg p-3 ${
              sender === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <div className="text-sm">{renderContent()}</div>
            {sender === "user" && renderSelectedItems()}
          </div>
        </div>
      </div>
    </div>
  )
}
