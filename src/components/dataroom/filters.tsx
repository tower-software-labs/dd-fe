"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, SearchIcon, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction } from "react"

export interface FilterOption {
  name: string
  values: string[] | Record<string, string[]>
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Illinois",
  "Indiana",
  "Kentucky",
  "Louisiana",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Nevada",
  "New Jersey",
  "New York",
  "North Carolina",
  "Ohio",
  "Oregon",
  "Pennsylvania",
  "Tennessee",
  "Texas",
  "Virginia",
  "Washington",
  "Wisconsin",
]

const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
]

export const dataroomFilterOptions: FilterOption[] = [
  {
    name: "Governing Law",
    values: {
      "United States": US_STATES,
      Canada: CANADIAN_PROVINCES,
    },
  },
  {
    name: "Expiration",
    values: ["Expired", "Expiring Soon", "In Effect", "Auto-Renewal"],
  },
]

export interface Filter {
  name: string
  selectedValues: string[]
}

interface FiltersProps {
  selectedFilters: Filter[]
  setSelectedFilters: Dispatch<SetStateAction<Filter[]>>
}

export default function FilterPopover({
  selectedFilters,
  setSelectedFilters,
}: FiltersProps) {
  const toggleFilter = (filterName: string, value: string) => {
    setSelectedFilters((prevFilters: Filter[]) => {
      const existingFilter = prevFilters.find((f) => f.name === filterName)
      if (existingFilter) {
        if (existingFilter.selectedValues.includes(value)) {
          // Remove the value if it's already selected
          const updatedFilters = prevFilters.map((f) =>
            f.name === filterName
              ? {
                  ...f,
                  selectedValues: f.selectedValues.filter((v) => v !== value),
                }
              : f,
          )
          // Remove the filter if no values are selected
          return updatedFilters.filter((f) => f.selectedValues.length > 0)
        } else {
          // Add the value if it's not selected
          return prevFilters.map((f) =>
            f.name === filterName
              ? { ...f, selectedValues: [...f.selectedValues, value] }
              : f,
          )
        }
      } else {
        // Add a new filter if it doesn't exist
        return [...prevFilters, { name: filterName, selectedValues: [value] }]
      }
    })
  }

  const isValueSelected = (filterName: string, value: string) => {
    const filter = selectedFilters.find((f) => f.name === filterName)
    return filter ? filter.selectedValues.includes(value) : false
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center max-w-64 overflow-hidden"
        >
          <Filter className="h-4 w-4" />
          <span
            className={`text-xs font-semibold ${selectedFilters.length > 0 ? "ml-2" : "0"}`}
          >
            {selectedFilters.map((filter) => filter.name).join(", ")}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {dataroomFilterOptions.map((filter) => (
            <div key={filter.name} className="space-y-2">
              <label className="text-sm font-medium">{filter.name}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-fit justify-between p-2"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedFilters
                        .find((f) => f.name === filter.name)
                        ?.selectedValues.map((value) => (
                          <Badge
                            key={value}
                            variant="outline"
                            className="text-xs"
                          >
                            {value}
                            <button
                              className="ml-1 hover:text-red-500"
                              onClick={() => toggleFilter(filter.name, value)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      {(!selectedFilters.find((f) => f.name === filter.name) ||
                        selectedFilters.find((f) => f.name === filter.name)
                          ?.selectedValues.length === 0) && (
                        <span className="text-xs text-gray-500">Select</span>
                      )}
                    </div>
                    <SearchIcon className="h-4 w-4 m-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${filter.name.toLowerCase()}...`}
                    />
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandList>
                      {Array.isArray(filter.values) ? (
                        <CommandGroup>
                          {filter.values.map((value) => (
                            <CommandItem
                              key={value}
                              onSelect={() => toggleFilter(filter.name, value)}
                              className="cursor-pointer"
                            >
                              <Checkbox
                                checked={isValueSelected(filter.name, value)}
                                className="mr-2"
                              />
                              {value}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        Object.entries(filter.values).map(
                          ([groupName, groupValues]) => (
                            <CommandGroup key={groupName} heading={groupName}>
                              {groupValues.map((value) => (
                                <CommandItem
                                  key={value}
                                  onSelect={() =>
                                    toggleFilter(filter.name, value)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Checkbox
                                    checked={isValueSelected(
                                      filter.name,
                                      value,
                                    )}
                                    className="mr-2"
                                  />
                                  {value}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ),
                        )
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
