"use client"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { useEffect } from "react"

export interface ProjectsPageProps {}

export default function Page({}: ProjectsPageProps) {
  const { setBreadcrumbs } = useBreadcrumbs()
  const { setProjectId } = useProject()

  useEffect(() => {
    setBreadcrumbs([{ href: "/projects", label: "Projects" }])
  }, [setBreadcrumbs])

  return <div>Projects</div>
}
