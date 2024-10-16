import {
  ArrowUpRight,
  CalendarCheck,
  CircleAlert,
  Hourglass,
  Zap,
} from "lucide-react"
import { Button } from "../ui/button"

interface DocumentExpirationSummaryProps {
  expired: number
  expiringSoon: number
  inEffect: number
  autoRenewal: number
}

export default function DocumentExpirationSummary({
  expired,
  expiringSoon,
  inEffect,
  autoRenewal,
}: DocumentExpirationSummaryProps) {
  const statusItems = [
    {
      title: "Expired",
      icon: CircleAlert,
      color: "text-red-500",
      count: expired,
    },
    {
      title: "Expiring soon",
      icon: Hourglass,
      color: "text-orange-500",
      count: expiringSoon,
    },
    {
      title: "In effect",
      icon: CalendarCheck,
      color: "text-gray-900",
      count: inEffect,
    },
    {
      title: "Auto renewal",
      icon: Zap,
      color: "text-blue-500",
      count: autoRenewal,
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 space-y-4"
          >
            <div className="flex items-center">
              <item.icon className="w-4 h-4 mr-2" />
              <h2 className="text-md font-semibold">{item.title}</h2>
            </div>
            <p className="text-3xl font-bold">
              <span className={item.color}>{item.count}</span>
            </p>
            <Button variant="link" className="hover:text-blue-600 px-0">
              <span>See all documents</span>
              <ArrowUpRight className="w-4 h-4 ml-1 text-blue-600" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
