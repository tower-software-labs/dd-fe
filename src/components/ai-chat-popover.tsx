import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PopoverClose } from "@radix-ui/react-popover"
import { MessageSquare, Send, Sparkles, X } from "lucide-react"
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
  {
    sender: "user",
    content: "Show me all contracts with different termination notice periods.",
  },
  {
    sender: "ai",
    content:
      "Certainly! I'll search for contracts with varying termination notice periods. Here's what I've found:\n\n1. Employment Agreement A: 30 days notice\n2. Vendor Contract B: 60 days notice\n3. Executive Employment Contract C: 90 days notice\n4. Service Agreement D: 45 days notice\n5. Consulting Contract E: 15 days notice\n\nAs you can see, there's quite a range in the notice periods. Would you like me to provide a more detailed analysis of these differences and their potential implications?",
  },
]

export default function AIAssistantPopover() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", content: input }])
      setInput("")
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: "I received your message. How can I help further?",
          },
        ])
      }, 1000)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white text-slate-600"
        >
          <MessageSquare className="h-4 w-4" />
          Chat with AI
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[70lvh] h-[60lvh] p-2 flex flex-col"
        align="end"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-slate-600" />
            <h3 className="font-semibold">Clausy AI</h3>
          </div>
          <PopoverClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </PopoverClose>
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
                    {message.sender === "user" ? "John Doe" : "Clausy AI"}
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
          </div>
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-auto">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
