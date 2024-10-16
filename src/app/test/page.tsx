"use client"
import ChatMessage from "@/components/ai-chat/chat-message"
import { DataroomItem } from "@/types/dataroom"
import { Citation } from "@/types/document"

export default function ChatPreview() {
  function handleCitationClick(citation: Citation) {
    console.log(
      `Clicked citation: ${citation.fileName}, page ${citation.highlightAreas[0].pageIndex}`,
    )
  }

  const selectedItems: DataroomItem[] = [
    {
      id: "1",
      name: "Financials",
      type: "folder",
      alerts: [],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      flags: [],
    },
    {
      id: "2",
      name: "Marketing",
      type: "folder",
      alerts: [],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      flags: [],
    },
    {
      id: "3",
      name: "Q2_Financial_Report.pdf",
      type: "file",
      alerts: [],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
      flags: [],
    },
  ]

  return (
    <div className="max-w-md border border-gray-200 rounded-lg p-4 bg-background">
      <ChatMessage
        sender="user"
        content="Can you summarize the key points from the financial report and the marketing strategy document?"
        referenceItems={selectedItems}
      />
      <ChatMessage
        sender="ai"
        content="Certainly! I've reviewed the financial report and marketing strategy document. Here are the key points:

1. Financial Report Highlights:
   - Q2 revenue increased by 15% year-over-year [citation]
   - Operating expenses reduced by 8% due to cost-cutting measures [citation]
   - Cash flow from operations improved by 22% [citation]

2. Marketing Strategy Key Points:
   - Focus on expanding digital marketing efforts, particularly in social media [citation]
   - Launch of a new customer loyalty program in Q3 [citation]
   - Emphasis on personalized marketing campaigns using AI-driven analytics [citation]

These points provide a high-level overview of the company's financial performance and marketing direction. Would you like me to elaborate on any specific area?"
        citations={[
          {
            id: "1",
            fileName: "Q2_Financial_Report.pdf",
            highlightAreas: [
              { pageIndex: 3, height: 50, width: 400, left: 100, top: 200 },
            ],
          },
          {
            id: "2",
            fileName: "Q2_Financial_Report.pdf",
            highlightAreas: [
              { pageIndex: 5, height: 30, width: 350, left: 150, top: 300 },
            ],
          },
          {
            id: "3",
            fileName: "Q2_Financial_Report.pdf",
            highlightAreas: [
              { pageIndex: 7, height: 40, width: 380, left: 120, top: 250 },
            ],
          },
          {
            id: "4",
            fileName: "Marketing_Strategy_2023.docx",
            highlightAreas: [
              { pageIndex: 2, height: 60, width: 450, left: 80, top: 150 },
            ],
          },
          {
            id: "5",
            fileName: "Marketing_Strategy_2023.docx",
            highlightAreas: [
              { pageIndex: 4, height: 35, width: 400, left: 100, top: 280 },
            ],
          },
          {
            id: "6",
            fileName: "Marketing_Strategy_2023.docx",
            highlightAreas: [
              { pageIndex: 6, height: 55, width: 420, left: 90, top: 220 },
            ],
          },
        ]}
        onCitationClick={handleCitationClick}
      />
    </div>
  )
}
