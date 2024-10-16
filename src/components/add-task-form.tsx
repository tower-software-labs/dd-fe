import SelectUserPopover from "@/components/select-user-popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Task } from "@/types/task"
import { User } from "@/types/user"
import { CornerDownRight, Plus } from "lucide-react"
import { useState } from "react"

interface AddTaskFormProps {
  onSave: (task: Omit<Task, "id" | "state" | "verified">) => void
  sectionId: string
  previousTaskId: string
  buttonType?: "request" | "supplemental"
}

export default function AddTaskForm({
  onSave,
  sectionId,
  previousTaskId,
  buttonType = "request",
}: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    setTitle("")
    setDescription("")
    setAssignee(null)
  }

  const handleSave = (andAddAnother: boolean = false) => {
    const newTask: Task = {
      id: "",
      title,
      description,
      assignee,
      state: null,
      stakeholderStatus: "sellside",
    }
    onSave(newTask)
    if (andAddAnother) {
      setTitle("")
      setDescription("")
      setAssignee(null)
    } else {
      handleCancel()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {buttonType === "request" ? (
          <Button variant="outline" size="sm" onClick={handleButtonClick}>
            <Plus className="mr-2 h-4 w-4" /> Add Request
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleButtonClick}>
            <CornerDownRight className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end" sideOffset={5}>
        <div className="grid gap-4 space-y-2">
          <div className="grid gap-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter request title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter request description"
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <SelectUserPopover
                selectedUser={assignee ?? null}
                setSelectedUser={(user) => setAssignee(user)}
                showTextInTrigger
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={() => handleSave()}>Save</Button>
          </div>
          <Button onClick={() => handleSave(true)}>Save & Add Another</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
