"use client"

import { DataroomItem } from "@/types/dataroom"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { minimalLocalDateTime } from "@/helpers/date-utils"
import { FileIcon, Folder } from "lucide-react"
import { useEffect, useState } from "react"
export interface DataroomTableProps {
  items: DataroomItem[]
}

export default function DataroomTable({ items }: DataroomTableProps) {
  const [curFolder, setCurFolder] = useState<DataroomItem | null>(null)
  const [listedItems, setListedItems] = useState<DataroomItem[]>([])

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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12 pl-4">Item</TableHead>
            <TableHead className="w-2/3">Name</TableHead>
            <TableHead className="w-1/6"></TableHead>
            <TableHead className="w-1/12 pr-4">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listedItems.map((item) => (
            <TableRow
              key={item.id}
              className="py-2 cursor-pointer"
              onClick={() => handleRowClick(item)}
            >
              <TableCell className="py-4 w-1/12">
                <span className="text-sm font-semibold text-slate-500 py-2 px-4">
                  {item.id}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-2 py-4 pl-2 w-2/3">
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
              <TableCell className="py-4 pl-2 w-1/6">
                {item.numSubfolders
                  ? `${item.numSubfolders} subfolders`
                  : item.numDocuments
                    ? `${item.numDocuments} documents`
                    : ""}
              </TableCell>
              <TableCell className="py-4 pl-2 w-1/12">
                {minimalLocalDateTime(item.updatedAt, "date")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
