"use client"

import { useState, useMemo } from "react"
import { RooftopsTableFilters } from "./rooftops-table-filters"

interface FilterValues {
  stage: string
  accountExecutivePOC: string
  financePOC: string
  media: string
  product: string
  type: string
  subType: string
  region: string
}
import { RooftopsTableHeader } from "./rooftops-table-header"
import { RooftopsTableRow } from "./rooftops-table-row"
import type { RooftopData } from "@/app/types"

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
  "Inactive",
  "SH Call Pending",
  "SH Call Scheduled", 
  "SH Call Reschedule",
  "SH Call Done"
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

const groupDealerOptions = [
  "AutoNation",
  "Penske Automotive",
  "Lithia Motors",
  "Group 1 Automotive",
  "Sonic Automotive",
  "Asbury Automotive",
  "CarMax",
  "Hendrick Automotive",
  "Van Tuyl Group",
  "Larry H. Miller"
]

// Adapted data structure for the new table
interface RooftopsData {
  id: string
  groupDealer: string
  name: string
  logo: string
  obProgress: number
  arr: number
  contractedARR: number
  vinsAlloted: number
  oneTimePurchase: number
  addons: string[]
  contractedRooftops: number
  potentialRooftops: number
  paymentsFrequency: string
  lockinPeriod: string
  firstPaymentDate: string
  firstPaymentAmount: number
  taxID: string
  termsAndConditionsEdited: boolean
  contractSource: string
  ageing: number
  accountExecutivePOC: string
  financePOC: string
  stage: string
  subStage: string
  type: string
  subType: string
  region: string
  contractedDate: string
  contractPeriod: string
  sla: {
    status: "On Track" | "Breached"
    daysBreached?: number
  }
  teamId: string
  enterpriseId: string
  products: string[]
  media: string[]
  tat: number
  platform: string
}

interface RooftopsTableProps {
  rooftopData: RooftopData
  onRooftopSelect: (rooftopId: string) => void
  onRooftopUpdate: (rooftopId: string, updates: Partial<RooftopData[string]>) => void
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
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [filterValues, setFilterValues] = useState<FilterValues>({
    stage: "All Stage",
    accountExecutivePOC: "All AE POC",
    financePOC: "All Finance POC",
    media: "All Media",
    product: "All Product",
    type: "All Type",
    subType: "All Sub Type",
    region: "All Region"
  })
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

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

  // Convert existing rooftop data to new format
  const convertedData = useMemo((): RooftopsData[] => {
    return Object.entries(rooftopData).map(([id, data], index) => {
      const idNum = Number.parseInt(id.slice(-3)) || 1
      
      // Generate realistic contracted dates (between 6 months ago and 2 years ago)
      const monthsAgo = Math.floor(Math.random() * 18) + 6 // 6 to 24 months ago
      const contractedDate = new Date()
      contractedDate.setMonth(contractedDate.getMonth() - monthsAgo)
      const formattedDate = contractedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
      
      // Generate contract periods (common contract durations)
      const contractPeriods = ["1 Year", "2 Years", "3 Years", "5 Years"]
      const contractPeriod = contractPeriods[idNum % contractPeriods.length]
      
      // Generate VINs Alloted (realistic numbers based on dealer size)
      const vinsAlloted = Math.floor(Math.random() * 5000) + 500 // 500 to 5500 VINs
      
      // Generate One Time Purchase amount (setup fees, equipment costs, etc.)
      const oneTimePurchase = Math.floor(Math.random() * 50000) + 10000 // $10K to $60K
      
      // Generate Addons (additional services and features)
      const availableAddons = [
        "Analytics Plus", "Premium Support", "API Access", "White Label", 
        "Advanced Reporting", "Custom Branding", "Mobile App", "Training Package",
        "Priority Queue", "Data Export", "SSO Integration", "Backup Service"
      ]
      const numAddons = Math.floor(Math.random() * 4) + 1 // 1 to 4 addons
      const addons = availableAddons
        .sort(() => 0.5 - Math.random())
        .slice(0, numAddons)
      
      // Generate Contracted and Potential Rooftops
      const contractedRooftops = Math.floor(Math.random() * 50) + 10 // 10 to 60 rooftops
      const potentialRooftops = Math.floor(Math.random() * 100) + 20 // 20 to 120 rooftops
      
      // Generate Payments Frequency
      type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Half Yearly' | 'Yearly'
      const paymentFrequencies: PaymentFrequency[] = ["Monthly", "Quarterly", "Half Yearly", "Yearly"]
      const paymentsFrequency: PaymentFrequency = paymentFrequencies[idNum % paymentFrequencies.length]
      
      // Generate Lockin Period
      const lockinPeriods = ["6 Months", "1 Year", "18 Months", "2 Years", "3 Years"]
      const lockinPeriod = lockinPeriods[idNum % lockinPeriods.length]
      
      return {
        id,
        groupDealer: groupDealerOptions[idNum % groupDealerOptions.length],
        name: data.name,
        logo: "/placeholder-logo.png",
        obProgress: data.obProgress, // Use actual progress from rooftop data
        arr: data.arr, // Use actual ARR from rooftop data
        contractedARR: data.arr, // Use actual ARR as contracted ARR
        vinsAlloted: vinsAlloted,
        oneTimePurchase: oneTimePurchase,
        addons: addons,
        contractedRooftops: contractedRooftops,
        potentialRooftops: potentialRooftops,
        paymentsFrequency: paymentsFrequency,
        lockinPeriod: lockinPeriod,
        
        // Generate first payment date (1-3 months after contracted date)
        firstPaymentDate: (() => {
          const contractDate = new Date(formattedDate)
          const firstPaymentDate = new Date(contractDate)
          const daysToAdd = Math.floor(Math.random() * 90) + 30 // 30-120 days after contract
          firstPaymentDate.setDate(firstPaymentDate.getDate() + daysToAdd)
          return firstPaymentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        })(),
        
        // Generate first payment amount (10-50% of contracted ARR divided by payment frequency)
        firstPaymentAmount: (() => {
          const baseAmount = data.arr * (Math.random() * 0.4 + 0.1) // 10-50% of ARR
          // Adjust based on payment frequency
          const frequencyMultipliers: Record<PaymentFrequency, number> = {
            'Monthly': baseAmount / 12,
            'Quarterly': baseAmount / 4,
            'Half Yearly': baseAmount / 2,
            'Yearly': baseAmount
          }
          return Math.round(frequencyMultipliers[paymentsFrequency] ?? baseAmount / 12)
        })(),
        
        ageing: data.ageing, // Use actual ageing from rooftop data
        accountExecutivePOC: data.obPoc.name, // Use actual POC name as Account Executive POC
        financePOC: (() => {
          const names = [
            "Emily Rodriguez", "David Chen", "Sarah Johnson", "Michael Brown", "Jessica Lee",
            "Robert Davis", "Amanda Wilson", "James Taylor", "Lisa Anderson", "Kevin White",
            "Rachel Garcia", "Christopher Martinez", "Jennifer Thompson", "Daniel Harris",
            "Nicole Clark", "Anthony Lewis", "Stephanie Walker", "Matthew Hall", "Ashley Young"
          ]
          return names[idNum % names.length]
        })(), // Random finance POC name
        
        // Generate Tax ID (realistic format)
        taxID: (() => {
          const formats = [
            `TAX-${String(idNum).padStart(6, '0')}`,
            `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 900 + 100)}`,
            `EIN-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000000 + 1000000)}`
          ]
          return formats[idNum % formats.length]
        })(),
        
        // Generate T&Cs Edited status (70% No, 30% Yes for realistic distribution)
        termsAndConditionsEdited: Math.random() < 0.3,
        
        // Generate Contract Source (80% Dealhub, 20% Exception for realistic distribution)
        contractSource: Math.random() < 0.8 ? 'Dealhub' : 'Exception',
        
        stage: data.status || "Contract Initiated", // Use actual status from rooftop data
        subStage: (() => {
          const stage = data.status || "Contract Initiated"
          // Use existing subStage if available, otherwise determine based on stage
          if (data.subStage) {
            return data.subStage
          }
          // Sub stage logic based on stage
          if (stage === "Contracted" || stage === "Onboarding") {
            return "SH Call Pending" // Default for contracted stage
          } else {
            return "Inactive" // For all pre-contracted stages
          }
        })(),
        type: typeOptions[idNum % typeOptions.length],
        subType: subTypeOptions[idNum % subTypeOptions.length],
        region: regionOptions[idNum % regionOptions.length],
        contractedDate: formattedDate,
        contractPeriod: contractPeriod,
        sla: idNum % 4 === 0 
          ? { status: "Breached", daysBreached: Math.floor(Math.random() * 10) + 1 }
          : { status: "On Track" },
        teamId: `${11024210 + index}`,
        enterpriseId: `${11024210 + index}`,
        products: data.productSuite.length > 0 ? data.productSuite : ["Studio AI"],
        media: data.products.length > 0 ? data.products : ["Image"], // Use actual media from rooftop data
        tat: data.tat, // Use actual TAT from rooftop data
        platform: platformOptions[idNum % platformOptions.length] // Map to platform options
      }
    })
  }, [rooftopData])

  const filteredData = useMemo(() => {
    let filtered = convertedData.filter((item) => {
      const matchesSearch = searchValue === "" || 
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.teamId.includes(searchValue) ||
        item.enterpriseId.includes(searchValue)
      
      const matchesStage = filterValues.stage === "All Stage" || item.stage === filterValues.stage
      const matchesAccountExecutivePOC = filterValues.accountExecutivePOC === "All AE POC" || item.accountExecutivePOC === filterValues.accountExecutivePOC
      const matchesFinancePOC = filterValues.financePOC === "All Finance POC" || item.financePOC === filterValues.financePOC
      const matchesMedia = filterValues.media === "All Media" || item.media.includes(filterValues.media)
      const matchesProduct = filterValues.product === "All Product" || item.products.includes(filterValues.product)
      const matchesType = filterValues.type === "All Type" || item.type === filterValues.type
      const matchesSubType = filterValues.subType === "All Sub Type" || item.subType === filterValues.subType
      const matchesRegion = filterValues.region === "All Region" || item.region === filterValues.region

      return matchesSearch && matchesStage && matchesAccountExecutivePOC && matchesFinancePOC && matchesMedia && 
             matchesProduct && matchesType && matchesSubType && matchesRegion
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
  }, [convertedData, searchValue, filterValues, sortField, sortDirection])

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
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
              <span className="text-sm text-gray-600">No. of Enterprises:</span>
              <span className="text-sm font-semibold text-blue-600">{filteredData.length.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white">
              <span className="text-sm text-gray-600">Total Contracted ARR</span>
              <span className="text-sm font-semibold text-purple-600">
                ${(filteredData.reduce((sum, data) => sum + data.contractedARR, 0) / 1000000).toFixed(2)} M
              </span>
            </div>
          </div>
        </div>
        
        {/* Horizontally scrollable table container */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full" style={{ minWidth: "1400px" }}>
            
            <RooftopsTableHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={30} className="px-3 py-8 text-center text-gray-500">
                    {searchValue || Object.values(filterValues).some(value => !value.startsWith("All"))
                      ? "No matching rooftops found"
                      : "No rooftops data available"}
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <RooftopsTableRow key={row.id} data={row} onRooftopSelect={onRooftopSelect} onRooftopUpdate={onRooftopUpdate} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export type { RooftopsData }
