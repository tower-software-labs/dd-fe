"use client"

import { folders } from "@/app/sample-data/dataroom"
import { tasks } from "@/app/sample-data/tasks"
import DataroomTable from "@/components/dataroom-table"
import {
  addNewTaskProps,
  RequestListTableHeader,
  RequestListTaskRow,
} from "@/components/request-list-table"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { Task, TaskState } from "@/types/task"
import { FolderClosed } from "lucide-react"
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
            <h1 className="text-2xl font-bold">
              {task?.title ? `${task.id} ${task?.title}` : "Task"}
            </h1>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-slate-500">
              {task?.description ?? "Description"}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <RadioGroup
            value={task?.state ?? undefined}
            onValueChange={(value) => updateTask("state", value as TaskState)}
            className="flex items-center space-x-6"
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
          <Textarea
            value={task?.sellsideComments ?? ""}
            onChange={(e) => updateTask("sellsideComments", e.target.value)}
          />
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
