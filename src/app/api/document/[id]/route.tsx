import { AIService } from "@/server/services/ai-chat-with-doc-service"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Hello from API!" })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { userMessage, searchableDocuments } = body
  const aiService = new AIService()
  const answer = await aiService.chatWithPDF(userMessage, searchableDocuments)
  return NextResponse.json({ response: answer })
}
