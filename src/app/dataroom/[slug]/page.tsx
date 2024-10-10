"use client"

import DataroomTable from "@/components/dataroom-table"
import { Button } from "@/components/ui/button"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { DataroomItem } from "@/types/dataroom"
import { ChevronDown, FileIcon, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import { folders as sampleFolders } from "@/app/sample-data/dataroom"
import AIAssistantPopover from "@/components/ai-chat-popover"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { useProject } from "@/providers/project-provider"

export interface DataRoomPageProps {
  params: {
    slug: string
  }
}

export default function DataRoomPage({ params }: DataRoomPageProps) {
  const { setProjectId } = useProject()
  const { setBreadcrumbs } = useBreadcrumbs()
  const [folders, setFolders] = useState<DataroomItem[]>([])
  const [curFolder, setCurFolder] = useState<DataroomItem | null>(null)
  const [filterValue, setFilterValue] = useState<string>("all")
  const [numExpired, setNumExpired] = useState<number>(0)
  const [numSignatureMissing, setNumSignatureMissing] = useState<number>(0)
  const [numPageMissing, setNumPageMissing] = useState<number>(0)
  const [numDocumentReferenceMissing, setNumDocumentReferenceMissing] =
    useState<number>(0)
  const [numTotalDocuments, setNumTotalDocuments] = useState<number>(0)

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${params.slug}`, label: "Walterson Deal" },
      { href: `/dataroom/${params.slug}`, label: "Dataroom" },
    ])
    setProjectId(params.slug)
    setFolders(sampleFolders)
  }, [setBreadcrumbs, params.slug])
  // Mock data - replace this with actual data fetching logic

  const handleFilterChange = (value: string) => {
    setFilterValue(value)
  }

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex bg-slate-500 justify-between items-center mb-4 rounded-lg py-2 px-4">
        <span className="flex flex-row items-center gap-2 text-white font-semibold">
          <Sparkles className="h-4 w-4" />
          Ask a question
        </span>
        <AIAssistantPopover />
      </div>
      <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-1 justify-start w-fit mb-4 ">
        <ToggleGroup
          type="single"
          value={filterValue}
          onValueChange={handleFilterChange}
          className="[&>button]:text-slate-500 [&>button:hover]:text-black [&>button:hover]:bg-white [&>button[data-state=on]]:text-black [&>button[data-state=on]]:bg-white"
        >
          <ToggleGroupItem value="all">
            All ({numTotalDocuments})
          </ToggleGroupItem>
          <ToggleGroupItem value="signature-missing">
            Signature Missing ({numSignatureMissing})
          </ToggleGroupItem>
          <ToggleGroupItem value="page-missing">
            Page Missing ({numPageMissing})
          </ToggleGroupItem>
          <ToggleGroupItem value="expiration">
            Expiration ({numExpired})
          </ToggleGroupItem>
          <ToggleGroupItem value="document-reference-missing">
            Reference Missing ({numDocumentReferenceMissing})
          </ToggleGroupItem>
        </ToggleGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-slate-500 hover:text-black hover:bg-white"
            >
              Recent uploads
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="space-y-2">
              {folders.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <span className="flex-grow text-sm">{doc.name}</span>
                  <span className="text-sm text-gray-500">
                    {minimalLocalDateTime(doc.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <DataroomTable items={folders} />
    </div>
  )
}
