"use client"

import { useState, useRef, useEffect } from "react"
import { ApiService } from "@/app/services/api"

interface FilterValues {
  region_type: string
  account_type: string
  account_sub_type: string
  ae_id: string
  sub_stage: string
  contractedOnly: boolean
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
  
  // State for AE POC options
  const [aePocOptions, setAePocOptions] = useState<Array<{ name: string; userId: string }>>([{ name: "All POC", userId: "All POC" }])
  const [aePocLoading, setAePocLoading] = useState(false)

  // Filter options - only for API-supported filters
  const filterOptions = {
    region_type: ["All Region", "AMER", "AMEA", "APAC", "EMEA", "OTHERS"],
    account_type: ["All Type", "AUCTION_PLATFORM", "CAR_RENTAL_LEASING", "D2D", "FRANCHISE_DEALER", "INDEPENDENT_DEALER", "MARKETPLACE", "PARTNER", "OTHERS", "GROUP_DEALER", "INDIVIDUAL_DEALER"],
    account_sub_type: ["All Sub Type", "INDEPENDENT_DEALER", "FRANCHISE_DEALER"],
    ae_id: aePocOptions, // Now dynamic from API with name and userId
    sub_stage: ["All Sub Stage", "Meet Pending", "Meet Scheduled", "Meet Done", "Meet Cancelled", "Drop off"]
  }

  // Fetch AE POC options on component mount
  useEffect(() => {
    const fetchAePocOptions = async () => {
      try {
        setAePocLoading(true)
        const response = await ApiService.getAePocNames()
        
        if (response && response.data && Array.isArray(response.data)) {
          // Extract names and userIds from the response and add "All POC" as the first option
          const pocOptions = response.data
            .filter(poc => poc.name && poc.name.trim() !== '' && poc.userId)
            .map(poc => ({ name: poc.name, userId: poc.userId }))
          setAePocOptions([{ name: "All POC", userId: "All POC" }, ...pocOptions])
        } else {
          console.warn('Invalid response format for AE POC names:', response)
          // Keep default options if API fails
        }
      } catch (error) {
        console.error('Failed to fetch AE POC names:', error)
        // Keep default options if API fails
      } finally {
        setAePocLoading(false)
      }
    }

    // Only fetch if we don't already have options (beyond the default "All POC")
    if (aePocOptions.length <= 1) {
      fetchAePocOptions()
    }
  }, [aePocOptions.length])

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

  // Helper function to get display name for AE POC filter
  const getAePocDisplayName = (userId: string) => {
    const pocOption = aePocOptions.find(option => option.userId === userId)
    return pocOption ? pocOption.name : userId
  }

  const handleResetAll = () => {
    const resetFilters: FilterValues = {
      region_type: "All Region",
      account_type: "All Type",
      account_sub_type: "All Sub Type",
      ae_id: "All POC",
      sub_stage: "All Sub Stage",
      contractedOnly: false
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


  // Count active filters (not set to "All" or default values)
  const activeFiltersCount = Object.entries(filterValues).filter(([key, value]) => {
    if (key === 'contractedOnly') return value === true
    return typeof value === 'string' && !value.startsWith("All")
  }).length

  return (
    <div className="flex items-center justify-between w-full relative" ref={filtersRef}>
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-[214px] h-8 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white placeholder-gray-500"
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
              <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${filterValues.contractedOnly ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${filterValues.contractedOnly ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>
        </div>


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
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
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
            {/* Region Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region Type</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'region_type' ? null : 'region_type')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.region_type}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'region_type' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'region_type' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.region_type.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('region_type', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Account Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'account_type' ? null : 'account_type')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.account_type}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'account_type' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'account_type' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.account_type.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('account_type', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Account Sub Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Sub Type</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'account_sub_type' ? null : 'account_sub_type')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.account_sub_type}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'account_sub_type' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'account_sub_type' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.account_sub_type.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('account_sub_type', option)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AE ID Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AE POC</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'ae_id' ? null : 'ae_id')}
                  disabled={aePocLoading}
                  className={`w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 ${aePocLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span>{aePocLoading ? 'Loading POCs...' : getAePocDisplayName(filterValues.ae_id)}</span>
                  {aePocLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'ae_id' ? 'rotate-180' : ''}`}>
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                {activeDropdown === 'ae_id' && !aePocLoading && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.ae_id.map((option) => (
                      <button
                        key={option.userId}
                        onClick={() => handleFilterChange('ae_id', option.userId)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub Stage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Stage</label>
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'sub_stage' ? null : 'sub_stage')}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50"
                >
                  <span>{filterValues.sub_stage}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-400 transition-transform ${activeDropdown === 'sub_stage' ? 'rotate-180' : ''}`}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {activeDropdown === 'sub_stage' && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {filterOptions.sub_stage.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange('sub_stage', option)}
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
