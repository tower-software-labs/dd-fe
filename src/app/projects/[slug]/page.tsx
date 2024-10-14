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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BellIcon,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  HourglassIcon,
  ListTodo,
  Pencil,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { initialSections } from "@/app/sample-data/tasks"
import AddTaskForm from "@/components/add-task-form"
import SelectUserPopover from "@/components/select-user-popover"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { Section, Task, TaskState } from "@/types/task"
import { User } from "@/types/user"

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

  function addNewTask(
    sectionId: string,
    taskDescription: string,
    taskTitle: string,
    taskAssignee: User | null = null,
    parentTaskId?: string,
  ) {
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
            title: taskTitle,
            description: taskDescription,
            state: null,
            assignee: taskAssignee,
            stakeholderStatus: "buyside",
            parentTaskId: parentTaskId || undefined,
          }
          return { ...section, tasks: [...section.tasks, newTask] }
        }
        return section
      }),
    )
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
          <TableHeader>
            <TableRow>
              <TableHead className={columnWidths.taskName}>Request</TableHead>
              <TableHead className={columnWidths.state}>
                Not Applicable
              </TableHead>
              <TableHead className={columnWidths.state}>
                To Be Provided
              </TableHead>
              <TableHead className={columnWidths.state}>Provided</TableHead>
              <TableHead className={columnWidths.assignee}>Assignee</TableHead>
              <TableHead className={columnWidths.taskState}>Status</TableHead>
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
                        <div className="flex flex-row items-start pl-1">
                          {task.parentTaskId && (
                            <div>
                              <CornerDownRight className="h-4 w-4 mr-2 text-muted-foreground" />
                            </div>
                          )}
                          <span className="pr-2 font-mono font-bold">
                            {task.id}
                          </span>
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
                            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={task?.state ?? undefined}
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
                            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={task?.state ?? undefined}
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
                            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
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
                        {getStateIcon(task.stakeholderStatus)}
                      </TableCell>
                      <TableCell className="group relative">
                        <div className="flex items-center justify-end h-full">
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AddTaskForm
                              onSave={(newTask) => {
                                addNewTask(
                                  section.id,
                                  newTask.description,
                                  newTask.title,
                                  newTask.assignee,
                                  task.id, // Pass the parent task ID
                                )
                              }}
                              sectionId={section.id}
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
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
