"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, ChevronDown, ChevronRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { initialSections } from "@/app/sample-data/tasks"
import AddTaskForm from "@/components/add-task-form"
import SelectUserPopover from "@/components/select-user-popover"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { Section, Task, TaskState } from "@/types/task"
import { User } from "@/types/user"

const columnWidths = {
  taskName: "w-1/2",
  state: "w-1/12",
  assignee: "w-1/12",
  verified: "w-1/12",
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

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
    ])

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

  const updateTask = (
    sectionId: string,
    taskId: string,
    field: keyof Task,
    value: any,
  ) => {
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

  const toggleAssigneeEdit = (taskId: string) => {
    setEditingAssignee(editingAssignee === taskId ? null : taskId)
  }

  const addNewSection = () => {
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

  const addNewTask = (
    sectionId: string,
    taskDescription: string,
    taskTitle: string,
    taskAssignee: User | null = null,
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const newTaskId = `${sectionId}.${section.tasks.length + 1}`
          const newTask: Task = {
            id: newTaskId,
            title: taskTitle,
            description: taskDescription,
            state: null,
            assignee: null,
            verified: false,
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
        <h1 className="text-2xl font-bold">Due Diligence Dashboard</h1>
        <Button onClick={addNewSection}>
          <Plus className="mr-2 h-4 w-4" /> Add New Section
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={columnWidths.taskName}>Task</TableHead>
              <TableHead className={columnWidths.state}>
                Not Applicable
              </TableHead>
              <TableHead className={columnWidths.state}>
                To Be Provided
              </TableHead>
              <TableHead className={columnWidths.state}>Provided</TableHead>
              <TableHead className={columnWidths.assignee}>Assignee</TableHead>
              <TableHead className={columnWidths.verified}>Verified</TableHead>
              <TableHead className={columnWidths.button}></TableHead>
            </TableRow>
          </TableHeader>
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
                        {section.id}. {section.title}
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
                          addNewTask(
                            section.id,
                            newTask.description,
                            newTask.title,
                            newTask.assignee,
                          )
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
                {expandedSections.includes(section.id) &&
                  section.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div>
                          {task.id} {task.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={task.state}
                          onValueChange={(value) =>
                            updateTask(
                              section.id,
                              task.id,
                              "state",
                              value as TaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="Not Applicable"
                            id={`${task.id}-na`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={task.state}
                          onValueChange={(value) =>
                            updateTask(
                              section.id,
                              task.id,
                              "state",
                              value as TaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="To Be Provided"
                            id={`${task.id}-np`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={task.state}
                          onValueChange={(value) =>
                            updateTask(
                              section.id,
                              task.id,
                              "state",
                              value as TaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="Provided"
                            id={`${task.id}-p`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <SelectUserPopover
                          selectedUserId={task.assignee?.id}
                          setSelectedUserId={(value: string | null) =>
                            updateTask(section.id, task.id, "assignee", value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {task.verified ? (
                          <CheckCircle2 className="h-5 w-5 m-2 text-green-500" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateTask(section.id, task.id, "verified", true)
                            }
                          >
                            <CheckCircle2 className="h-5 w-5 text-slate-200" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // TODO: Implement navigation to task details page
                            console.log(
                              `Navigate to details for task ${task.id}`,
                            )
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
