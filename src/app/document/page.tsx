"use client"

import PDFViewer from "@/components/PDFViewer"
import { useEffect, useState } from "react"
import { sampleNotes } from "../sample-data/document"

export default function DocumentPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <PDFViewer fileUrl="./test.pdf" notes={sampleNotes} />
}
