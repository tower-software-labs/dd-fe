"use client"

import AddTaskForm from "@/components/add-task-form"
import SelectUserPopover from "@/components/select-user-popover"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Task, TaskState } from "@/types/task"
import { User } from "@/types/user"
import {
  BellIcon,
  CheckCircle2,
  ChevronRight,
  CornerDownRight,
  HourglassIcon,
  ListTodo,
  Pencil,
} from "lucide-react"
import Link from "next/link"

const columnWidths = {
  taskName: "w-1/2",
  state: "w-1/12",
  assignee: "w-1/12",
  taskState: "w-1/12",
  button: "w-1/12",
}

function getStateIcon(state: string) {
  switch (state) {
    case "sellside":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HourglassIcon className="h-5 w-5 text-blue-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Waiting for Sellside review</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    case "buyside":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ListTodo className="h-5 w-5 text-orange-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Requires Buyside review</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    case "verified":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Verified</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    default:
      return null
  }
}
export interface addNewTaskProps {
  description: string
  title: string
  assignee: User | null
  parentTaskId?: string
  sectionId?: string
}

interface RequestListTaskRowProps {
  task: Task
  updateTask: (taskId: string, field: keyof Task, value: any) => void
  addNewTask: (props: addNewTaskProps) => void
}

export function RequestListTaskRow({
  task,
  updateTask,
  addNewTask,
}: RequestListTaskRowProps) {
  const sectionId = task.id.split(".")[0]
  const subTaskLevel = task.id.split(".").length - 2
  return (
    <TableRow key={task.id}>
      <TableCell className="font-medium">
        <div
          className={`flex flex-row items-start pl-${Math.max(
            subTaskLevel * 4,
            1,
          )}`}
        >
          {task.parentTaskId && (
            <div>
              <CornerDownRight className="h-4 w-4 mr-2 text-muted-foreground" />
            </div>
          )}
          <span className="pr-2 font-mono font-bold">{task.id}</span>
          <div className="flex flex-col">
            <span className="font-medium">{task.title}</span>
            <span className="text-sm text-muted-foreground pr-2">
              {task.description}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <RadioGroup
          value={task?.state ?? undefined}
          onValueChange={(value) =>
            updateTask(task.id, "state", value as TaskState)
          }
          className="flex items-center space-x-1"
        >
          <RadioGroupItem
            value="Not Applicable"
            id={`${task.id}-na`}
            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
        </RadioGroup>
      </TableCell>
      <TableCell>
        <RadioGroup
          value={task?.state ?? undefined}
          onValueChange={(value) =>
            updateTask(task.id, "state", value as TaskState)
          }
          className="flex items-center space-x-1"
        >
          <RadioGroupItem
            value="To Be Provided"
            id={`${task.id}-np`}
            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
        </RadioGroup>
      </TableCell>
      <TableCell>
        <RadioGroup
          value={task?.state ?? undefined}
          onValueChange={(value) =>
            updateTask(task.id, "state", value as TaskState)
          }
          className="flex items-center space-x-1"
        >
          <RadioGroupItem
            value="Provided"
            id={`${task.id}-p`}
            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
        </RadioGroup>
      </TableCell>
      <TableCell>
        <SelectUserPopover
          selectedUser={task.assignee ?? null}
          setSelectedUser={(value: User | null) =>
            updateTask(task.id, "assignee", value)
          }
        />
      </TableCell>
      <TableCell>{getStateIcon(task.stakeholderStatus)}</TableCell>
      <TableCell className="group relative">
        <div className="flex items-center justify-end h-full">
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <AddTaskForm
              onSave={(newTask) => {
                addNewTask({
                  sectionId: sectionId,
                  description: newTask.description,
                  title: newTask.title,
                  assignee: newTask.assignee,
                  parentTaskId: task.id,
                })
              }}
              sectionId={sectionId}
              previousTaskId={task.id}
              buttonType="supplemental"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Reminder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Link href={`/task/${task.id}`} passHref>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  )
}

interface RequestListTableHeaderProps {
  showAddTaskForm?: boolean
  sectionId?: string
  previousTaskId?: string
  onSave?: (task: Omit<Task, "id" | "state" | "verified">) => void
}
export function RequestListTableHeader({
  showAddTaskForm = false,
  sectionId = "",
  previousTaskId = "",
  onSave = () => {},
}: RequestListTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={columnWidths.taskName}>
          <span className="pl-2">Request</span>
        </TableHead>
        <TableHead className={columnWidths.state}>Not Applicable</TableHead>
        <TableHead className={columnWidths.state}>To Be Provided</TableHead>
        <TableHead className={columnWidths.state}>Provided</TableHead>
        <TableHead className={columnWidths.assignee}>Assignee</TableHead>
        <TableHead className={columnWidths.taskState}>Status</TableHead>
        <TableHead className={columnWidths.button}>
          {showAddTaskForm && (
            <AddTaskForm
              onSave={onSave}
              sectionId={sectionId}
              previousTaskId={previousTaskId}
            />
          )}
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
