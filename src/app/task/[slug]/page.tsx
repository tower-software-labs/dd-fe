"use client"

import { tasks } from "@/app/sample-data/tasks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { Task } from "@/types/task"
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

  useEffect(() => {
    setTask(tasks.find((task) => task.id === params.slug) ?? null)
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
    <div className="container mx-auto py-10">
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {task?.title ? `${task.id} ${task?.title}` : "Task"}
          </h1>
          <Button>
            <FolderClosed className="mr-2 h-4 w-4" />
            <span>Go to Document Folder</span>
          </Button>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-slate-500">
            {task?.description ?? "Description"}
          </span>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Related Documents</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  )
}
