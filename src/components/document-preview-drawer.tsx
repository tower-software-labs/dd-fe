"use client"

import PDFViewer from "@/components/PDFViewer"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { DocumentData } from "@/types/document"

export interface DocumentPreviewDrawerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  document: DocumentData
}

export default function DocumentPreviewDrawer({
  isOpen,
  setIsOpen,
  document,
}: DocumentPreviewDrawerProps) {
  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-full flex flex-col overflow-y-hidden">
        <div className="mt-4 px-6">
          <div className="h-[95svh]">
            {isOpen && <PDFViewer document={document} onClose={handleClose} />}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
