"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getSidebarList } from "@/lib/sidebar-list"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const sidebarList = getSidebarList(pathname)

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-16 flex-col border-r bg-background">
      <div className="flex h-14 items-center justify-center border-b">
        <Link href="#">
          <span className="text-2xl font-bold">L</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-4 p-2">
            {sidebarList.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.menus
                  .filter((menu) => menu.alignment !== "bottom")
                  .map((menu) => (
                    <TooltipProvider key={menu.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={menu.active ? "secondary" : "ghost"}
                            className={cn(
                              "h-12 w-12 my-0.5",
                              menu.active && "bg-secondary",
                            )}
                            asChild
                          >
                            <Link href={menu.href}>
                              {menu.icon && <menu.icon className="h-5 w-5" />}
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{menu.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <nav className="flex flex-col gap-4 p-2">
          {sidebarList
            .flatMap((group) =>
              group.menus.filter((menu) => menu.alignment === "bottom"),
            )
            .map((menu) => (
              <TooltipProvider key={menu.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={menu.active ? "secondary" : "ghost"}
                      className={cn(
                        "h-12 w-12 p-0",
                        menu.active && "bg-secondary",
                      )}
                      asChild
                    >
                      <Link href={menu.href}>
                        {menu.icon && <menu.icon className="h-5 w-5" />}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{menu.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </nav>
      </div>
    </aside>
  )
}
