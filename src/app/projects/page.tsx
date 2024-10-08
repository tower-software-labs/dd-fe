"use client"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useEffect } from "react"

export default function Page() {
  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
    ])
  }, [setBreadcrumbs])
  return <div>Projects Index Page</div>
}
