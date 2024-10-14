"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { initialSections } from "@/app/sample-data/tasks"
import AddTaskForm from "@/components/add-task-form"
import {
  addNewTaskProps,
  RequestListTableHeader,
  RequestListTaskRow,
} from "@/components/request-list-table"
import SelectUserPopover from "@/components/select-user-popover"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { Section, Task } from "@/types/task"

const columnWidths = {
  taskName: "w-1/2",
  state: "w-1/12",
  assignee: "w-1/12",
  taskState: "w-1/12",
  button: "w-1/12",
}

export default function DueDiligenceDashboard({
  params,
}: {
  params: { slug: string }
}) {
  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null)
  const { setBreadcrumbs } = useBreadcrumbs()
  const { setProjectId } = useProject()

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
    ])
    setProjectId(params.slug)

    setSections(initialSections)
    setExpandedSections(initialSections.map((section) => section.id))
  }, [setBreadcrumbs])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    )
  }

  function updateTask(taskId: string, field: keyof Task, value: any): void {
    const sectionId = taskId.split(".")[0]
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task,
              ),
            }
          : section,
      ),
    )
  }

  function toggleAssigneeEdit(taskId: string) {
    setEditingAssignee(editingAssignee === taskId ? null : taskId)
  }

  function addNewSection() {
    const newSectionId = (
      parseInt(sections[sections.length - 1].id) + 1
    ).toString()
    const newSection: Section = {
      id: newSectionId,
      title: `New Section ${newSectionId}`,
      tasks: [],
    }
    setSections([...sections, newSection])
    setExpandedSections([...expandedSections, newSectionId])
  }

  function addNewTask({
    sectionId,
    description,
    title,
    assignee,
    parentTaskId,
  }: addNewTaskProps) {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          let newTaskId: string
          if (parentTaskId) {
            // Adding a subtask
            const parentTask = section.tasks.find(
              (task) => task.id === parentTaskId,
            )
            if (parentTask) {
              const subtaskCount = section.tasks.filter(
                (task) => task.parentTaskId === parentTaskId,
              ).length
              newTaskId = `${parentTaskId}.${subtaskCount + 1}`
            } else {
              // If parent task not found, fallback to adding a regular task
              newTaskId = `${sectionId}.${section.tasks.length + 1}`
            }
          } else {
            // Adding a regular task
            newTaskId = `${sectionId}.${section.tasks.length + 1}`
          }

          const newTask: Task = {
            id: newTaskId,
            title: title,
            description: description,
            state: null,
            assignee: assignee,
            stakeholderStatus: "buyside",
            parentTaskId: parentTaskId || undefined,
          }
          return { ...section, tasks: [...section.tasks, newTask] }
        }
        return section
      }),
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Due Diligence Request List</h1>
        <Button onClick={addNewSection}>
          <Plus className="mr-2 h-4 w-4" /> Add New Section
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <RequestListTableHeader />
          <TableBody>
            {sections.map((section) => (
              <>
                <TableRow
                  key={section.id}
                  className="bg-slate-50 hover:bg-slate-100 cursor-pointer w-full"
                >
                  <TableCell colSpan={4}>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center text-sm font-semibold"
                        onClick={() => toggleSection(section.id)}
                      >
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="mr-2 h-4 w-4" />
                        ) : (
                          <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        <span className="pr-2 font-mono font-bold">
                          {section.id}
                        </span>
                        {section.title}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <SelectUserPopover
                      selectedUserId={null}
                      setSelectedUserId={(value: string | null) => {}} // TODO: Implement
                    />
                  </TableCell>
                  <TableCell colSpan={2}>
                    <div className="flex items-center justify-end">
                      <AddTaskForm
                        sectionId={section.id}
                        previousTaskId={
                          section.tasks[section.tasks.length - 1]?.id
                        }
                        onSave={(newTask) => {
                          addNewTask({
                            sectionId: section.id,
                            description: newTask.description,
                            title: newTask.title,
                            assignee: newTask.assignee,
                          })
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
                {expandedSections.includes(section.id) &&
                  section.tasks.map((task) => (
                    <RequestListTaskRow
                      task={task}
                      updateTask={updateTask}
                      addNewTask={addNewTask}
                    />
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
