import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DataroomItem } from "@/types/dataroom"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import AIAssistantChat from "./ai-chat"

export interface AIAssistantPopoverProps {
  selectedDataroomItems: DataroomItem[]
}

export default function AIAssistantPopover({
  selectedDataroomItems,
}: AIAssistantPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
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
        <AIAssistantChat
          onClose={() => setIsOpen(false)}
          selectedDataroomItems={selectedDataroomItems}
        />
      </PopoverContent>
    </Popover>
  )
}
