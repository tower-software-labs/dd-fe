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
        stakeholderStatus: "sellside",
      },
      {
        id: "1.1.1",
        title: "Provide contractor agreements",
        description:
          "Provide all temporary contractor agreements, including but not limited to any fixed-term, project-based, or seasonal employment contracts, for the period commencing January 1, 2022, through the present date.",
        state: null,
        assignee: null,
        stakeholderStatus: "sellside",
        parentTaskId: "1.1",
      },
      {
        id: "1.2",
        title: "Analyze compensation structures",
        description:
          "Evaluate salary ranges, bonus schemes, and benefits packages across all employee levels.",
        state: null,
        assignee: null,
        stakeholderStatus: "sellside",
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
        stakeholderStatus: "buyside",
      },
      {
        id: "2.2",
        title: "Analyze trademark registrations",
        description:
          "Assess all registered trademarks, their territorial coverage, and renewal dates.",
        state: null,
        assignee: null,
        stakeholderStatus: "verified",
      },
    ],
  },
]

export const tasks: Task[] = initialSections.flatMap((section) => section.tasks)
