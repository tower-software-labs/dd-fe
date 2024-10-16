"use client"

import { DataroomItem } from "@/types/dataroom"

import { sampleDocument } from "@/app/sample-data/document"
import DocumentPreviewDrawer from "@/components/document-preview-drawer"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { DocumentData } from "@/types/document"
import { ChevronLeft, ChevronRight, Eye, FileIcon, Folder } from "lucide-react"
import { useEffect, useState } from "react"
import SelectUserPopover from "./select-user-popover"

export interface DataroomTableProps {
  items: DataroomItem[]
  selectedItems: DataroomItem[]
  setSelectedItems: React.Dispatch<React.SetStateAction<DataroomItem[]>>
  showBreadcrumbs?: boolean
}

const columnWidths = {
  checkbox: "w-[5%]",
  item: "w-[8%]",
  name: "w-[50%]",
  info: "w-[20%]",
  lastUpdated: "w-[8%]",
  actions: "w-[9%]",
}

export default function DataroomTable({
  items,
  selectedItems,
  setSelectedItems,
  showBreadcrumbs = false,
}: DataroomTableProps) {
  const [curFolder, setCurFolder] = useState<DataroomItem | null>(null)
  const [listedItems, setListedItems] = useState<DataroomItem[]>([])
  const [document, setDocument] = useState<DocumentData>(sampleDocument)
  const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<DataroomItem[]>([])
  const [history, setHistory] = useState<(DataroomItem | null)[]>([null])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    if (!curFolder) {
      setListedItems(
        items.filter(
          (item) => item.parentId === null || item.parentId === undefined,
        ),
      )
    } else {
      setListedItems(items.filter((item) => item.parentId === curFolder.id))
    }

    // Update breadcrumbs
    if (curFolder) {
      const newBreadcrumbs = [curFolder]
      let parent = items.find((item) => item.id === curFolder.parentId)
      while (parent) {
        newBreadcrumbs.unshift(parent)
        parent = items.find((item) => item.id === parent?.parentId)
      }
      setBreadcrumbs(newBreadcrumbs)
    } else {
      setBreadcrumbs([])
    }

    // Update history
    if (curFolder !== history[historyIndex]) {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), curFolder])
      setHistoryIndex((prev) => prev + 1)
    }
  }, [curFolder, items])

  const handleRowClick = (item: DataroomItem) => {
    if (item.type === "folder") {
      setCurFolder(item)
    }
  }

  const handleCheckboxChange = (item: DataroomItem) => {
    setSelectedItems((prevSelected) => {
      const isItemSelected = prevSelected.some(
        (selectedItem) => selectedItem.id === item.id,
      )
      if (isItemSelected) {
        return prevSelected.filter(
          (selectedItem) => selectedItem.id !== item.id,
        )
      } else {
        return [...prevSelected, item]
      }
    })
  }

  const getSelectedItemNames = () => {
    return listedItems
      .filter((item) =>
        selectedItems.some((selectedItem) => selectedItem.id === item.id),
      )
      .map((item) => item.name)
  }

  const handleHeaderCheckboxChange = () => {
    if (selectedItems.length === listedItems.length) {
      // If all items are selected, deselect all
      setSelectedItems([])
    } else {
      // If not all items are selected, select all
      setSelectedItems([...listedItems])
    }
  }

  const handleBreadcrumbClick = (item: DataroomItem | null) => {
    setCurFolder(item)
  }

  const handleBackClick = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setCurFolder(history[historyIndex - 1])
    }
  }

  const handleForwardClick = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setCurFolder(history[historyIndex + 1])
    }
  }

  return (
    <div>
      {showBreadcrumbs && (
        <div className="flex justify-between items-center mb-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handleBreadcrumbClick(null)}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {breadcrumbs.map((item, index) => (
                <BreadcrumbItem key={item.id}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink
                        onClick={() => handleBreadcrumbClick(item)}
                      >
                        {item.name}
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              disabled={historyIndex <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleForwardClick}
              disabled={historyIndex >= history.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={`pl-4 ${columnWidths.checkbox}`}>
                <Checkbox
                  className="data-[state=unchecked]:border-gray-300"
                  checked={
                    selectedItems.length === listedItems.length &&
                    listedItems.length > 0
                  }
                  onCheckedChange={handleHeaderCheckboxChange}
                />
              </TableHead>
              <TableHead className={columnWidths.item}>Item</TableHead>
              <TableHead className={columnWidths.name}>Name</TableHead>
              <TableHead className={columnWidths.info}></TableHead>
              <TableHead className={columnWidths.lastUpdated}>
                Last Updated
              </TableHead>
              <TableHead className={`${columnWidths.actions} pr-4`}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listedItems.map((item) => (
              <TableRow key={item.id} className="py-2 cursor-pointer">
                <TableCell className={`py-4 pl-4 ${columnWidths.checkbox}`}>
                  <Checkbox
                    className="data-[state=unchecked]:border-gray-300"
                    checked={selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id,
                    )}
                    onCheckedChange={() => handleCheckboxChange(item)}
                  />
                </TableCell>
                <TableCell
                  className={`py-4 ${columnWidths.item}`}
                  onClick={() => handleRowClick(item)}
                >
                  <span className="text-sm font-semibold text-slate-500 py-2 px-4">
                    {item.id}
                  </span>
                </TableCell>
                <TableCell
                  className={`flex items-center gap-2 py-4 pl-2 ${columnWidths.name}`}
                  onClick={() => handleRowClick(item)}
                >
                  {item.type === "folder" ? (
                    <Folder className="h-4 w-4" />
                  ) : (
                    <FileIcon className="h-4 w-4" />
                  )}
                  {item.name}
                  {item.newItems && (
                    <Badge variant="secondary" className="ml-2">
                      {item.newItems}
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className={`py-4 pl-2 ${columnWidths.info}`}
                  onClick={() => handleRowClick(item)}
                >
                  {item.numSubfolders
                    ? `${item.numSubfolders} subfolders`
                    : item.numDocuments
                      ? `${item.numDocuments} documents`
                      : ""}
                </TableCell>
                <TableCell
                  className={`py-4 pl-2 ${columnWidths.lastUpdated}`}
                  onClick={() => handleRowClick(item)}
                >
                  {minimalLocalDateTime(item.updatedAt, "date")}
                </TableCell>
                <TableCell className={`${columnWidths.actions} group`}>
                  <div className="flex justify-end pr-4">
                    {item.type === "file" && (
                      <>
                        <SelectUserPopover
                          selectedUser={item.assignee ?? null}
                          setSelectedUser={() => {}}
                          size="sm"
                          iconColor="text-black"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDocumentPreviewOpen(true)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DocumentPreviewDrawer
          isOpen={isDocumentPreviewOpen}
          setIsOpen={setIsDocumentPreviewOpen}
          document={document}
        />
      </div>
    </div>
  )
}
