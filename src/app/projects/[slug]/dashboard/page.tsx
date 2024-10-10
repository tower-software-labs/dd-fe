"use client"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { useEffect } from "react"

export interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { setBreadcrumbs } = useBreadcrumbs()
  const { setProjectId } = useProject()

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
      { href: `/projects/${params.slug}/dashboard`, label: "Dashboard" },
    ])
    setProjectId(params.slug)
  }, [setBreadcrumbs])
  return <div className="container mx-auto py-10">Dashboard</div>
}
