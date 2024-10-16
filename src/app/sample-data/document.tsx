import { DocumentData, Note } from "@/types/document"

export const sampleIssues: Note[] = [
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

export const sampleNotes: Note[] = [
  {
    id: 1,
    header: "Change of Control",
    highlightAreas: [
      {
        pageIndex: 0,
        height: 1.55401,
        width: 28.1674,
        left: 18,
        top: 15.0772,
      },
    ],
    body: "Insert the text here",
  },
]

export const sampleDocument: DocumentData = {
  id: "1",
  name: "Sample Document",
  summary:
    "Here is a summary of the document, it lists the basic details that matter and is a couple of sentences long.",
  stateOfCause: "Sample State of Cause",
  url: "http://localhost:3000/test.pdf",
  notes: sampleNotes,
  issues: sampleIssues,
  createdAt: "2024-02-14T00:00:00Z",
  updatedAt: "2024-02-14T00:00:00Z",
}

export const customerContracts: DocumentData[] = [
  {
    id: "cc1",
    name: "Customer Contract 1",
    summary:
      "This is a summary of Customer Contract 1. It contains key details about the agreement between the company and the customer.",
    stateOfCause: "Active",
    url: "http://localhost:3000/contracts/Customer-Contract-1.pdf",
    notes: [],
    issues: [],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "cc2",
    name: "Customer Contract 2",
    summary:
      "Customer Contract 2 summary, outlining the main points of the agreement and any special terms.",
    stateOfCause: "Active",
    url: "http://localhost:3000/contracts/Customer-Contract-2.pdf",
    notes: [],
    issues: [],
    createdAt: "2024-03-02T00:00:00Z",
    updatedAt: "2024-03-02T00:00:00Z",
  },
  {
    id: "cc3",
    name: "Customer Contract 3",
    summary:
      "Summary of Customer Contract 3, highlighting key aspects of the agreement and any unique clauses.",
    stateOfCause: "Pending Review",
    url: "http://localhost:3000/contracts/Customer-Contract-3.pdf",
    notes: [],
    issues: [],
    createdAt: "2024-03-03T00:00:00Z",
    updatedAt: "2024-03-03T00:00:00Z",
  },
  {
    id: "cc4",
    name: "Customer Contract 4",
    summary:
      "Customer Contract 4 summary, detailing the main points of the agreement and any specific conditions.",
    stateOfCause: "Active",
    url: "http://localhost:3000/contracts/Customer-Contract-4.pdf",
    notes: [],
    issues: [],
    createdAt: "2024-03-04T00:00:00Z",
    updatedAt: "2024-03-04T00:00:00Z",
  },
]
