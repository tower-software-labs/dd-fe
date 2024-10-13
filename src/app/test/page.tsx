"use client"
import ChatMessage from "@/components/ai-chat/chat-message"
import { Citation } from "@/types/document"

export default function ChatPreview() {
  function handleCitationClick(citation: Citation) {
    console.log(
      `Clicked citation: ${citation.fileName}, line ${citation.lineNumber}`,
    )
  }

  return (
    <div className="max-w-md border border-gray-200 rounded-lg p-4 bg-background">
      <ChatMessage
        sender="user"
        content="What are the key features of the product?"
      />
      <ChatMessage
        sender="ai"
        content="Based on the document, the key features of the product are:
  
  1. Advanced AI integration [citation]
  2. Seamless cloud synchronization [citation]
  3. User-friendly interface [citation]
  
  These features work together to provide a comprehensive solution for businesses."
        citations={[
          { id: "1", fileName: "features.txt", lineNumber: 15 },
          { id: "2", fileName: "tech_specs.md", lineNumber: 42 },
          { id: "3", fileName: "ui_design.pdf", lineNumber: 7 },
        ]}
        onCitationClick={handleCitationClick}
      />
      <ChatMessage
        sender="user"
        content="Can you elaborate on the AI integration?"
      />
      <ChatMessage
        sender="ai"
        content="The advanced AI integration in our product offers several benefits:
  
  1. Predictive analytics [citation]: It can forecast trends and help in decision-making.
  2. Natural language processing [citation]: This allows for efficient communication between users and the system.
  3. Adaptive learning [citation]: The AI continuously improves its performance based on user interactions.
  
  These AI capabilities significantly enhance the overall functionality and user experience of the product."
        citations={[
          { id: "4", fileName: "ai_features.txt", lineNumber: 23 },
          { id: "5", fileName: "nlp_doc.md", lineNumber: 8 },
          { id: "6", fileName: "machine_learning.pdf", lineNumber: 56 },
        ]}
        onCitationClick={handleCitationClick}
      />
    </div>
  )
}
