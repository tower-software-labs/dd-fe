import { Note } from "@/types/document"

export const sampleNotes: Note[] = [
  {
    id: 1,
    header: "Missing Signature",
    highlightAreas: [
      {
        pageIndex: 0,
        height: 1.55401,
        width: 28.1674,
        left: 18,
        top: 15.0772,
      },
    ],
    body: "The signature is missing on this page. Please ensure all parties have signed.",
  },
  {
    id: 2,
    header: "Missing Page",
    highlightAreas: [
      {
        pageIndex: 3,
        height: 1.32637,
        width: 37.477,
        left: 55.7062,
        top: 15.2715,
      },
    ],
    body: "There appears to be a page missing from the document. Please check the page numbering.",
  },
  {
    id: 3,
    header: "Document Expired",
    highlightAreas: [
      {
        pageIndex: 3,
        height: 1.55401,
        width: 28.7437,
        left: 16.3638,
        top: 16.6616,
      },
    ],
    body: "This document has expired. Please provide an updated version.",
  },
]
