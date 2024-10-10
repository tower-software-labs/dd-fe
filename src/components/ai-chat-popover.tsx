import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import AIAssistantChat from "./ai-chat"

export default function AIAssistantPopover() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
        <AIAssistantChat onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}
