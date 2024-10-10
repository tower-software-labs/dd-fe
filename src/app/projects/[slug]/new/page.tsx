"use client"

import { useEffect, useState } from "react"

import { initialSections } from "@/app/sample-data/tasks"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { Section } from "@/types/task"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"

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
  const router = useRouter()

  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const { setBreadcrumbs } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
    ])

    setSections(initialSections)
    setExpandedSections(initialSections.map((section) => section.id))
  }, [setBreadcrumbs])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    setIsLoading(true)
    const timeout = Math.floor(Math.random() * (3000 - 2000 + 1) + 3000)
    setTimeout(() => {
      console.log("Form submitted")
      router.push("/projects/12345") // Redirect to projects list page after submission
    }, timeout)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">Due Diligence Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="document-upload">
            Upload Due Diligence List and Automatically Generate Dashboard
          </Label>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />

                {!uploadedFileName && (
                  <>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOCX, XLSX (MAX. 100MB)
                    </p>
                  </>
                )}
                {uploadedFileName && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Uploaded file: {uploadedFileName}
                  </p>
                )}
              </div>
              <Input
                id="document-upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-row justify-end">
          <Button onClick={handleSubmit} disabled={isLoading} className="">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Submit List"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
