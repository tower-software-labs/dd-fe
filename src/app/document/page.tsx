"use client"

import { HighlightArea } from "@react-pdf-viewer/highlight"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
})

interface Note {
  // The generated unique identifier
  id: number
  // The note content
  content: string
  // The list of highlight areas
  highlightAreas: HighlightArea[]
  // The selected text
  quote: string
}

const sampleNotes: Note[] = [
  {
    id: 1,
    content: "Highlighted Area 1",
    highlightAreas: [
      {
        pageIndex: 0,
        height: 1.55401,
        width: 28.1674,
        left: 18,
        top: 15.0772,
      },
    ],
    quote: "Content from highlighted area 1",
  },
  {
    id: 2,
    content: "Highlighted Area 2",
    highlightAreas: [
      {
        pageIndex: 3,
        height: 1.32637,
        width: 37.477,
        left: 55.7062,
        top: 15.2715,
      },
    ],
    quote: "Content from highlighted area 2",
  },
  {
    id: 3,
    content: "Highlighted Area 3",
    highlightAreas: [
      {
        pageIndex: 3,
        height: 1.55401,
        width: 28.7437,
        left: 16.3638,
        top: 16.6616,
      },
    ],
    quote: "Content from highlighted area 3",
  },
]

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
