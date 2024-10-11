import { DocumentData } from "@/types/document"
import OpenAI from "openai"
import { pdfToText } from "pdf-ts"

const client = new OpenAI()

export class AIService {
  async chatWithPDF(
    userMessage: string,
    searchableDocuments: DocumentData[],
  ): Promise<string> {
    console.log("Starting chatWithPDF with user message:", userMessage)
    console.log("Number of searchable documents:", searchableDocuments.length)

    const documentSummaries = await Promise.all(
      searchableDocuments.map(async (doc) => {
        const pdfText = await this.extractTextFromPDF(doc.url)
        const summary = await this.analyzeDocument(pdfText)
        console.log(`Document ${doc.id} summary:`, summary)
        return { id: doc.id, summary, text: pdfText }
      }),
    )

    let relevantDocuments = documentSummaries

    if (searchableDocuments.length > 1) {
      relevantDocuments = await this.selectRelevantDocuments(
        userMessage,
        documentSummaries,
      )
      console.log(
        "Relevant documents:",
        relevantDocuments.map((doc) => doc.id),
      )
    }

    const searchStrategies = await Promise.all(
      relevantDocuments.map(async (doc) => {
        const strategy = await this.developSearchStrategy(
          userMessage,
          doc.summary,
        )
        console.log(`Search strategy for document ${doc.id}:`, strategy)
        return { id: doc.id, strategy }
      }),
    )

    const relevantCitations = await Promise.all(
      relevantDocuments.map(async (doc) => {
        const strategy =
          searchStrategies.find((s) => s.id === doc.id)?.strategy || ""
        const citations = await this.searchDocument(doc.text, strategy)
        console.log(`Citations for document ${doc.id}:`, citations)
        return { id: doc.id, citations }
      }),
    )

    const answer = await this.generateAnswer(userMessage, relevantCitations)
    console.log("Generated answer:", answer)

    return answer
  }

  public async extractTextFromPDF(pdfUrl: string): Promise<string> {
    console.log("Extracting text from PDF:", pdfUrl)
    const response = await fetch(pdfUrl)
    const pdfBuffer = await response.arrayBuffer()
    const text = await pdfToText(new Uint8Array(pdfBuffer))
    console.log("Extracted text length:", text.length)
    return text
  }

  private async analyzeDocument(pdfText: string): Promise<string> {
    console.log("Analyzing document")
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes legal documents.",
        },
        {
          role: "user",
          content: `Analyze the following legal document. Identify the type of document and any important details:

${pdfText.substring(0, 2000)}...

Provide a brief summary of the document type and key details.`,
        },
      ],
      max_tokens: 150,
    })

    const summary = response.choices[0].message.content?.trim() || ""
    console.log("Document analysis summary:", summary)
    return summary
  }

  private async selectRelevantDocuments(
    userMessage: string,
    documentSummaries: { id: string; summary: string; text: string }[],
  ): Promise<{ id: string; summary: string; text: string }[]> {
    console.log("Selecting relevant documents")
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that selects relevant documents based on user queries.",
        },
        {
          role: "user",
          content: `Given the following user query and document summaries, select the most relevant documents:

User Query: ${userMessage}

Document Summaries:
${documentSummaries.map((doc) => `${doc.id}: ${doc.summary}`).join("\n")}

Provide the IDs of the relevant documents, separated by commas:`,
        },
      ],
      max_tokens: 100,
    })

    const relevantIds =
      response.choices[0].message.content?.trim().split(",") || []
    console.log("Relevant document IDs:", relevantIds)
    return documentSummaries.filter((doc) => relevantIds.includes(doc.id))
  }

  private async developSearchStrategy(
    userMessage: string,
    documentSummary: string,
  ): Promise<string> {
    console.log("Developing search strategy")
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that helps develop search strategies for legal documents.",
        },
        {
          role: "user",
          content: `Given the following user query and document summary, suggest key points or phrases to search for in the document:

User Query: ${userMessage}
Document Summary: ${documentSummary}

Separate each key point or phrase with one new line, do not include any other text in your response like bullet points or numbers.`,
        },
      ],
      max_tokens: 100,
    })

    const strategy = response.choices[0].message.content?.trim() || ""
    console.log("Developed search strategy:", strategy)
    return strategy
  }

  private async searchDocument(
    pdfText: string,
    searchStrategy: string,
  ): Promise<string> {
    console.log("Searching document")
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that searches for relevant citations in legal documents.",
        },
        {
          role: "user",
          content: `Using the following search strategy, find relevant citations from the document:

Search Strategy:
${searchStrategy}

Document:
${pdfText.substring(0, 3000)}...

Provide all relevant citations from the document verbatim, separated by new lines:`,
        },
      ],
      max_tokens: 200,
    })

    const citations = response.choices[0].message.content?.trim() || ""
    console.log("Found citations:", citations)
    return citations
  }

  private async generateAnswer(
    userMessage: string,
    relevantCitations: { id: string; citations: string }[],
  ): Promise<string> {
    console.log("Generating answer")
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that answers questions based on legal document citations.",
        },
        {
          role: "user",
          content: `Based on the following relevant citations from multiple documents, answer the user's question:

User Question: ${userMessage}

Relevant Citations:
${relevantCitations.map((doc) => `Document ${doc.id}:\n${doc.citations}`).join("\n\n")}

Provide a comprehensive answer, referencing the documents where appropriate:`,
        },
      ],
      max_tokens: 500,
    })

    const answer = response.choices[0].message.content?.trim() || ""
    console.log("Generated answer:", answer)
    return answer
  }
}
