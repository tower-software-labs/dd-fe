"use client"

import { users } from "@/app/sample-data/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { useProject } from "@/providers/project-provider"
import { statusData } from "@/types/analytics"
import { User } from "@/types/user"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { FaFileSignature } from "react-icons/fa"
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io"
import { IoAlbumsSharp, IoDocumentsSharp } from "react-icons/io5"
import { LiaCogSolid } from "react-icons/lia"
import { TbAdjustmentsPin } from "react-icons/tb"
import { Label, Pie, PieChart } from "recharts"
import {
  demoDocumentsData,
  demoRequestsData,
} from "../../../sample-data/analytics"

export interface DashboardPageProps {
  slug: string
  isActive?: boolean
  daysActive?: number
  membersList?: User[]
}

export default function DashboardPage({
  slug = "",
  isActive = true,
  daysActive = 43,
  membersList = users,
}: DashboardPageProps) {
  const { setBreadcrumbs } = useBreadcrumbs()
  const { setProjectId } = useProject()

  const requestsChartConfig = {
    process: {
      label: "Requests",
    },
    inprogress: {
      label: "In Progress",
      color: "hsl(var(--chart-1))",
    },
    fulfilled: {
      label: "Fulfilled",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const documentsChartConfig = {
    process: {
      label: "Documents",
    },
    reviewed: {
      label: "Reviewed",
      color: "hsl(var(--chart-2))",
    },
    inprogress: {
      label: "In Progress",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true)
  const [isRequestsOpen, setIsRequestsOpen] = useState(false)

  const [requestsData, setRequestsData] = useState<statusData[]>([])
  const [totalRequests, setTotalRequests] = useState<number>(0)
  const [completedRequests, setCompletedRequests] = useState<number>(0)
  const [assignedRequests, setAssignedRequests] = useState<number>(0)

  const [documentsData, setDocumentsData] = useState<statusData[]>([])
  const [totalDocuments, setTotalDocuments] = useState<number>(0)
  const [completedDocuments, setCompletedDocuments] = useState<number>(0)
  const [assignedDocuments, setAssignedDocuments] = useState<number>(0)

  const requestsChartData = [
    {
      status: "fulfilled",
      number: completedRequests,
      fill: "var(--color-fulfilled)",
    },
    {
      status: "inprogress",
      number: totalRequests - completedRequests,
      fill: "var(--color-inprogress)",
    },
  ]

  const documentsChartData = [
    {
      status: "reviewed",
      number: completedDocuments,
      fill: "var(--color-reviewed)",
    },
    {
      status: "inprogress",
      number: totalDocuments - completedDocuments,
      fill: "var(--color-inprogress)",
    },
  ]

  useEffect(() => {
    setBreadcrumbs([
      { href: "/projects", label: "Projects" },
      { href: `/projects/${slug}`, label: "Walterson Deal" },
      { href: `/projects/${slug}/dashboard`, label: "Dashboard" },
    ])
    setProjectId(slug)
  }, [setBreadcrumbs])

  useEffect(() => {
    setRequestsData(demoRequestsData)
    setDocumentsData(demoDocumentsData)
  }, [])

  useEffect(() => {
    setTotalRequests(requestsData.reduce((acc, curr) => acc + curr.total, 0))
    setCompletedRequests(
      requestsData.reduce((acc, curr) => acc + curr.completed, 0),
    )
    setAssignedRequests(
      requestsData.reduce((acc, curr) => acc + curr.assigned, 0),
    )

    setTotalDocuments(documentsData.reduce((acc, curr) => acc + curr.total, 0))
    setCompletedDocuments(
      documentsData.reduce((acc, curr) => acc + curr.completed, 0),
    )
    setAssignedDocuments(
      documentsData.reduce((acc, curr) => acc + curr.assigned, 0),
    )
  }, [requestsData, documentsData])

  const toggleIsDocumentsOpen = () => {
    setIsDocumentsOpen(!isDocumentsOpen)
    setIsRequestsOpen(false)
  }

  const toggleIsRequestsOpen = () => {
    setIsDocumentsOpen(false)
    setIsRequestsOpen(!isRequestsOpen)
  }

  return (
    <Card className="w-full mx-auto border-none">
      <CardHeader className="p-0">
        <Button
          variant="ghost"
          className="w-full h-auto flex flex-col items-stretch rounded-none hover:bg-transparent cursor-default"
        >
          <div className="flex justify-between items-center p-4">
            {isDocumentsOpen || isRequestsOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <CardTitle>
              <a href="" className="flex flex-row">
                <LiaCogSolid className="mr-2" />
                Edit Project
              </a>
            </CardTitle>
          </div>

          <div className="grid grid-cols-5 gap-2 p-2">
            {/* basic info about dataroom */}
            <Card className="m-0 col-span-1 flex flex-col h-full">
              <CardHeader className="text-left m-0 space-y-0 p-2">
                <CardTitle>
                  <div className="flex items-center space-x-2 m-0">
                    {isActive && (
                      <>
                        <IoIosCheckmarkCircle className="fill-green-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {"Dataroom is Active"}
                        </span>
                      </>
                    )}
                    {!isActive && (
                      <>
                        <IoIosCloseCircle className="fill-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {"Dataroom is Inactive"}
                        </span>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-2 flex-grow flex flex-col justify-between m-2">
                <div className="flex flex-col text-left space-y-16">
                  <div className="text-gray-400">Since</div>
                  <div className="flex flex-row items-end">
                    <div className="text-6xl">{daysActive}</div>
                    <div className="ml-2 mb-2 text-gray-400">{"Days"}</div>
                  </div>
                  <div className="flex flex-row justify-between text-gray-400">
                    <span>{"Total Members:"}</span>
                    <span>{membersList.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* data about documents */}
            <Card
              className={`m-0 col-span-2 cursor-pointer ${
                isDocumentsOpen ? "ring-1 ring-primary bg-gray-100" : ""
              }`}
              onClick={() => toggleIsDocumentsOpen()}
            >
              <CardHeader className="text-left m-0 space-y-0 p-2">
                <CardTitle>
                  {" "}
                  <div className="flex items-center space-x-2 m-0">
                    <>
                      <IoDocumentsSharp className="" />
                      <span className="text-sm font-medium text-gray-700">
                        {"Documents Reviewed"}
                      </span>
                    </>
                  </div>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-2">
                <ChartContainer
                  config={documentsChartConfig}
                  className="mx-auto aspect-square max-h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={documentsChartData}
                      dataKey="number"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                      labelLine={false}
                      label={({ payload, ...props }) => {
                        return (
                          <text
                            cx={props.cx}
                            cy={props.cy}
                            x={props.x}
                            y={props.y}
                            textAnchor={props.textAnchor}
                            dominantBaseline={props.dominantBaseline}
                            fill="hsla(var(--foreground))"
                          >
                            {`${
                              documentsChartConfig[
                                payload.status as keyof typeof documentsChartConfig
                              ]?.label
                            }`}
                          </text>
                        )
                      }}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalDocuments.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Total
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* data about requests */}
            <Card
              className={`m-0 w-full col-span-2 cursor-pointer ${
                isRequestsOpen ? "ring-1 ring-primary bg-gray-100" : ""
              }`}
              onClick={() => toggleIsRequestsOpen()}
            >
              <CardHeader className="text-left m-0 space-y-0 p-2">
                <CardTitle>
                  {" "}
                  <div className="flex items-center space-x-2 m-0">
                    <>
                      <TbAdjustmentsPin className="fill-green-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {"DD Requests Fulfilled"}
                      </span>
                    </>
                  </div>
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-2 cursor-pointer">
                <ChartContainer
                  config={requestsChartConfig}
                  className="mx-auto aspect-square max-h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={requestsChartData}
                      dataKey="number"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                      labelLine={false}
                      label={({ payload, ...props }) => {
                        return (
                          <text
                            cx={props.cx}
                            cy={props.cy}
                            x={props.x}
                            y={props.y}
                            textAnchor={props.textAnchor}
                            dominantBaseline={props.dominantBaseline}
                            fill="hsla(var(--foreground))"
                          >
                            {`${
                              requestsChartConfig[
                                payload.status as keyof typeof requestsChartConfig
                              ]?.label
                            }`}
                          </text>
                        )
                      }}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalRequests.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Total
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </Button>
      </CardHeader>

      <CardContent className={`p-4 ${isDocumentsOpen ? "" : "hidden"} mx-2`}>
        <Card>
          <CardHeader className="text-left m-0 space-y-0 p-2">
            <CardTitle>
              <div className="flex items-center space-x-2 m-0">
                <FaFileSignature />

                <span className="text-sm font-medium text-gray-700">
                  {"Documents Reviewed"}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-2 flex-grow flex flex-col justify-between">
            <div className="hover:bg-gray-100 cursor-pointer p-2 rounded space-y-2">
              <div className="text-gray-400 text-sm flex flex-row justify-between ">
                <span>{"Total"}</span>
                <span className="space-x-2">
                  <span>{completedDocuments + " of " + totalDocuments}</span>
                  <Badge className="transform translate-y-[-1px]">
                    {Math.round((completedDocuments / totalDocuments) * 100) +
                      "%"}
                  </Badge>
                </span>
              </div>
              <Progress
                segments={[
                  {
                    value: Math.round(
                      (completedDocuments / totalDocuments) * 100,
                    ),
                    label: "Fulfilled",
                  },
                ]}
              />
            </div>
            {documentsData.map((document) => (
              <div className="hover:bg-gray-100 cursor-pointer p-2 rounded space-y-2">
                <div className="text-gray-400 text-sm flex flex-row justify-between ">
                  <span>{document.name}</span>
                  <span className="space-x-2">
                    <span>{document.completed + " of " + document.total}</span>
                    <Badge className="transform translate-y-[-1px]">
                      {Math.round((document.completed / document.total) * 100) +
                        "%"}
                    </Badge>
                  </span>
                </div>
                <Progress
                  segments={[
                    {
                      value: Math.round(
                        (completedRequests / totalRequests) * 100,
                      ),
                      label: "Fulfilled",
                      color: "bg-gray-400",
                    },
                  ]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>

      <CardContent className={`p-4 ${isRequestsOpen ? "" : "hidden"} mx-2`}>
        <Card>
          <CardHeader className="text-left m-0 space-y-0 p-2">
            <CardTitle>
              <div className="flex items-center space-x-2 m-0">
                <IoAlbumsSharp />
                <span className="text-sm font-medium text-gray-700">
                  {"DD Requests Fulfilled"}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-2 flex-grow flex flex-col justify-between">
            <div className="hover:bg-gray-100 cursor-pointer p-2 rounded space-y-2">
              <div className="text-gray-400 text-sm flex flex-row justify-between ">
                <span>{"Total"}</span>
                <span className="space-x-2">
                  <span>{completedRequests + " of " + totalRequests}</span>
                  <Badge className="transform translate-y-[-1px]">
                    {Math.round((completedRequests / totalRequests) * 100) +
                      "%"}
                  </Badge>
                </span>
              </div>
              <Progress
                segments={[
                  {
                    value: Math.round(
                      (completedRequests / totalRequests) * 100,
                    ),
                    label: "Fulfilled",
                  },
                ]}
              />
            </div>
            {requestsData.map((request) => (
              <div className="hover:bg-gray-100 cursor-pointer p-2 rounded space-y-2">
                <div className="text-gray-400 text-sm flex flex-row justify-between ">
                  <span>{request.name}</span>
                  <span className="space-x-2">
                    <span>{request.completed + " of " + request.total}</span>
                    <Badge className="transform translate-y-[-1px]">
                      {Math.round((request.completed / request.total) * 100) +
                        "%"}
                    </Badge>
                  </span>
                </div>
                <Progress
                  segments={[
                    {
                      value: Math.round(
                        (completedRequests / totalRequests) * 100,
                      ),
                      label: "Fulfilled",
                      color: "bg-gray-400",
                    },
                  ]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
