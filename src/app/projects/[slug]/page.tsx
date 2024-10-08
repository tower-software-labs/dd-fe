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

import { users } from "@/app/sample-data/users"
import UserAvatarSmall from "@/components/user-avatar"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { User } from "@/types/user"

type SubtaskState = "Not Applicable" | "To Be Provided" | "Provided" | null

interface Subtask {
  id: string
  title: string
  description: string
  state: SubtaskState
  assignee: User | null
  verified: boolean
}

interface Section {
  id: string
  title: string
  subtasks: Subtask[]
}

const initialSections: Section[] = [
  {
    id: "1",
    title: "Employment Matters",
    subtasks: [
      {
        id: "1.1",
        title: "Review employment agreements",
        description:
          "Analyze all current employment contracts for compliance with labor laws and company policies.",
        state: null,
        assignee: users[0],
        verified: false,
      },
      {
        id: "1.2",
        title: "Analyze compensation structures",
        description:
          "Evaluate salary ranges, bonus schemes, and benefits packages across all employee levels.",
        state: null,
        assignee: null,
        verified: false,
      },
    ],
  },
  {
    id: "2",
    title: "Intellectual Property",
    subtasks: [
      {
        id: "2.1",
        title: "Review patent portfolio",
        description:
          "Examine all existing patents, their current status, and potential infringement risks.",
        state: null,
        assignee: null,
        verified: false,
      },
      {
        id: "2.2",
        title: "Analyze trademark registrations",
        description:
          "Assess all registered trademarks, their territorial coverage, and renewal dates.",
        state: null,
        assignee: null,
        verified: false,
      },
    ],
  },
]

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
      { href: "/", label: "Home" },
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

  const updateSubtask = (
    sectionId: string,
    subtaskId: string,
    field: keyof Subtask,
    value: any,
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subtasks: section.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, [field]: value }
                  : subtask,
              ),
            }
          : section,
      ),
    )
  }

  const toggleAssigneeEdit = (subtaskId: string) => {
    setEditingAssignee(editingAssignee === subtaskId ? null : subtaskId)
  }

  const addNewSection = () => {
    const newSectionId = (
      parseInt(sections[sections.length - 1].id) + 1
    ).toString()
    const newSection: Section = {
      id: newSectionId,
      title: `New Section ${newSectionId}`,
      subtasks: [],
    }
    setSections([...sections, newSection])
    setExpandedSections([...expandedSections, newSectionId])
  }

  const addNewTask = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const newTaskId = `${sectionId}.${section.subtasks.length + 1}`
          const newTask: Subtask = {
            id: newTaskId,
            title: `New Task ${newTaskId}`,
            description: "Description for the new task.",
            state: null,
            assignee: null,
            verified: false,
          }
          return { ...section, subtasks: [...section.subtasks, newTask] }
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
                  <TableCell colSpan={7}>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center text-sm font-bold"
                        onClick={() => toggleSection(section.id)}
                      >
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="mr-2 h-4 w-4" />
                        ) : (
                          <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        {section.id}. {section.title}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addNewTask(section.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedSections.includes(section.id) &&
                  section.subtasks.map((subtask) => (
                    <TableRow key={subtask.id}>
                      <TableCell className="font-medium">
                        <div>
                          {subtask.id} {subtask.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {subtask.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={subtask.state}
                          onValueChange={(value) =>
                            updateSubtask(
                              section.id,
                              subtask.id,
                              "state",
                              value as SubtaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="Not Applicable"
                            id={`${subtask.id}-na`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={subtask.state}
                          onValueChange={(value) =>
                            updateSubtask(
                              section.id,
                              subtask.id,
                              "state",
                              value as SubtaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="To Be Provided"
                            id={`${subtask.id}-np`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={subtask.state}
                          onValueChange={(value) =>
                            updateSubtask(
                              section.id,
                              subtask.id,
                              "state",
                              value as SubtaskState,
                            )
                          }
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value="Provided"
                            id={`${subtask.id}-p`}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        {subtask.assignee ? (
                          <UserAvatarSmall
                            user={subtask.assignee}
                            className="font-bold"
                          />
                        ) : (
                          <div className="h-5 w-5 bg-muted rounded-full flex items-center justify-center">
                            -
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {subtask.verified ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() =>
                              updateSubtask(
                                section.id,
                                subtask.id,
                                "verified",
                                true,
                              )
                            }
                          >
                            <CheckCircle2 className="h-5 w-5 text-slate-200" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          className="px-3 py-2 m-2"
                          onClick={() => {
                            // TODO: Implement navigation to subtask details page
                            console.log(
                              `Navigate to details for subtask ${subtask.id}`,
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
