"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Brain,
  Calculator,
  File,
  FileSearch,
  FileText,
  Search,
} from "lucide-react"
import { useEffect, useState } from "react"

const totalDocuments = 1000
const relevantDocuments = [
  "AI_Principles.pdf",
  "Machine_Learning_Basics.docx",
  "Neural_Networks_101.ppt",
  "Data_Science_Ethics.txt",
  "Deep_Learning_Applications.pdf",
]

const relevantPassages = [
  {
    text: "AI systems should be designed to align with human values...",
    source: "AI_Principles.pdf",
  },
  {
    text: "Machine learning algorithms can be categorized into supervised, unsupervised...",
    source: "Machine_Learning_Basics.docx",
  },
  {
    text: "Neural networks consist of layers of interconnected nodes...",
    source: "Neural_Networks_101.ppt",
  },
  {
    text: "Ethical considerations in AI include fairness, transparency, and accountability...",
    source: "Data_Science_Ethics.txt",
  },
  {
    text: "Deep learning has revolutionized fields such as computer vision and natural language processing...",
    source: "Deep_Learning_Applications.pdf",
  },
]
const getStageTextStyle = (
  index: number,
  currentStage: number,
  completedStages: Set<number>,
) => {
  if (index === currentStage) {
    return "font-semibold text-blue-600"
  } else if (completedStages.has(index)) {
    return "text-blue-600"
  } else {
    return "text-gray-500"
  }
}

const multipleDocumentStages = [
  { icon: Brain, text: "Analyzing request" },
  {
    icon: Search,
    text: "Searching for relevant documents",
    component: FindingDocuments,
  },
  {
    icon: FileSearch,
    text: "Investigating documents for relevant passages",
    component: SearchingPassages,
  },
  { icon: Calculator, text: "Evaluating evidence and computing answer" },
]

const singleDocumentStages = [
  { icon: Brain, text: "Analyzing request" },
  {
    icon: FileSearch,
    text: "Investigating document for relevant passages",
    component: SearchingPassages,
  },
  { icon: Calculator, text: "Evaluating evidence and computing answer" },
]

const itemVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: "auto", marginBottom: 4 },
}

function FindingDocuments({
  isActive,
  onComplete,
}: {
  isActive: boolean
  onComplete: (text: string) => void
}) {
  const [count, setCount] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [revealedDocuments, setRevealedDocuments] = useState(0)

  useEffect(() => {
    if (isActive && !showResults) {
      const interval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount >= totalDocuments) {
            clearInterval(interval)
            setTimeout(() => {
              setShowResults(true)
              onComplete(`Found ${relevantDocuments.length} relevant documents`)
            }, 1000)
            return prevCount
          }
          return prevCount + Math.floor(Math.random() * 50) + 1
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isActive, showResults, onComplete])

  useEffect(() => {
    if (showResults && revealedDocuments < relevantDocuments.length) {
      const timer = setTimeout(() => {
        setRevealedDocuments((prev) => prev + 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [showResults, revealedDocuments])

  if (!isActive && !showResults) return null

  return (
    <AnimatePresence mode="wait">
      {!showResults ? (
        <motion.div
          key="counting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs"
        >
          Reading through {count.toLocaleString()} /{" "}
          {totalDocuments.toLocaleString()} documents
        </motion.div>
      ) : (
        <motion.ul
          key="results"
          className="mt-1 space-y-0.5 text-xs"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {relevantDocuments.map((doc, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={index < revealedDocuments ? "visible" : "hidden"}
              className="flex items-center"
            >
              <File className="w-3 h-3 mr-1 flex-shrink-0" />
              {doc}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}

function SearchingPassages({
  isActive,
  onComplete,
  isSingleDocument = false,
}: {
  isActive: boolean
  onComplete: (text: string) => void
  isSingleDocument?: boolean
}) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [revealedPassages, setRevealedPassages] = useState(0)

  useEffect(() => {
    if (isActive && !showResults) {
      const interval = setInterval(() => {
        setCurrentFileIndex((prevIndex) => {
          if (isSingleDocument || prevIndex >= relevantDocuments.length - 1) {
            clearInterval(interval)
            setTimeout(() => {
              setShowResults(true)
              onComplete(`Found ${relevantPassages.length} relevant passages`)
            }, 1000)
            return prevIndex
          }
          return prevIndex + 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isActive, showResults, onComplete, isSingleDocument])

  useEffect(() => {
    if (showResults && revealedPassages < relevantPassages.length) {
      const timer = setTimeout(() => {
        setRevealedPassages((prev) => prev + 1)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [showResults, revealedPassages])

  if (!isActive && !showResults) return null

  return (
    <AnimatePresence mode="wait">
      {!showResults ? (
        <motion.div
          key="searching"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs"
        >
          <div className="flex flex-row items-center">
            Analyzing <File className="w-3 h-3 mr-1 ml-2 flex-shrink-0" />
            <span className="font-semibold">
              {isSingleDocument
                ? "Document"
                : relevantDocuments[currentFileIndex]}
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.ul
          key="results"
          className="mt-1 space-y-1 text-xs"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {relevantPassages.map((passage, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate={index < revealedPassages ? "visible" : "hidden"}
            >
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="font-semibold">
                  {isSingleDocument ? "Document" : passage.source}
                </span>
              </div>
              <p className="mt-0.5 ml-4 text-gray-600">
                "
                {passage.text.length > 60
                  ? passage.text.substring(0, 60) + "..."
                  : passage.text}
                "
              </p>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}

export default function ThinkingAnimation({
  isSingleDocument = false,
}: {
  isSingleDocument?: boolean
}) {
  const stages = isSingleDocument
    ? singleDocumentStages
    : multipleDocumentStages
  const [currentStage, setCurrentStage] = useState(0)
  const [stageTexts, setStageTexts] = useState(
    stages.map((stage) => stage.text),
  )
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prevStage) => {
        const nextStage = (prevStage + 1) % stages.length
        setCompletedStages((prev) => new Set(prev).add(prevStage))
        return nextStage
      })
    }, 8000) // Change stage every 8 seconds

    return () => clearInterval(interval)
  }, [stages])

  const handleStageComplete = (stageIndex: number, newText: string) => {
    setStageTexts((prevTexts) => {
      const newTexts = [...prevTexts]
      newTexts[stageIndex] = newText
      return newTexts
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
      <h2 className="text-lg font-bold mb-2 text-center">
        AI Chatbot Thinking
      </h2>
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-3">
        <motion.div
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStage + 1) / stages.length) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {stages.map((stage, index) => (
        <motion.div
          key={index}
          className={`flex items-start mb-1.5 p-1.5 rounded-md ${
            index === currentStage ? "bg-blue-50" : ""
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity:
              index === currentStage || completedStages.has(index) ? 1 : 0.5,
            y: 0,
          }}
          transition={{ duration: 0.5 }}
        >
          <stage.icon
            className={`w-4 h-4 mr-1.5 mt-1 flex-shrink-0 ${getStageTextStyle(
              index,
              currentStage,
              completedStages,
            )}`}
          />
          <div className="flex-grow">
            <span
              className={getStageTextStyle(
                index,
                currentStage,
                completedStages,
              )}
            >
              {stageTexts[index]}
            </span>
            {stage.component && (
              <AnimatePresence>
                {(index === currentStage || completedStages.has(index)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 overflow-hidden"
                  >
                    <stage.component
                      isActive={index === currentStage}
                      onComplete={(newText: string) =>
                        handleStageComplete(index, newText)
                      }
                      isSingleDocument={isSingleDocument}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
