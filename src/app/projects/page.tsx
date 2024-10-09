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
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Projects Index Page</h1>
      <div className="space-y-2">
        <p className="text-xs font-thin">Extra Light (100)</p>
        <p className="text-sm font-extralight">Extra Light (200)</p>
        <p className="text-base font-light">Light (300)</p>
        <p className="text-lg font-normal">Regular (400)</p>
        <p className="text-xl font-medium">Medium (500)</p>
        <p className="text-2xl font-semibold">Semi Bold (600)</p>
        <p className="text-3xl font-bold">Bold (700)</p>
        <p className="text-4xl font-extrabold">Extra Bold (800)</p>
        <p className="text-5xl font-black">Black (900)</p>
      </div>
    </div>
  )
}
