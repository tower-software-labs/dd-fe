import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cn } from "@/lib/utils"

type ProgressSegment = {
  value: number
  color?: string
  label: string
}

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  segments: ProgressSegment[]
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, segments, ...props }, ref) => {
  let cumulativeWidth = 0

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded bg-secondary",
        className,
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        const startPosition = cumulativeWidth
        cumulativeWidth += segment.value

        return (
          <div
            key={index}
            className="absolute top-0 bottom-0 group"
            style={{
              left: `${startPosition}%`,
              width: `${segment.value}%`,
            }}
          >
            <ProgressPrimitive.Indicator
              className={cn(
                "h-full w-full transition-all",
                segment.color ? segment.color : "bg-primary",
              )}
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {segment.label}: {segment.value}%
              </div>
            </div>
          </div>
        )
      })}
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = "Progress"

export { Progress }
