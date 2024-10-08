import {
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
          href: "/dataroom",
          label: "Data Room",
          active: pathname.includes("/dataroom"),
          icon: Database,
        },
        {
          href: "/request-list",
          label: "Request List",
          active: pathname.includes("/request-list"),
          icon: ClipboardList,
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
