import { useProject } from "@/providers/project-provider"
import {
  ChartBarBig,
  ClipboardList,
  Database,
  LayoutGrid,
  LucideIcon,
  Settings,
  Users,
} from "lucide-react"

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  submenus?: Submenu[]
  alignment?: "top" | "bottom"
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getSidebarList(pathname: string): Group[] {
  const { projectId } = useProject()
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/projects",
          label: "Projects",
          active: pathname.split("?")[0].endsWith("projects"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Project Data",
      menus: [
        {
          href: `/dataroom/${projectId}`,
          label: "Data Room",
          active: pathname.includes(`/dataroom/${projectId}`),
          icon: Database,
        },
        {
          href: `/projects/${projectId}`,
          label: "Request List",
          active: pathname.split("?")[0].endsWith(`/projects/${projectId}`),
          icon: ClipboardList,
        },
        {
          href: `/projects/${projectId}/dashboard`,
          label: "Dashboard",
          active: pathname.includes(`/projects/${projectId}/dashboard`),
          icon: ChartBarBig,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          alignment: "bottom",
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          alignment: "bottom",
        },
      ],
    },
  ]
}
