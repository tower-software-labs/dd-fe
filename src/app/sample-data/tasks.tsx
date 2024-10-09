import { Section, Task } from "@/types/task"
import { users } from "./users"
export const initialSections: Section[] = [
  {
    id: "1",
    title: "Employment Matters",
    tasks: [
      {
        id: "1.1",
        title: "Review employment agreements",
        description:
          "Analyze all current employment contracts for compliance with labor laws and company policies.",
        state: null,
        assignee: users[0],
        verified: false,
      },
      {
        id: "1.2",
        title: "Analyze compensation structures",
        description:
          "Evaluate salary ranges, bonus schemes, and benefits packages across all employee levels.",
        state: null,
        assignee: null,
        verified: false,
      },
    ],
  },
  {
    id: "2",
    title: "Intellectual Property",
    tasks: [
      {
        id: "2.1",
        title: "Review patent portfolio",
        description:
          "Examine all existing patents, their current status, and potential infringement risks.",
        state: null,
        assignee: null,
        verified: false,
      },
      {
        id: "2.2",
        title: "Analyze trademark registrations",
        description:
          "Assess all registered trademarks, their territorial coverage, and renewal dates.",
        state: null,
        assignee: null,
        verified: false,
      },
    ],
  },
]

export const tasks: Task[] = initialSections.flatMap((section) => section.tasks)
