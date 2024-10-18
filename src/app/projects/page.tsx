"use client"
import Link from "next/link"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { useEffect, useState } from "react"

import { demoProjects } from "@/app/sample-data/project"
import NewProjectForm from "@/components/new-project-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Project } from "@/types/project"
import {
  Briefcase,
  CalendarIcon,
  FileText,
  PlusCircle,
  Users,
  X,
} from "lucide-react"

export interface ProjectsPageProps {}

export default function Page({}: ProjectsPageProps) {
  const { setBreadcrumbs } = useBreadcrumbs()
  const { setProjectId } = useProject()
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setBreadcrumbs([{ href: "/projects", label: "Projects" }])
  }, [setBreadcrumbs])

  useEffect(() => {
    setProjects(demoProjects)
  }, [projects])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Add logic to create a new project
    setShowForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Active Projects</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          {/* <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader> */}
          <CardContent>
            <NewProjectForm />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.slug}`}
            key={project.id}
            className="no-underline"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Created: {project.created}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Users: {project.users.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Client:{" "}
                      {project.client + " (" + project.clientNumber + ")"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Matter: {project.matterNumber}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Badge variant="secondary">View Details</Badge>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
