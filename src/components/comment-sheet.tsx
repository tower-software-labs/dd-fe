import { comments } from "@/app/sample-data/comments"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import CommentComponent from "./comment"
import { Button } from "./ui/button"

export interface CommentSheetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function CommentSheet({
  isOpen,
  onOpenChange,
}: CommentSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comment</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
