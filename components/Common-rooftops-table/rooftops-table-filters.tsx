"use client"

import { useState, useRef, useEffect } from "react"

interface FilterValues {
  stage: string
  accountExecutivePOC: string
  financePOC: string
  plan: string
  product: string
  type: string
  subType: string
  region: string
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

  // Filter options
  const filterOptions = {
    stage: ["All Stage", "Contracted", "Onboarding"],
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
        // Also check if the click is not on the filter button itself
        const filterButton = filtersRef.current?.querySelector('button')
        if (filterButton && !filterButton.contains(event.target as Node)) {
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
      stage: "All Stage",
      accountExecutivePOC: "All AE POC",
      financePOC: "All Finance POC",
      plan: "All Plan",
      product: "All Product",
      type: "All Type",
      subType: "All Sub Type",
      region: "All Region"
    }
    onFiltersChange(resetFilters)
    setActiveDropdown(null)
  }

  // Count active filters (not set to "All")
  const activeFiltersCount = Object.values(filterValues).filter(value => !value.startsWith("All")).length

  return (
    <div className="flex items-center justify-between w-full relative" ref={filtersRef}>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Enterprise"
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

      <div className="flex items-center gap-2">
        <div className="relative">
          <button 
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="flex items-center gap-2 h-8 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 min-w-[90px]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
              <path d="M2 4h12M4 8h8m-6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Filter</span>
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
            {/* Stage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'stage' ? null : 'stage')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.stage}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'stage' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'stage' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.stage.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('stage', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
