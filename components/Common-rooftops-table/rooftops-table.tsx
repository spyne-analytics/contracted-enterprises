"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { RooftopsTableFilters } from "./rooftops-table-filters"
import { RooftopsTableHeader } from "./rooftops-table-header"
import { RooftopsTableRow } from "./rooftops-table-row"
import { SkeletonLoader, InfiniteScrollSkeleton } from "./skeleton-loader"
import type { RooftopData, RooftopsData } from "@/app/types"
import { ApiService } from "@/app/services/api"

interface FilterValues {
  region_type: string
  account_type: string
  account_sub_type: string
  ae_id: string
  sub_stage: string
  contractedOnly: boolean
}

// Type options for mapping existing data
const typeOptions = [
  "Partner",
  "Car Rental Leasing", 
  "Auction Platform",
  "Marketplace",
  "Individual Dealer",
  "Group Dealer",
]

const subTypeOptions = ["Independent Dealer", "Franchise dealer"]

// Sub Stage options based on the workflow
const subStageOptions = [
  "NA",
  "Meet Pending",
  "Meet Scheduled", 
  "Meet Reschedule",
  "Meet Done",
  "Meet Cancelled",
  "Drop Off"
]

const platformOptions = [
  "API to API",
  "App to API",
  "APP to APP",
  "App to Console",
  "App to FTP",
  "Console to Console",
  "FTP to FTP",
  "Catalogue"
]

const regionOptions = [
  "AMER", 
  "AMEA",
  "APAC",
  "EMEA",
  "LATAM"
]

// Finance POC names for random assignment
const financeNames = [
  "Emily Rodriguez", "David Chen", "Sarah Johnson", "Michael Brown", "Jessica Lee",
  "Robert Davis", "Amanda Wilson", "James Taylor", "Lisa Anderson", "Kevin White",
  "Rachel Garcia", "Christopher Martinez", "Jennifer Thompson", "Daniel Harris",
  "Nicole Clark", "Anthony Lewis", "Stephanie Walker", "Matthew Hall", "Ashley Young"
]

// GD (Group Dealer) - Highest level parent companies
const gdOptions = [
  "AutoNation Inc",
  "Penske Automotive Group", 
  "Lithia Motors",
  "Group 1 Automotive",
  "Sonic Automotive",
  "Asbury Automotive Group",
  "CarMax",
  "Hendrick Automotive Group",
  "Berkshire Hathaway Automotive",
  "Larry H. Miller Company"
]

// Enterprise mapping - Multiple enterprises per GD
const gdToEnterprises = {
  "AutoNation Inc": ["AutoNation USA", "AutoNation Direct", "AutoNation Import"],
  "Penske Automotive Group": ["Penske Premier", "Penske Elite", "Penske Luxury"],
  "Lithia Motors": ["Lithia Springs", "Lithia Northwest", "Lithia California"],
  "Group 1 Automotive": ["Group 1 Holdings", "Group 1 Enterprises", "Group 1 Premium"],
  "Sonic Automotive": ["Sonic Drive", "Sonic Automotive Group", "Sonic Premier"],
  "Asbury Automotive Group": ["Asbury Park", "Asbury Holdings", "Asbury Elite"],
  "CarMax": ["CarMax Solutions", "CarMax Auto", "CarMax Direct"],
  "Hendrick Automotive Group": ["Hendrick Motors", "Hendrick Dealerships", "Hendrick Luxury"],
  "Berkshire Hathaway Automotive": ["Van Tuyl Auto", "Van Tuyl Holdings", "Van Tuyl Premium"],
  "Larry H. Miller Company": ["Miller Automotive", "Larry H. Miller Group", "Miller Motors"]
}

const planOptions = ["Essential", "Growth", "Enterprise", "Comprehensive"]
const languageOptions = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Chinese", "Japanese", "Korean"]
const mediaOptions = ["Images", "360 Spin", "Video Tour"]

// Location names for generating unique rooftop names
const locationSuffixes = [
  "Downtown", "North", "South", "East", "West", "Central", "Mall", "Plaza", 
  "Airport", "Riverside", "Hillside", "Park", "Springs", "Valley", "Heights", 
  "Village", "Square", "Center", "Station", "Junction", "Crossroads", "Gateway",
  "Metro", "Uptown", "Midtown", "Suburban", "Express", "Premium", "Elite", "Main"
]

const cityNames = [
  "Atlanta", "Dallas", "Phoenix", "Houston", "Miami", "Denver", "Seattle", "Boston",
  "Chicago", "Detroit", "Las Vegas", "Portland", "Nashville", "Charlotte", "Tampa",
  "Orlando", "Austin", "San Antonio", "Jacksonville", "Memphis", "Louisville", "Raleigh",
  "Virginia Beach", "Oklahoma City", "Tucson", "Fresno", "Sacramento", "Kansas City"
]

// Use RooftopsData from types.ts

interface RooftopsTableProps {
  rooftopData?: RooftopData // Made optional since we'll fetch from API
  onRooftopSelect: (rooftopId: string) => void
  onRooftopUpdate: (rooftopId: string, updates: Partial<RooftopData[string]> & { shouldRemove?: boolean }) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
}

export function RooftopsTable({ 
  rooftopData,
  onRooftopSelect,
  onRooftopUpdate,
  searchTerm = "",
  onSearchChange 
}: RooftopsTableProps) {
  
  // Parent-level toast to persist across row unmounts
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const showParentToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), type === 'error' ? 5000 : 3000)
  }

  // Handle rooftop updates including removal
  const handleRooftopUpdate = (rooftopId: string, updates: Partial<RooftopData[string]> & { shouldRemove?: boolean }) => {
    if (updates.shouldRemove) {
      // Remove the rooftop from the local state
      setApiData(prevData => prevData.filter(item => item.id !== rooftopId))
      // Update total count
      setTotalRecords(prev => Math.max(0, prev - 1))
    } else {
      // Regular update - optimistically update local state
      setApiData(prevData => prevData.map(item => {
        if (item.id !== rooftopId) return item
        const updated = { ...item }
        // Map known fields
        if ((updates as any).subStage !== undefined) {
          (updated as any).subStage = (updates as any).subStage as string
        }
        if ((updates as any).status !== undefined) {
          // Map 'status' updates to 'stage' in local data
          (updated as any).stage = (updates as any).status as string
        }
        return updated
      }))

      // Also pass to parent callback if needed
      onRooftopUpdate(rooftopId, updates)
    }
  }
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchTerm)
  const [selectedEnterprises, setSelectedEnterprises] = useState<Set<string>>(new Set())
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [apiData, setApiData] = useState<RooftopsData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Debounce search value
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 500) // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchValue])

  // Convert filter values to API format
  const getApiFilters = () => {
    const filters: any = {}
    
    if (filterValues.region_type !== "All Region") {
      filters.region_type = filterValues.region_type
    }
    if (filterValues.account_type !== "All Type") {
      filters.account_type = filterValues.account_type
    }
    if (filterValues.account_sub_type !== "All Sub Type") {
      filters.account_sub_type = filterValues.account_sub_type
    }
    if (filterValues.ae_id !== "All POC") {
      filters.ae_id = filterValues.ae_id
    }
    if (filterValues.sub_stage !== "All Sub Stage") {
      filters.sub_stage = filterValues.sub_stage
    }
    
    return Object.keys(filters).length > 0 ? filters : undefined
  }
  const [bulkActionConfirm, setBulkActionConfirm] = useState<{
    show: boolean
    action: 'stage' | 'substage'
    value: string
    count: number
  } | null>(null)
  
  // Bulk handover modal state
  const [showBulkHandoverModal, setShowBulkHandoverModal] = useState(false)
  const [bulkHandoverData, setBulkHandoverData] = useState<{
    subStage: string
    selectedIds: string[]
  } | null>(null)
  const [showBulkScheduleForm, setShowBulkScheduleForm] = useState(false)
  
  // Bulk handover form state (copied from individual modal)
  const [bulkInputPlatforms, setBulkInputPlatforms] = useState<string[]>(["FTP"])
  const [bulkInputDMS, setBulkInputDMS] = useState("HMN")
  const [bulkInputWebsiteProvider, setBulkInputWebsiteProvider] = useState("NA")
  const [bulkOutputPlatforms, setBulkOutputPlatforms] = useState<string[]>(["FTP"])
  const [bulkOutputDMS, setBulkOutputDMS] = useState("VAuto")
  const [bulkOutputWebsiteProvider, setBulkOutputWebsiteProvider] = useState("NA")
  const [bulkSameAsInput, setBulkSameAsInput] = useState(false)
  const [bulkClientLanguages, setBulkClientLanguages] = useState<string[]>(["English"])
  const [bulkImportantNotes, setBulkImportantNotes] = useState("NA")
  const [bulkRescheduleReason, setBulkRescheduleReason] = useState("")
  const [bulkRescheduleReasonError, setBulkRescheduleReasonError] = useState("")
  const [bulkObCallNotRequired, setBulkObCallNotRequired] = useState(false)
  const [bulkIsLoading, setBulkIsLoading] = useState(false)
  const [bulkSelectedDate, setBulkSelectedDate] = useState("")
  const [bulkSelectedTimezone, setBulkSelectedTimezone] = useState("Asia/Kolkata (IST)")
  const [bulkStartTime, setBulkStartTime] = useState("8:00 PM")
  const [bulkEndTime, setBulkEndTime] = useState("08:30 PM")
  const [bulkDuration, setBulkDuration] = useState("30 mins")
  const [bulkInviteEmails, setBulkInviteEmails] = useState("")
  const [showBulkCancellationModal, setShowBulkCancellationModal] = useState(false)
  const [bulkCancellationReason, setBulkCancellationReason] = useState("")
  const [bulkCancellationData, setBulkCancellationData] = useState<{
    selectedIds: string[]
  } | null>(null)
  
  // Bulk OB call not required form state
  const bulkObManagerOptions = [
    'Prakash Kumar (prakash.kumar@spyne.ai)',
    'avinash.jha (avinash.jha@spyne.ai)',
    'kanishk.sharma (kanishk.sharma@spyne.ai)',
    'ritika.agarwal (ritika.agarwal@spyne.ai)'
  ]
  const [bulkObManager, setBulkObManager] = useState(bulkObManagerOptions[0])
  const bulkCommunicationOptions = ['Email', 'Phone', 'Whatsapp', 'Slack']
  const [bulkModeOfCommunication, setBulkModeOfCommunication] = useState<string[]>(['Email'])
  const [bulkObnrEmail, setBulkObnrEmail] = useState("")
  const [bulkObnrReason, setBulkObnrReason] = useState("")
  
  // Schedule form options and helpers (copied from individual modal)
  const next30DaysOptions = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  })

  const timezoneOptions = [
    "Asia/Kolkata (IST)",
    "America/New_York (EST)",
    "America/Los_Angeles (PST)",
    "Europe/London (GMT)",
    "Australia/Sydney (AEDT)"
  ]

  const durationOptions = [
    { label: '30 mins', minutes: 30 },
    { label: '45 mins', minutes: 45 },
    { label: '60 mins', minutes: 60 },
    { label: '90 mins', minutes: 90 }
  ]

  const timeOptions = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM", "10:00 PM"
  ]

  const parseTimeToMinutes = (time: string) => {
    const [timePart, period] = time.split(' ')
    const [hours, minutes] = timePart.split(':').map(Number)
    let totalMinutes = (hours % 12) * 60 + minutes
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60
    if (period === 'AM' && hours === 12) totalMinutes = minutes
    return totalMinutes
  }

  const formatMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }


  // Initialize bulk selected date and calculate end time
  useEffect(() => {
    if (!bulkSelectedDate && next30DaysOptions.length > 0) {
      setBulkSelectedDate(next30DaysOptions[0])
    }
  }, [next30DaysOptions, bulkSelectedDate])

  useEffect(() => {
    const dur = durationOptions.find(d => d.label === bulkDuration)?.minutes ?? 30
    const start = parseTimeToMinutes(bulkStartTime || '8:00 PM')
    const end = start + dur
    setBulkEndTime(formatMinutesToTime(end))
  }, [bulkStartTime, bulkDuration])

  // Load more data for infinite scroll
  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const nextPage = currentPage + 1
      const filters = getApiFilters()
      const response = await ApiService.getTeamsPage(nextPage, 50, filters, filterValues.contractedOnly, debouncedSearchValue)
      
      setApiData(prev => [...prev, ...response.data])
      setHasMore(response.hasMore)
      setCurrentPage(nextPage)
      setTotalRecords(response.total)
    } catch (err) {
      console.error('Failed to load more data:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreData()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, loadingMore, hasMore, currentPage])
  const [filterValues, setFilterValues] = useState<FilterValues>({
    region_type: "All Region",
    account_type: "All Type",
    account_sub_type: "All Sub Type",
    ae_id: "All POC",
    sub_stage: "All Sub Stage",
    contractedOnly: false
  })
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()

      try {
        setLoading(true)
        setError(null)
        const filters = getApiFilters()
        const response = await ApiService.getTeamsWithDefaults(filters, filterValues.contractedOnly, debouncedSearchValue)
        
        // Only update state if request wasn't cancelled
        if (!abortControllerRef.current.signal.aborted) {
          setApiData(response.data)
          setHasMore(response.hasMore)
          setTotalRecords(response.total)
          setCurrentPage(1)
        }
      } catch (err) {
        // Only handle error if request wasn't cancelled
        if (!abortControllerRef.current?.signal.aborted) {
          console.error('Failed to fetch teams data:', err)
          setError(err instanceof Error ? err.message : 'Failed to fetch data')
        }
      } finally {
        // Only update loading state if request wasn't cancelled
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to cancel request on unmount or dependency change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [filterValues, debouncedSearchValue]) // Re-load when filters or debounced search change

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange?.(value)
  }

  const handleSelectEnterprise = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedEnterprises)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedEnterprises(newSelected)
  }

  // Multi-select dropdown component
  const MultiSelectDropdown = ({ 
    options, 
    selected, 
    onChange, 
    placeholder 
  }: { 
    options: string[], 
    selected: string[], 
    onChange: (selected: string[]) => void, 
    placeholder: string 
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    
    const toggleOption = (option: string) => {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option))
      } else {
        onChange([...selected, option])
      }
    }
    
    const removeOption = (option: string) => {
      onChange(selected.filter(item => item !== option))
    }
    
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const handleClose = () => {
      setIsOpen(false)
      setSearchTerm("")
    }
    
    return (
      <div className="relative z-10">
        <div 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer min-h-[40px] flex flex-wrap items-center gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selected.map((item) => (
              <span 
                key={item}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {item}
                <button 
                  className="ml-1 text-primary-600 hover:text-primary-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(item)
                  }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[59]" onClick={handleClose} />
            <div 
              className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-[60] max-h-60"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    e.stopPropagation()
                    setSearchTerm(e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              
              {/* Options List */}
              <div className="max-h-40 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 text-sm">No options found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        selected.includes(option) ? 'bg-primary-50 text-primary-700' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleOption(option)
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(option)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {option}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Use API data directly (already transformed by ApiService)
  const convertedData = useMemo((): RooftopsData[] => {
    return apiData
  }, [apiData])

  const filteredData = useMemo(() => {
    let filtered = convertedData.filter((item) => {
      // Only client-side contracted only filter (search is now server-side)
      const matchesContractedOnly = !filterValues.contractedOnly || item.stage === "Contracted"

      return matchesContractedOnly
    })

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortField as keyof RooftopsData]
        let bValue: any = b[sortField as keyof RooftopsData]

        // Convert to string for comparison
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [convertedData, filterValues.contractedOnly, sortField, sortDirection])

  // Selection handlers and state (after filteredData is defined)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map(item => item.id)
      setSelectedEnterprises(new Set(allIds))
    } else {
      setSelectedEnterprises(new Set())
    }
  }

  const isAllSelected = filteredData.length > 0 && selectedEnterprises.size === filteredData.length
  const isIndeterminate = selectedEnterprises.size > 0 && selectedEnterprises.size < filteredData.length

  // Check if all selected enterprises have the same stage, sub-stage, and enterprise
  const selectedData = filteredData.filter(item => selectedEnterprises.has(item.id))
  const canUseBulkActions = selectedData.length > 0 && (() => {
    const firstStage = selectedData[0]?.stage
    const firstSubStage = selectedData[0]?.subStage
    const firstEnterprise = selectedData[0]?.enterpriseName
    return selectedData.every(item => 
      item.stage === firstStage && 
      item.subStage === firstSubStage &&
      item.enterpriseName === firstEnterprise
    )
  })()

  const bulkActionTooltip = !canUseBulkActions && selectedEnterprises.size > 0 
    ? "Bulk actions are only available when all selected rooftops have the same stage, sub-stage, and enterprise"
    : ""

  // Get available bulk sub stage options based on selected items' current sub stage
  const getBulkAvailableSubStages = () => {
    if (!selectedData.length || !canUseBulkActions) return []
    
    const currentSubStage = selectedData[0]?.subStage
    const currentStage = selectedData[0]?.stage
    
    // If stage is not Contracted or Onboarding, only show Inactive
    if (currentStage !== "Contracted" && currentStage !== "Onboarding") {
      return ["Inactive"]
    }
    
    // For Contracted/Onboarding stages, show progression options
    const subStageSequence = [
      "Meet Pending",
      "Meet Scheduled", 
      "Meet Reschedule",
      "Meet Done",
      "Meet Cancelled"
    ]
    
    const currentIndex = subStageSequence.indexOf(currentSubStage)
    if (currentIndex === -1) {
      // If current sub-stage not found, start from beginning
      return ["Meet Pending"]
    }
    
    // Can stay current or move to next available options
    let options: string[] = []
    if (currentSubStage === "Meet Pending") {
      options = ["Meet Pending", "Meet Scheduled"]
    } else if (currentSubStage === "Meet Scheduled") {
      options = ["Meet Scheduled", "Meet Reschedule", "Meet Done", "Meet Cancelled"]
    } else if (currentSubStage === "Meet Reschedule") {
      options = ["Meet Reschedule", "Meet Scheduled", "Meet Done"]
    } else if (currentSubStage === "Meet Done") {
      return ["Meet Done"] // Final state
    } else if (currentSubStage === "Meet Cancelled") {
      options = ["Meet Cancelled", "Meet Reschedule"]
    } else {
      options = [currentSubStage]
    }
    if (!options.includes("Drop Off")) options.push("Drop Off")
    return options
  }

  // Bulk action handlers

  const handleBulkSubStageChange = (newSubStage: string) => {
    if (!newSubStage || selectedEnterprises.size === 0 || !canUseBulkActions) return
    
    // For all sub-stage changes, show the bulk confirmation modal first
    setBulkActionConfirm({
      show: true,
      action: 'substage',
      value: newSubStage,
      count: selectedEnterprises.size
    })
  }

  const confirmBulkAction = () => {
    if (!bulkActionConfirm) return
    
    // Check if this is a sub-stage change that requires handover details
    if (bulkActionConfirm.action === 'substage' && 
        (bulkActionConfirm.value === "Meet Scheduled" || bulkActionConfirm.value === "Meet Reschedule")) {
      // Show handover modal for bulk action
      setBulkHandoverData({
        subStage: bulkActionConfirm.value,
        selectedIds: Array.from(selectedEnterprises)
      })
      setBulkActionConfirm(null) // Close confirmation modal
      setShowBulkHandoverModal(true) // Show handover modal
      return
    }
    
    // Check if this is Meet Cancelled - show cancellation modal
    if (bulkActionConfirm.action === 'substage' && bulkActionConfirm.value === "Meet Cancelled") {
      setBulkCancellationData({
        selectedIds: Array.from(selectedEnterprises)
      })
      setBulkActionConfirm(null) // Close confirmation modal
      setShowBulkCancellationModal(true) // Show cancellation modal
      return
    }
    
    // For other actions, apply changes directly
    selectedEnterprises.forEach(enterpriseId => {
      let updates: any = {}
      
      updates.subStage = bulkActionConfirm.value
      // Handle special case for Drop Off sub-stage
      if (bulkActionConfirm.value === "Drop Off") {
        updates.status = "Drop Off"
      }
      
      onRooftopUpdate(enterpriseId, updates)
    })
    
    // Clear selection and hide modal
    setSelectedEnterprises(new Set())
    setBulkActionConfirm(null)
  }

  // Bulk handover modal handlers
  const handleBulkHandoverCancel = () => {
    setShowBulkHandoverModal(false)
    setShowBulkScheduleForm(false)
    setBulkHandoverData(null)
  }

  // Bulk cancellation modal handlers
  const handleBulkCancellationConfirm = () => {
    if (bulkCancellationReason.trim() && bulkCancellationData) {
      // Apply Meet Cancelled to all selected enterprises
      bulkCancellationData.selectedIds.forEach(enterpriseId => {
        onRooftopUpdate(enterpriseId, { subStage: 'Meet Cancelled' })
      })
      
      // Show success toast
      const count = bulkCancellationData.selectedIds.length
      showParentToast(`${count} meeting(s) cancelled successfully`)
      
      // Clear selection and close modal
      setSelectedEnterprises(new Set())
      setBulkCancellationData(null)
      setShowBulkCancellationModal(false)
      setBulkCancellationReason("")
    }
  }

  const handleBulkCancellationCancel = () => {
    setBulkCancellationData(null)
    setShowBulkCancellationModal(false)
    setBulkCancellationReason("")
  }


  const handleBulkHandoverConfirm = () => {
    if (!bulkHandoverData) return
    
    // Move to schedule form for Meet Scheduled and Meet Reschedule (match individual flow)
    if (bulkHandoverData.subStage === "Meet Scheduled" || bulkHandoverData.subStage === "Meet Reschedule") {
      setShowBulkScheduleForm(true)
    } else {
      // For reschedule, apply changes directly
      bulkHandoverData.selectedIds.forEach(enterpriseId => {
        // Special logic for Meet Reschedule - after reschedule process is complete, revert to Meet Scheduled
        const finalSubStage = bulkHandoverData.subStage === "Meet Reschedule" ? "Meet Scheduled" : bulkHandoverData.subStage
        onRooftopUpdate(enterpriseId, { subStage: finalSubStage })
      })
      
      // Clear selection and hide modal
      setSelectedEnterprises(new Set())
      setShowBulkHandoverModal(false)
      setBulkHandoverData(null)
    }
  }

  const handleBulkBackToHandover = () => {
    setShowBulkScheduleForm(false)
  }

  const handleBulkScheduleConfirm = async () => {
    if (!bulkHandoverData) return
    
    // Clear previous errors
    setBulkRescheduleReasonError("")
    
    // Validate reschedule reason if Meet Reschedule is selected
    if (bulkHandoverData.subStage === "Meet Reschedule" && !bulkRescheduleReason.trim()) {
      setBulkRescheduleReasonError("Reschedule reason is required")
      return
    }
    
    try {
      setBulkIsLoading(true)
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Apply the sub-stage change to all selected rooftops
      bulkHandoverData.selectedIds.forEach(enterpriseId => {
        // Special logic for Meet Reschedule - after reschedule process is complete, revert to Meet Scheduled
        const finalSubStage = bulkHandoverData.subStage === "Meet Reschedule" ? "Meet Scheduled" : bulkHandoverData.subStage
        onRooftopUpdate(enterpriseId, { subStage: finalSubStage })
      })
      
      // Show success message
      const actionText = bulkHandoverData.subStage === "Meet Reschedule" ? "rescheduled" : "scheduled"
      const successMessage = `${bulkHandoverData.selectedIds.length} meeting(s) ${actionText} successfully`
      showParentToast(successMessage)
      
      // Clear selection and hide modal
      setSelectedEnterprises(new Set())
      setShowBulkHandoverModal(false)
      setShowBulkScheduleForm(false)
      setBulkHandoverData(null)
      
    } catch (error) {
      console.error('Bulk schedule operation failed:', error)
      showParentToast("Failed to process bulk schedule operation. Please try again.", 'error')
    } finally {
      setBulkIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="table-container">
        {/* Search and Filter Section */}
        <div className="border-b border-gray-200 px-3 py-3">
          <RooftopsTableFilters
            onSearchChange={handleSearchChange}
            onFiltersChange={setFilterValues}
            searchValue={searchValue}
            filterValues={filterValues}
          />
        </div>
        
        {/* Metrics Section */}
        <div className="border-b border-gray-200 px-3 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white">
              <span className="text-sm text-gray-600">No. of Rooftops:</span>
              <span className="text-sm font-semibold text-primary-600">
                {totalRecords > 0 ? totalRecords.toLocaleString() : filteredData.length.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bulk Actions Section - Show only when enterprises are selected */}
        {selectedEnterprises.size > 0 && (
          <div className="border-b border-gray-200 px-3 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {selectedEnterprises.size} rooftop{selectedEnterprises.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Bulk Actions:</span>
                
                {/* Sub-Stage Dropdown */}
                <div className="relative" title={bulkActionTooltip}>
                  <select
                    onChange={(e) => handleBulkSubStageChange(e.target.value)}
                    disabled={!canUseBulkActions}
                    className={`appearance-none border rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      canUseBulkActions 
                        ? 'bg-white border-gray-300 text-gray-900' 
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>Change Sub-Stage</option>
                    {getBulkAvailableSubStages().map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
                    canUseBulkActions ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Clear Selection Button */}
                <button
                  onClick={() => setSelectedEnterprises(new Set())}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Horizontally scrollable table container */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full border-collapse" style={{ minWidth: "1400px" }}>
            
            <RooftopsTableHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={handleSelectAll}
            />
            <tbody>
              {loading ? (
                <SkeletonLoader rows={10} columns={31} />
              ) : error ? (
                <tr>
                  <td colSpan={31} className="px-3 py-8 text-center text-red-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>Error loading data: {error}</div>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={31} className="px-3 py-8 text-center text-gray-500">
                    {searchValue || filterValues.contractedOnly
                      ? "No matching rooftops found"
                      : "No rooftops data available"}
                  </td>
                </tr>
              ) : (
                <>
                  {filteredData.map((row) => (
                  <RooftopsTableRow 
                    key={row.id} 
                    data={row} 
                    onRooftopSelect={onRooftopSelect} 
                    onRooftopUpdate={handleRooftopUpdate}
                    isSelected={selectedEnterprises.has(row.id)}
                    onSelectEnterprise={handleSelectEnterprise}
                    onShowToast={showParentToast}
                  />
                  ))}
                  {loadingMore && (
                    <SkeletonLoader rows={5} columns={31} />
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Infinite Scroll Indicator */}
        {loadingMore && !loading && (
          <InfiniteScrollSkeleton />
        )}
      </div>
      
      {/* Bulk Action Confirmation Modal */}
      {bulkActionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Bulk Sub-Stage Change
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to change the sub-stage to 
              <span className="font-medium text-gray-900"> "{bulkActionConfirm.value}"</span> for 
              <span className="font-medium text-gray-900"> {bulkActionConfirm.count}</span> selected rooftop{bulkActionConfirm.count !== 1 ? 's' : ''}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBulkActionConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAction}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Handover Modal - Exact copy of individual modal */}
      {showBulkHandoverModal && bulkHandoverData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {showBulkScheduleForm ? 'SH Call Schedule' : 'Handover Details'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {showBulkScheduleForm 
                    ? `Schedule Onboarding call with client - Bulk action for ${bulkHandoverData.selectedIds.length} rooftops`
                    : `Enter rooftop details for OB team - Bulk action for ${bulkHandoverData.selectedIds.length} rooftops`
                  }
                </p>
              </div>
              <button
                onClick={handleBulkHandoverCancel}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 space-y-6 flex-1 overflow-y-auto">
              {!showBulkScheduleForm ? (
                // Handover Form - Exact copy from individual modal
                <>
                  {/* Bulk Info Banner */}
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-primary-800">
                          Bulk Handover Details
                        </h4>
                        <div className="mt-2 text-sm text-primary-700">
                          <p>
                            These details will be applied to all {bulkHandoverData.selectedIds.length} selected rooftops. 
                            You can modify individual details later if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                                      {/* Reschedule Reason (only when Meet Reschedule is selected) */}
                    {false && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reschedule Reason *
                      </label>
                      <textarea
                        rows={4}
                        value={bulkRescheduleReason}
                        onChange={(e) => {
                          setBulkRescheduleReason(e.target.value)
                          // Clear error when user starts typing
                          if (bulkRescheduleReasonError) {
                            setBulkRescheduleReasonError("")
                          }
                        }}
                        placeholder="Reschedule Reason *"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          bulkRescheduleReasonError 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                      />
                      {bulkRescheduleReasonError && (
                        <p className="mt-1 text-sm text-red-600">{bulkRescheduleReasonError}</p>
                      )}
                    </div>
                  )}

                  {/* Input Delivery Mode Section */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Input Delivery Mode</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platforms*
                        </label>
                        <MultiSelectDropdown
                          options={platformOptions}
                          selected={bulkInputPlatforms}
                          onChange={setBulkInputPlatforms}
                          placeholder="Select platforms"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DMS/IMS*
                        </label>
                        <input
                          type="text"
                          value={bulkInputDMS}
                          onChange={(e) => setBulkInputDMS(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website Provider*
                        </label>
                        <input
                          type="text"
                          value={bulkInputWebsiteProvider}
                          onChange={(e) => setBulkInputWebsiteProvider(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Output Delivery Mode Section */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Output Delivery Mode</h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="bulkSameAsInput"
                          checked={bulkSameAsInput}
                          onChange={(e) => {
                            setBulkSameAsInput(e.target.checked)
                            if (e.target.checked) {
                              setBulkOutputPlatforms([...bulkInputPlatforms])
                              setBulkOutputDMS(bulkInputDMS)
                              setBulkOutputWebsiteProvider(bulkInputWebsiteProvider)
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="bulkSameAsInput" className="ml-2 block text-sm text-gray-700">
                          Same as Input
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Platforms*
                        </label>
                        <MultiSelectDropdown
                          options={platformOptions}
                          selected={bulkOutputPlatforms}
                          onChange={setBulkOutputPlatforms}
                          placeholder="Select platforms"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          DMS/IMS*
                        </label>
                        <input
                          type="text"
                          value={bulkOutputDMS}
                          onChange={(e) => setBulkOutputDMS(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website Provider*
                        </label>
                        <input
                          type="text"
                          value={bulkOutputWebsiteProvider}
                          onChange={(e) => setBulkOutputWebsiteProvider(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other Details Section */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Other Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Important Notes*
                        </label>
                        <textarea
                          rows={4}
                          value={bulkImportantNotes}
                          onChange={(e) => setBulkImportantNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Languages*
                        </label>
                        <MultiSelectDropdown
                          options={languageOptions}
                          selected={bulkClientLanguages}
                          onChange={setBulkClientLanguages}
                          placeholder="Select languages"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Schedule Form - Exact copy from individual modal
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800">
                          Handover Details Submitted
                        </h4>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Now schedule the onboarding calls for all {bulkHandoverData.selectedIds.length} selected rooftops.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OB Call Not Required Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bulkObCallNotRequired"
                      checked={bulkObCallNotRequired}
                      onChange={(e) => setBulkObCallNotRequired(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="bulkObCallNotRequired" className="ml-2 block text-sm text-gray-700">
                      OB call not required.
                    </label>
                  </div>

                  {/* Conditional OB-not-required form */}
                  {bulkObCallNotRequired ? (
                    <div className="space-y-4 mt-4">
                      {/* Onboarding Manager (single select) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Onboarding Manager*</label>
                        <select
                          value={bulkObManager}
                          onChange={(e) => setBulkObManager(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {bulkObManagerOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {/* Removed Mode of Communication and Email fields as per requirements */}

                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason*</label>
                        <textarea
                          rows={4}
                          value={bulkObnrReason}
                          onChange={(e) => setBulkObnrReason(e.target.value)}
                          placeholder="Write your reason"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  ) : (
                  <>
                  {/* Invite Participants - Exact copy from individual modal */}
                  {!bulkObCallNotRequired && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="text"
                          placeholder="Add email addresses to invite guests"
                          value={bulkInviteEmails}
                          onChange={(e) => setBulkInviteEmails(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                          Invite
                        </button>
                      </div>

                      {/* Participants List */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">PARTICIPANTS</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">Bulk Action User</span>
                            <span className="text-sm text-gray-500">bulk@example.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
                  )}

                  {/* Select Date & Time (hidden when OB call not required) - Exact copy from individual modal */}
                  {!bulkObCallNotRequired && (
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Select a Date & Time</h4>
                      <div className="space-y-4">
                        <div>
                          <select
                            value={bulkSelectedDate}
                            onChange={(e) => setBulkSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {next30DaysOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <select
                              value={bulkSelectedTimezone}
                              onChange={(e) => setBulkSelectedTimezone(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              {timezoneOptions.map((tz) => (
                                <option key={tz} value={tz}>{tz}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <select
                              value={bulkDuration}
                              onChange={(e) => setBulkDuration(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              {durationOptions.map((d) => (
                                <option key={d.label} value={d.label}>{d.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <select
                            value={bulkStartTime}
                            onChange={(e) => setBulkStartTime(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <div className="text-center text-gray-500">-</div>
                          <input
                            type="text"
                            value={bulkEndTime}
                            readOnly
                            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reschedule Reason (only when Meet Reschedule is selected) - Exact copy from individual modal */}
                  {bulkHandoverData.subStage === "Meet Reschedule" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reschedule Reason *
                      </label>
                      <textarea
                        rows={4}
                        value={bulkRescheduleReason}
                        onChange={(e) => {
                          setBulkRescheduleReason(e.target.value)
                          // Clear error when user starts typing
                          if (bulkRescheduleReasonError) {
                            setBulkRescheduleReasonError("")
                          }
                        }}
                        placeholder="Reschedule Reason *"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                          bulkRescheduleReasonError 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                      />
                      {bulkRescheduleReasonError && (
                        <p className="mt-1 text-sm text-red-600">{bulkRescheduleReasonError}</p>
                      )}
                    </div>
                  )}

                </>
              )}
            </div>
            
            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              {showBulkScheduleForm && (
                <button
                  onClick={handleBulkBackToHandover}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleBulkHandoverCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={showBulkScheduleForm ? handleBulkScheduleConfirm : handleBulkHandoverConfirm}
                disabled={bulkIsLoading}
                className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center gap-2 ${
                  bulkIsLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'text-white bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700'
                }`}
              >
                {bulkIsLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {bulkIsLoading 
                  ? 'Scheduling...' 
                  : (showBulkScheduleForm ? (bulkObCallNotRequired ? 'Continue' : 'Schedule') : 'Continue')
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk SH Call Cancellation Modal */}
      {showBulkCancellationModal && bulkCancellationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Meet Cancellation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Bulk action for {bulkCancellationData.selectedIds.length} selected rooftop{bulkCancellationData.selectedIds.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="px-6 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Reason *
                </label>
                <textarea
                  rows={6}
                  value={bulkCancellationReason}
                  onChange={(e) => setBulkCancellationReason(e.target.value)}
                  placeholder="Please provide the reason for cancelling the meet for all selected rooftops..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  required
                />
                {!bulkCancellationReason.trim() && (
                  <p className="text-sm text-red-600 mt-1">This field is required</p>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleBulkCancellationCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkCancellationConfirm}
                disabled={!bulkCancellationReason.trim()}
                className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  bulkCancellationReason.trim()
                    ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                }`}
              >
                Cancel Meet for {bulkCancellationData.selectedIds.length} Rooftop{bulkCancellationData.selectedIds.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {toastType === 'error' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
            <button onClick={() => setShowToast(false)} className="ml-3 text-white/80 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export type { RooftopsData } from "@/app/types"
