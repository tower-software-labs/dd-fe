import { Card } from "@/components/ui/card"
import UserAvatarSmall from "@/components/user-avatar"
import { Comment } from "@/types/comment"

interface CommentProps {
  comment: Comment
}

export default function CommentComponent({ comment }: CommentProps) {
  const { user, text, createdAt } = comment
  console.log("COMMENT", comment)

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <UserAvatarSmall user={user} showFullName={true} />
        <div className="sm:ml-auto text-sm text-muted-foreground">
          {createdAt}
        </div>
      </div>
      <p className="text-sm">{text}</p>
    </Card>
  )
}
