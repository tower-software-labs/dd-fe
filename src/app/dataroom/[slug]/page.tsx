"use client"

import DataroomTable from "@/components/dataroom-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { DataroomItem } from "@/types/dataroom"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileIcon,
  FileUp,
  Filter,
  Sparkles,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"

import { folders as sampleFolders } from "@/app/sample-data/dataroom"
import { sampleDocument } from "@/app/sample-data/document"
import AIAssistantPopover from "@/components/ai-chat-popover"
import DocumentExpirationSummary from "@/components/dataroom/expiration"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { useProject } from "@/providers/project-provider"
import { AISuggestedAction } from "@/types/ai"
import { DocumentData } from "@/types/document"

const tabClass =
  "font-medium border-b-2 border-slate-300 text-slate-400 hover:border-blue-600 hover:text-black hover:font-bold data-[state=active]:border-blue-600 data-[state=active]:text-black data-[state=active]:font-bold cursor-pointer px-2 pb-[10px] pt-2 relative top-[2px]"

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona" /* ... add all US states ... */,
]

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba" /* ... add all Canadian provinces ... */,
]

function DataroomTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "dataroom" | "applied-dataroom"
  setActiveTab: (tab: "dataroom" | "applied-dataroom") => void
}) {
  return (
    <div className="w-full text-sm">
      <div className="flex w-full border-b-2 border-slate-300">
        <div
          className={tabClass}
          onClick={() => setActiveTab("dataroom")}
          data-state={activeTab === "dataroom" ? "active" : "inactive"}
        >
          Dataroom
        </div>
        <div
          className={tabClass}
          onClick={() => setActiveTab("applied-dataroom")}
          data-state={activeTab === "applied-dataroom" ? "active" : "inactive"}
        >
          Applied Dataroom
        </div>
      </div>
    </div>
  )
}

const dataroomAISuggestedActions: AISuggestedAction[] = [
  {
    id: "1",
    name: "Disclosure Investigation",
    description: "Investigate a disclosure schedule against the dataroom",
  },
  {
    id: "2",
    name: "Clause Extraction",
    description: "Summarize all agreements with a certain clause.",
  },
]
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
  const [numExpiration, setNumExpiration] = useState<number>(0)
  const [numSignatureMissing, setNumSignatureMissing] = useState<number>(0)
  const [numPageMissing, setNumPageMissing] = useState<number>(0)
  const [numDocumentReferenceMissing, setNumDocumentReferenceMissing] =
    useState<number>(0)
  const [numTotalDocuments, setNumTotalDocuments] = useState<number>(0)
  const [selectedDataroomItems, setSelectedDataroomItems] = useState<
    DataroomItem[]
  >([])
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState({
    expired: false,
    signatureMissing: false,
    pageMissing: false,
    referenceMissing: false,
  })
  const [activeTab, setActiveTab] = useState<"dataroom" | "applied-dataroom">(
    "dataroom",
  )
  const [numExpiringSoon, setNumExpiringSoon] = useState<number>(123)
  const [numInEffect, setNumInEffect] = useState<number>(234)
  const [numAutoRenewal, setNumAutoRenewal] = useState<number>(345)
  const [numExpired, setNumExpired] = useState<number>(456)
  const [searchableDocuments, setSearchableDocuments] = useState<
    DocumentData[]
  >([sampleDocument, sampleDocument])

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

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
    // Implement filter logic here
  }

  const sortOptions = [
    { label: "Date", value: "date" },
    { label: "Contract Value", value: "contractValue" },
    { label: "Alphabetical", value: "alphabetical" },
    { label: "Expiration", value: "expiration" },
  ]

  const handleSort = (value: string) => {
    setSortBy(value)
    // Implement sort logic here
  }

  function toggleSortDirection() {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    // Implement toggle asc/desc logic here
  }

  function SortPopover() {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-row space-x-2">
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={toggleSortDirection}>
              {sortDirection === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  function FilterPopover() {
    const [selectedLaws, setSelectedLaws] = useState<string[]>([])

    const toggleLaw = (law: string) => {
      setSelectedLaws((prev) =>
        prev.includes(law) ? prev.filter((l) => l !== law) : [...prev, law],
      )
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {/* Existing filters */}
            <div className="space-y-2">
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={() =>
                      handleFilterChange(key as keyof typeof filters)
                    }
                  />
                  <label
                    htmlFor={key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                </div>
              ))}
            </div>

            {/* Governing Law multiselect */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Governing Law</label>
              <Command className="border rounded-md">
                <CommandInput placeholder="Search laws..." />
                <CommandEmpty>No law found.</CommandEmpty>
                <CommandList>
                  <CommandGroup heading="US States">
                    {US_STATES &&
                      US_STATES.map((state) => (
                        <CommandItem
                          key={state}
                          onSelect={() => toggleLaw(state)}
                          className="cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedLaws.includes(state)}
                            className="mr-2"
                          />
                          {state}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Canadian Provinces">
                    {CANADIAN_PROVINCES &&
                      CANADIAN_PROVINCES.map((province) => (
                        <CommandItem
                          key={province}
                          onSelect={() => toggleLaw(province)}
                          className="cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedLaws.includes(province)}
                            className="mr-2"
                          />
                          {province}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedLaws.map((law) => (
                  <Badge key={law} variant="secondary" className="text-xs">
                    {law}
                    <button
                      className="ml-1 hover:text-red-500"
                      onClick={() => toggleLaw(law)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex bg-slate-500 justify-between items-center mb-4 rounded-lg py-2 px-4">
        <span className="flex flex-row items-center gap-2 text-white font-semibold">
          <Sparkles className="h-4 w-4" />
          Ask a question
        </span>
        <AIAssistantPopover
          selectedDataroomItems={selectedDataroomItems}
          searchableDocuments={searchableDocuments}
          aiSuggestedActions={dataroomAISuggestedActions}
        />
      </div>
      <DataroomTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-1 justify-start w-fit mb-4 ">
          <ToggleGroup
            type="single"
            value={filterValue}
            onValueChange={(value) => setFilterValue(value)}
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
              Expiration ({numExpiration})
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
        <div className="flex items-center gap-2">
          <SortPopover />
          <FilterPopover />
          <Button variant="outline" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      {filterValue === "expiration" && (
        <DocumentExpirationSummary
          expired={numExpired}
          expiringSoon={numExpiringSoon}
          inEffect={numInEffect}
          autoRenewal={numAutoRenewal}
        />
      )}
      <DataroomTable
        items={folders}
        selectedItems={selectedDataroomItems}
        setSelectedItems={setSelectedDataroomItems}
        showBreadcrumbs={true}
      />
    </div>
  )
}
