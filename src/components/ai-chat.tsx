import ChatMessage from "@/components/ai-chat/chat-message"
import ThinkingAnimation from "@/components/ai-thinking-animation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/types/chat"
import { DataroomItem } from "@/types/dataroom"
import { Citation, DocumentData } from "@/types/document"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  Send,
  Sparkles,
  X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

const initialMessages: Message[] = [
  {
    sender: "ai",
    content:
      "Hi, I'm Clausy - your AI legal assistant. I can help you review and summarize data room documents. How can I help?",
  },
]

export interface AIAssistantChatProps {
  onClose: () => void
  searchableDocuments?: DocumentData[]
  closeButtonType?: "x" | "collapse"
  onCitationClick?: (citation: Citation) => void
  selectedDataroomItems?: DataroomItem[]
}

export default function AIAssistantChat({
  onClose,
  searchableDocuments = [],
  closeButtonType = "x",
  onCitationClick = (citation: Citation) => {},
  selectedDataroomItems = [],
}: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showChevron, setShowChevron] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        sender: "user",
        content: input,
        referenceItems: selectedDataroomItems,
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/document/[id]", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage: input,
            searchableDocuments: searchableDocuments,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get AI response")
        }

        const data = await response.json()
        const aiMessage: Message = { sender: "ai", content: data.response }
        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error("Error:", error)
        const errorMessage: Message = {
          sender: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const isScrollable =
          scrollContainerRef.current.scrollWidth >
          scrollContainerRef.current.clientWidth
        setShowChevron(isScrollable)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [selectedDataroomItems])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setShowChevron(scrollLeft < scrollWidth - clientWidth - 10) // 10px threshold
    }
  }

  function renderSelectedItems() {
    if (selectedDataroomItems.length === 0) {
      return null
    }

    return (
      <div className="w-full mb-2 relative">
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2"
          onScroll={handleScroll}
          onMouseEnter={() => setShowChevron(false)}
          onMouseLeave={() => setShowChevron(true)}
        >
          <div className="flex space-x-1.5 pr-4 whitespace-nowrap">
            {selectedDataroomItems.map((item, index) => (
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold">Clausy AI</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          {closeButtonType === "x" ? (
            <X className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow mb-4 pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              sender={message.sender}
              content={message.content}
              citations={message.citations}
              onCitationClick={onCitationClick}
              referenceItems={message.referenceItems}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-col max-w-[80%]">
                <span className="text-xs mb-1 mx-1 text-gray-500 text-left">
                  Clausy is thinking...
                </span>
                <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
                  <ThinkingAnimation isSingleDocument={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      {renderSelectedItems()}
      <div className="flex items-center space-x-2 mt-auto">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
          disabled={isLoading}
        />
        <Button size="icon" onClick={handleSend} disabled={isLoading}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
