"use client"

import { useBreadcrumbs } from "@/providers/breadcrumb-provider"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { users } from "@/app/sample-data/users"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Page() {
  const router = useRouter()
  const { setBreadcrumbs } = useBreadcrumbs()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [projectDescription, setProjectDescription] = useState<string>()

  useEffect(() => {
    setBreadcrumbs([
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
      { href: "/projects/new", label: "Create New Project" },
    ])
  }, [setBreadcrumbs])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted")
    router.push("/projects/12345/new") // Redirect to projects list page after submission
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input id="project-name" placeholder="Enter project name" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input id="client-name" placeholder="Enter client name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-name">Matter Number</Label>
            <Input
              id="client-name"
              placeholder="Enter number of matter associated with project "
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !startDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  classNames={{
                    months:
                      "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full mt-2",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Expected Completion Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !endDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  classNames={{
                    months:
                      "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full mt-2",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* # external stakeholders
          # internal stakeholders */}

        <div className="space-y-2">
          <Label>Add Team Members</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={"w-full justify-start text-left font-normal "}
              >
                {selectedTeamMembers.length > 0
                  ? `${selectedTeamMembers.length} members selected`
                  : "Select team members to staff on project"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>No team member found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          setSelectedTeamMembers((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((item) => item !== user.id)
                              : [...prev, user.id],
                          )
                        }}
                      >
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                            selectedTeamMembers.includes(user.id)
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                        >
                          {selectedTeamMembers.includes(user.id) && "✓"}
                        </div>
                        {user.first_name + " " + user.last_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </div>
  )
}
