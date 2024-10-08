"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type Alert = {
  id: string
  title: string
  description: string
  timestamp: string
  link: string
}

const alertData: Alert[] = [
  {
    id: "1",
    title: "New Message",
    description: "You have received a new message from John Doe",
    timestamp: "5 min ago",
    link: "/messages/1",
  },
  {
    id: "2",
    title: "Order Shipped",
    description: "Your order #12345 has been shipped",
    timestamp: "2 hours ago",
    link: "/orders/12345",
  },
  {
    id: "3",
    title: "Payment Successful",
    description: "Your payment of $99.99 has been processed",
    timestamp: "1 day ago",
    link: "/payments/99",
  },
]

export default function NotificationDrawer() {
  const [alerts, setAlerts] = useState<Alert[]>(alertData)

  const hasAlerts = alerts.length > 0

  const clearAlert = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasAlerts && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">
            {hasAlerts ? `${alerts.length} unread alerts` : "No alerts"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {hasAlerts ? (
          alerts.map((alert) => (
            <DropdownMenuItem key={alert.id} asChild>
              <Link
                href={alert.link}
                className="flex items-start py-2 px-4 hover:bg-accent"
              >
                <div className="flex-grow">
                  <div className="flex flex-col">
                    <span className="font-semibold">{alert.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {alert.description}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => clearAlert(e, alert.id)}
                  className="h-6 w-6 ml-2 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear alert</span>
                </Button>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No new alerts</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
