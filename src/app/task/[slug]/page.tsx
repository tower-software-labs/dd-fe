"use client"

import { folders } from "@/app/sample-data/dataroom"
import { tasks } from "@/app/sample-data/tasks"
import DataroomTable from "@/components/dataroom-table"
import {
  addNewTaskProps,
  RequestListTableHeader,
  RequestListTaskRow,
} from "@/components/request-list-table"
import SelectUserPopover from "@/components/select-user-popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { Task, TaskState } from "@/types/task"
import { BellIcon, FolderClosed, Pencil, Save } from "lucide-react"
import { useEffect, useState } from "react"

export interface TaskPageProps {
  params: {
    slug: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  const { setBreadcrumbs } = useBreadcrumbs()

  const [task, setTask] = useState<Task | null>(null)
  const [subtasks, setSubtasks] = useState<Task[]>([])

  const [isEditing, setIsEditing] = useState(false)

  function updateTask(field: keyof Task, value: any) {
    setTask((prevTask) => (prevTask ? { ...prevTask, [field]: value } : null))
  }

  function updateSubtask(taskId: string, field: keyof Task, value: any) {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === taskId ? { ...subtask, [field]: value } : subtask,
      ),
    )
  }

  function handleSave() {
    setIsEditing(false)
  }

  function addSubtask({ description, title, assignee }: addNewTaskProps) {
    if (!task) return
    const newTask: Task = {
      id: `${task.id}.${subtasks.length + 1}`,
      title: title,
      description: description,
      state: null,
      assignee: assignee,
      stakeholderStatus: "buyside",
      parentTaskId: task.id,
    }
    setSubtasks([...subtasks, newTask])
  }

  useEffect(() => {
    setTask(tasks.find((task) => task.id === params.slug) ?? null)
    setSubtasks(tasks.filter((task) => task.parentTaskId === params.slug))
  }, [params.slug])

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
      {
        href: `/task/${params.slug}`,
        label: task?.title ? `${task.id} ${task?.title}` : "Task",
      },
    ])
  }, [setBreadcrumbs, task])
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="space-y-8 border border-gray-200 p-6 rounded-lg">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-row items-center text-2xl font-bold w-full">
              <span className="font-mono mr-2">{task?.id}</span>
              {isEditing ? (
                <div className="flex-grow max-w-lg">
                  <Input
                    value={task?.title ?? ""}
                    onChange={(e) => updateTask("title", e.target.value)}
                    className="text-2xl font-bold max-w-lg"
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold">
                  <span>{task?.title ? task?.title : "Task"}</span>
                </h1>
              )}
              <div className="mt-2 ml-4">
                <SelectUserPopover
                  selectedUserId={task?.assignee?.id ?? null}
                  setSelectedUserId={(value: string | null) =>
                    updateTask("assignee", value)
                  }
                />
              </div>
            </div>
            <div className="flex space-x-2 w-fit">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                    >
                      {isEditing ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isEditing ? "Save" : "Edit"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="space-y-2">
            {isEditing ? (
              <Textarea
                value={task?.description ?? ""}
                onChange={(e) => updateTask("description", e.target.value)}
                className="text-sm text-slate-500 max-w-[80svh] min-h-[100px]"
              />
            ) : (
              <span className="text-sm text-slate-500">
                {task?.description ?? "Description"}
              </span>
            )}
          </div>
        </div>
        <div className="mb-6">
          <RadioGroup
            value={task?.state ?? undefined}
            onValueChange={(value) => updateTask("state", value as TaskState)}
            className="flex items-center space-x-6"
            disabled={!isEditing}
          >
            {["Not Applicable", "To Be Provided", "Provided"].map((status) => (
              <div key={status} className="flex items-center">
                <RadioGroupItem
                  value={status}
                  id={status}
                  className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                />
                <label htmlFor={status} className="ml-2">
                  {status}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Sellside Comments</h2>
          {isEditing ? (
            <Textarea
              value={task?.sellsideComments ?? ""}
              onChange={(e) => updateTask("sellsideComments", e.target.value)}
              className="w-full max-w-[80svh] min-h-[100px]"
            />
          ) : (
            <div className="border border-gray-200 rounded-md p-3 min-h-[100px] max-w-[80svh]">
              {task?.sellsideComments || "No comments"}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <span className="text-lg font-bold">Supplemental Requests</span>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <RequestListTableHeader
              showAddTaskForm={true}
              sectionId={task?.id ?? ""}
              previousTaskId={subtasks[subtasks.length - 1]?.id ?? ""}
              onSave={(newTask) => {
                addSubtask(newTask)
              }}
            />
            <TableBody>
              {subtasks.map((subtask) => (
                <RequestListTaskRow
                  key={subtask.id}
                  task={subtask}
                  updateTask={updateSubtask}
                  addNewTask={addSubtask}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Related Documents</span>
          <Button>
            <FolderClosed className="mr-2 h-4 w-4" />
            <span>Go to Document Folder</span>
          </Button>
        </div>
        <DataroomTable
          items={folders}
          selectedItems={[]}
          setSelectedItems={() => {}}
        />
      </div>
    </div>
  )
}
