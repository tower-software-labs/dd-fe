import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocumentData } from "@/types/document"
import { Loader2, Send, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  sender: "ai" | "user"
  content: string
}

const initialMessages: Message[] = [
  {
    sender: "ai",
    content:
      "Hi, I'm Clausy - your AI legal assistant. I can help you review and summarize data room documents. How can I help?",
  },
]

export interface AIAssistantChatProps {
  onClose: () => void
  searchableDocuments: DocumentData[] // Add this prop to receive the document URL
}

export default function AIAssistantChat({
  onClose,
  searchableDocuments = [],
}: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { sender: "user", content: input }
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold">Clausy AI</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-grow mb-4 px-2 w-full" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[80%]">
                <span
                  className={`text-xs mb-1 mx-1 text-gray-500 ${message.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {message.sender === "user" ? "You" : "Clausy AI"}
                </span>
                <div
                  className={`flex rounded-md p-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground text-right"
                      : "bg-muted text-left justify-start"
                  }`}
                >
                  <p
                    className={`text-sm ${message.sender === "user" ? "ml-auto" : ""}`}
                  >
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Clausy is thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
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
