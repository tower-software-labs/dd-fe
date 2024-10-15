export interface FilterOption {
  name: string
  values: string[]
}

export const dataroomFilterOptions: FilterOption[] = [
  {
    name: "Governing Law",
    values: ["CA - Ontario", "CA - Quebec", "US - New York"],
  },
  {
    name: "State",
    values: ["CA - Ontario", "CA - Quebec", "US - New York"],
  },
]

export interface Filter {
  name: string
  selectedValues: string[]
}

interface FiltersProps {
  selectedFilters: Filter[]
  setSelectedFilters: (filters: Filter[]) => void
}

export default function Filters({
  selectedFilters,
  setSelectedFilters,
}: FiltersProps) {
  return <div>Filters</div>
}
