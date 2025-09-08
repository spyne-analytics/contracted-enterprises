"use client"

import { useState, useRef, useEffect } from "react"

interface FilterValues {
  accountExecutivePOC: string
  financePOC: string
  plan: string
  product: string
  type: string
  subType: string
  region: string
  contractedOnly: boolean
  contractedDate: {
    from: string
    to: string
  }
}

interface RooftopsTableFiltersProps {
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: FilterValues) => void
  searchValue: string
  filterValues: FilterValues
}

export function RooftopsTableFilters({
  onSearchChange,
  onFiltersChange,
  searchValue,
  filterValues,
}: RooftopsTableFiltersProps) {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const filtersPanelRef = useRef<HTMLDivElement>(null)
  const moreFiltersButtonRef = useRef<HTMLButtonElement>(null)

  // Filter options
  const filterOptions = {
    accountExecutivePOC: ["All AE POC", "John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
    financePOC: ["All Finance POC", "Emily Rodriguez", "David Chen", "Sarah Johnson", "Michael Brown"],
    plan: ["All Plan", "Image", "360 Spin", "Video Tour"],
    product: ["All Product", "Studio AI", "Converse AI"],
    type: ["All Type", "Franchise dealer", "Independent Dealer"],
    subType: ["All Sub Type", "Franchise dealer", "Independent Dealer"],
    region: ["All Region", "AMER", "AMEA", "APAC", "EMEA", "LATAM"]
  }

  // Close filters panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the filter panel (but allow clicks on the filter button)
      if (filtersPanelRef.current && !filtersPanelRef.current.contains(event.target as Node)) {
        // Also check if the click is not on the "More Filters" button itself
        if (moreFiltersButtonRef.current && !moreFiltersButtonRef.current.contains(event.target as Node)) {
          setShowFiltersPanel(false)
          setActiveDropdown(null)
        }
      }
    }

    // Only add the event listener when the filters panel is open
    if (showFiltersPanel) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFiltersPanel])

  const handleFilterChange = (filterType: keyof FilterValues, value: string) => {
    const newFilters = { ...filterValues, [filterType]: value }
    onFiltersChange(newFilters)
    setActiveDropdown(null)
  }

  const handleResetAll = () => {
    const resetFilters: FilterValues = {
      accountExecutivePOC: "All AE POC",
      financePOC: "All Finance POC",
      plan: "All Plan",
      product: "All Product",
      type: "All Type",
      subType: "All Sub Type",
      region: "All Region",
      contractedOnly: false,
      contractedDate: {
        from: "",
        to: ""
      }
    }
    onFiltersChange(resetFilters)
    setActiveDropdown(null)
  }

  const handleContractedOnlyToggle = () => {
    const newFilters = { 
      ...filterValues, 
      contractedOnly: !filterValues.contractedOnly
    }
    onFiltersChange(newFilters)
  }

  const handleContractedDateChange = (field: 'from' | 'to', value: string) => {
    const newFilters = {
      ...filterValues,
      contractedDate: {
        ...filterValues.contractedDate,
        [field]: value
      }
    }
    onFiltersChange(newFilters)
  }

  const handleDateRangeSelect = (range: string) => {
    const today = new Date()
    let from = ""
    let to = ""

    // Reset custom mode for preset ranges
    setIsCustomMode(false)

    switch (range) {
      case "Today":
        from = to = today.toISOString().split('T')[0]
        break
      case "This Week":
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        from = startOfWeek.toISOString().split('T')[0]
        to = endOfWeek.toISOString().split('T')[0]
        break
      case "This Month":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        from = startOfMonth.toISOString().split('T')[0]
        to = endOfMonth.toISOString().split('T')[0]
        break
      case "All Dates":
        from = ""
        to = ""
        break
    }

    const newFilters = {
      ...filterValues,
      contractedDate: { from, to }
    }
    onFiltersChange(newFilters)
    setActiveDropdown(null)
  }

  // Track if we're in custom mode
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Get display text for contracted date filter
  const getContractedDateDisplay = () => {
    const { from, to } = filterValues.contractedDate
    
    // If we're explicitly in custom mode or have partial dates, show Custom
    if (isCustomMode || (from && to && from !== to)) {
      return "Custom"
    }
    
    if (!from && !to) return "All Dates"
    
    const today = new Date().toISOString().split('T')[0]
    if (from === today && to === today) return "Today"
    
    // Check if it's this week
    const todayDate = new Date()
    const startOfWeek = new Date(todayDate)
    startOfWeek.setDate(todayDate.getDate() - todayDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    if (from === startOfWeek.toISOString().split('T')[0] && to === endOfWeek.toISOString().split('T')[0]) {
      return "This Week"
    }
    
    // Check if it's this month
    const startOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
    const endOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0)
    
    if (from === startOfMonth.toISOString().split('T')[0] && to === endOfMonth.toISOString().split('T')[0]) {
      return "This Month"
    }
    
    return "Custom"
  }

  // Count active filters (not set to "All" or default values)
  const activeFiltersCount = Object.entries(filterValues).filter(([key, value]) => {
    if (key === 'contractedOnly') return value === true
    if (key === 'contractedDate') return value.from !== "" || value.to !== ""
    return typeof value === 'string' && !value.startsWith("All")
  }).length

  return (
    <div className="flex items-center justify-between w-full relative" ref={filtersRef}>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Rooftop"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-[214px] h-8 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
              <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Filters - Right Aligned */}
      <div className="flex items-center gap-4">
        {/* Contracted Only Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <span className="font-regular">Contracted Only</span>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={filterValues.contractedOnly}
                onChange={handleContractedOnlyToggle}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${filterValues.contractedOnly ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${filterValues.contractedOnly ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>
        </div>

        {/* Contracted Date Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 font-regular">Contracted Date:</span>
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'contractedDate' ? null : 'contractedDate')}
              className="flex items-center justify-between h-8 px-3 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 min-w-[120px]"
            >
              <span>{getContractedDateDisplay()}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'contractedDate' ? 'rotate-180' : ''}`}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {activeDropdown === 'contractedDate' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[140px]">
                {["All Dates", "Today", "This Week", "This Month", "Custom"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (option === "Custom") {
                        // Enable custom mode to show date inputs
                        setIsCustomMode(true)
                        setActiveDropdown(null)
                      } else {
                        handleDateRangeSelect(option)
                      }
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Date Range Inputs - Show when in custom mode */}
        {isCustomMode && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterValues.contractedDate.from}
              onChange={(e) => handleContractedDateChange('from', e.target.value)}
              className="h-8 px-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="From"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={filterValues.contractedDate.to}
              onChange={(e) => handleContractedDateChange('to', e.target.value)}
              className="h-8 px-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="To"
            />
          </div>
        )}

        {/* Main Filter Dropdown */}
        <div className="relative">
          <button 
            ref={moreFiltersButtonRef}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center gap-2 h-8 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 min-w-[90px]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
              <path d="M2 4h12M4 8h8m-6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>More Filters</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-600 transition-transform ${showFiltersPanel ? 'rotate-180' : ''}`}>
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {activeFiltersCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div ref={filtersPanelRef} className="absolute top-12 right-0 w-[800px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button 
              onClick={handleResetAll}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* AE POC Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AE POC</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'accountExecutivePOC' ? null : 'accountExecutivePOC')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.accountExecutivePOC}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'accountExecutivePOC' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'accountExecutivePOC' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.accountExecutivePOC.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('accountExecutivePOC', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Finance POC Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Finance POC</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'financePOC' ? null : 'financePOC')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.financePOC}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'financePOC' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'financePOC' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.financePOC.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('financePOC', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Studio AI Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Studio AI</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'plan' ? null : 'plan')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.plan}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'plan' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'plan' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.plan.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('plan', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'product' ? null : 'product')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.product}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'product' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.product.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('product', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.type}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'type' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.type.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('type', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Type</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'subType' ? null : 'subType')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.subType}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'subType' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'subType' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.subType.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('subType', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'region' ? null : 'region')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.region}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'region' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'region' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.region.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('region', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
