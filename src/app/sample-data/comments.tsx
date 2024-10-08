import { Comment } from "@/types/comment"
import { users } from "./users"

export const comments: Comment[] = [
  {
    id: "1",
    user: users[0],
    text: "We need to review all employment agreements as part of the due diligence process for the venture financing. Can someone please gather these documents?",
    createdAt: "2023-06-01T09:00:00Z",
    updatedAt: "2023-06-01T09:00:00Z",
  },
  {
    id: "2",
    user: users[1],
    text: "I've started collecting the employment agreements. We have about 50 employees, so it might take a day or two to gather everything. Is there a specific format you need these in?",
    createdAt: "2023-06-01T10:30:00Z",
    updatedAt: "2023-06-01T10:30:00Z",
  },
  {
    id: "3",
    user: users[2],
    text: "PDF format would be ideal. Also, please make sure we have the most recent versions of each agreement, including any amendments or addendums.",
    createdAt: "2023-06-01T11:15:00Z",
    updatedAt: "2023-06-01T11:15:00Z",
  },
  {
    id: "4",
    user: users[1],
    text: "Understood. I'll ensure we have the latest versions in PDF. Should we also include any contractor agreements, or just full-time employees?",
    createdAt: "2023-06-01T13:45:00Z",
    updatedAt: "2023-06-01T13:45:00Z",
  },
  {
    id: "5",
    user: users[0],
    text: "Good question. Yes, please include contractor agreements as well. The investors will want to see a complete picture of our workforce arrangements.",
    createdAt: "2023-06-01T14:30:00Z",
    updatedAt: "2023-06-01T14:30:00Z",
  },
  {
    id: "6",
    user: users[3],
    text: "I've noticed some of our older employment agreements might not be up to date with current labor laws. Should we flag these for review?",
    createdAt: "2023-06-02T09:00:00Z",
    updatedAt: "2023-06-02T09:00:00Z",
  },
  {
    id: "7",
    user: users[2],
    text: "Absolutely, please flag any agreements that might need updating. We should also prepare a plan to address these issues before the investors raise any concerns.",
    createdAt: "2023-06-02T10:15:00Z",
    updatedAt: "2023-06-02T10:15:00Z",
  },
]
