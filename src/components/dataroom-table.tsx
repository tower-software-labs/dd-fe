"use client"

import { DataroomItem } from "@/types/dataroom"

import { sampleDocument } from "@/app/sample-data/document"
import DocumentPreviewDrawer from "@/components/document-preview-drawer"
import { Badge } from "@/components/ui/badge"
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
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { DocumentData } from "@/types/document"
import { Eye, FileIcon, Folder } from "lucide-react"
import { useEffect, useState } from "react"

export interface DataroomTableProps {
  items: DataroomItem[]
  selectedItems: DataroomItem[]
  setSelectedItems: React.Dispatch<React.SetStateAction<DataroomItem[]>>
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
}: DataroomTableProps) {
  const [curFolder, setCurFolder] = useState<DataroomItem | null>(null)
  const [listedItems, setListedItems] = useState<DataroomItem[]>([])
  const [document, setDocument] = useState<DocumentData>(sampleDocument)
  const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false)

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
    console.log("curFolder", curFolder)
    console.log("listedItems", listedItems)
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={`${columnWidths.checkbox}`}></TableHead>
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
              <TableCell className={columnWidths.actions}>
                <div className="flex justify-end pr-4">
                  {item.type === "file" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDocumentPreviewOpen(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
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
  )
}
