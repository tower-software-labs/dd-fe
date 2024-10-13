"use client"
import { Button } from "@/components/ui/button"
import { Citation } from "@/types/document"
import { FileText } from "lucide-react"
import React from "react"

export interface ChatMessageProps {
  sender: "ai" | "user"
  content: string
  citations?: Citation[]
  onCitationClick?: (citation: Citation) => void
}

export default function ChatMessage({
  sender,
  content,
  citations = [],
  onCitationClick,
}: ChatMessageProps) {
  const renderContent = () => {
    if (citations.length === 0) return content

    const parts = content.split(/\[citation\]/)
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < citations.length && (
          <Button
            variant="link"
            size="sm"
            className="px-1 py-0 h-auto font-normal text-blue-500 hover:text-blue-700"
            onClick={() => onCitationClick && onCitationClick(citations[index])}
          >
            <FileText className="w-3 h-3 mr-1" />[{citations[index].fileName}:
            {citations[index].highlightAreas[0].pageIndex}]
          </Button>
        )}
      </React.Fragment>
    ))
  }

  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex flex-col max-w-[80%] ${sender === "user" ? "items-end" : "items-start"}`}
      >
        <span className="text-xs mb-1 text-gray-500">
          {sender === "user" ? "You" : "Clausy AI"}
        </span>
        <div
          className={`rounded-lg p-3 ${
            sender === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{renderContent()}</p>
        </div>
      </div>
    </div>
  )
}
