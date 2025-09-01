interface RooftopsTableHeaderProps {
  sortField: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export function RooftopsTableHeader({ sortField, sortDirection, onSort }: RooftopsTableHeaderProps) {
  const HeaderCell = ({ field, children, className = "", style, isSticky = false }: { field?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties; isSticky?: boolean }) => (
    <th className={`px-3 py-2 text-left h-10 border-r border-gray-100 last:border-r-0 ${isSticky ? 'sticky left-0 z-10 bg-white' : ''} ${className}`} style={style}>
      {field ? (
        <button 
          onClick={() => onSort(field)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {children}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <span className="text-sm font-medium text-gray-600">{children}</span>
      )}
    </th>
  )

  return (
    <thead className="border-b border-gray-200">
      <tr>
        {/* Enterprise Name - Fixed width */}
        <HeaderCell field="groupDealer" className="w-[282px]" style={{ width: "282px !important", minWidth: "282px", maxWidth: "282px" }} isSticky={true}>Enterprise Name</HeaderCell>
        
        {/* New column order as requested */}
        <HeaderCell field="stage" className="min-w-[180px]">Stage</HeaderCell>
        <HeaderCell field="subStage" className="min-w-[180px]">Sub Stage</HeaderCell>
        <HeaderCell field="type" className="min-w-[180px]">Type</HeaderCell>
        <HeaderCell field="subType" className="min-w-[180px]">Subtype</HeaderCell>
        <HeaderCell field="products" className="min-w-[180px]">Product</HeaderCell>
        <HeaderCell field="media" className="min-w-[180px]">Media</HeaderCell>
        <HeaderCell field="region" className="min-w-[130px]">Region</HeaderCell>
        <HeaderCell field="country" className="min-w-[180px]">Country</HeaderCell>
        <HeaderCell field="state" className="min-w-[180px]">State</HeaderCell>
        <HeaderCell field="city" className="min-w-[180px]">City</HeaderCell>
        <HeaderCell field="contractedDate" className="w-max whitespace-nowrap">Contracted Date</HeaderCell>
        <HeaderCell field="contractPeriod" className="w-max whitespace-nowrap">Contract Period</HeaderCell>
        <HeaderCell field="contractedARR" className="w-max whitespace-nowrap">Contracted ARR</HeaderCell>
        <HeaderCell field="vinsAlloted" className="w-max whitespace-nowrap">VINs Contracted</HeaderCell>
        <HeaderCell field="oneTimePurchase" className="w-max whitespace-nowrap">One Time Purchase</HeaderCell>
        <HeaderCell field="addons" className="min-w-[180px]">Addons</HeaderCell>
        <HeaderCell field="contractedRooftops" className="w-max whitespace-nowrap">Contracted Rooftops</HeaderCell>
        <HeaderCell field="potentialRooftops" className="w-max whitespace-nowrap">Potential Rooftops</HeaderCell>
        <HeaderCell field="paymentsFrequency" className="w-max whitespace-nowrap">Payment Frequency</HeaderCell>
        <HeaderCell field="lockinPeriod" className="w-max whitespace-nowrap">Lock In Period</HeaderCell>
        <HeaderCell field="accountExecutivePOC" className="min-w-[180px]">AE POCs</HeaderCell>
        <HeaderCell field="firstPaymentDate" className="w-max whitespace-nowrap">First Payment Date</HeaderCell>
        <HeaderCell field="firstPaymentAmount" className="w-max whitespace-nowrap">First Payment Amount</HeaderCell>
        <HeaderCell field="taxID" className="w-max whitespace-nowrap">Tax ID</HeaderCell>
        <HeaderCell field="financePOC" className="min-w-[180px]">Finance POC</HeaderCell>
        <HeaderCell field="termsAndConditionsEdited" className="w-max whitespace-nowrap">T&Cs Edited</HeaderCell>
        <HeaderCell field="contractSource" className="w-max whitespace-nowrap">Contract Source</HeaderCell>
        <HeaderCell field="contractLink" className="min-w-[180px]">Contract Link</HeaderCell>
        <HeaderCell field="teamId" className="min-w-[180px]">Team ID</HeaderCell>
        <HeaderCell field="enterpriseId" className="min-w-[180px]">Enterprise ID</HeaderCell>
      </tr>
    </thead>
  )
}
