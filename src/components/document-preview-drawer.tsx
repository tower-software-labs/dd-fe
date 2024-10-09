"use client"

import { sampleNotes } from "@/app/sample-data/document"
import PDFViewer from "@/components/PDFViewer"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer"

export interface DocumentPreviewDrawerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  documentUrl: string
}

export default function DocumentPreviewDrawer({
  isOpen,
  setIsOpen,
  documentUrl,
}: DocumentPreviewDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Open Preview Drawer</Button>
      </DrawerTrigger> */}
      <DrawerContent className="h-full flex flex-col overflow-y-hidden">
        <div className="mt-4 px-6">
          <div className="h-[90svh]">
            {isOpen && <PDFViewer fileUrl={documentUrl} notes={sampleNotes} />}
          </div>
          <DrawerFooter className="flex-shrink-0">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
