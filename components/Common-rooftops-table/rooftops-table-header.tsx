interface RooftopsTableHeaderProps {
  isAllSelected: boolean
  isIndeterminate: boolean
  onSelectAll: (checked: boolean) => void
}

export function RooftopsTableHeader({ isAllSelected, isIndeterminate, onSelectAll }: RooftopsTableHeaderProps) {
  const HeaderCell = ({ children, className = "", style, isSticky = false }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; isSticky?: boolean }) => {
    return (
      <th className={`px-3 py-2 text-left h-10 border-r border-gray-100 last:border-r-0 ${isSticky ? 'sticky z-20 bg-white' : ''} ${className}`} style={style}>
        <span className="text-sm font-medium text-gray-600">{children}</span>
      </th>
    )
  }

  return (
    <thead className="border-b border-gray-200">
      <tr>
        {/* Checkbox + Rooftop Name - Combined sticky column */}
        <th className="px-3 py-2 text-left h-10 w-[332px] sticky left-0 z-20 bg-white border-r border-gray-100" style={{ width: "332px !important", minWidth: "332px", maxWidth: "332px" }}>
          <div className="flex items-center gap-3">
            {/* Temporarily hidden - will be restored when APIs are ready */}
            {/* <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:outline-none flex-shrink-0"
            /> */}
            <span className="text-sm font-medium text-gray-600">
              Rooftop Name
            </span>
          </div>
        </th>
        
        {/* Enterprise Name column */}
        <HeaderCell className="min-w-[180px]">Enterprise Name</HeaderCell>
        
        {/* GD Name column */}
        <HeaderCell className="min-w-[180px]">GD Name</HeaderCell>
        
        {/* New column order as requested */}
        <HeaderCell className="min-w-[180px]">Stage</HeaderCell>
        <HeaderCell className="min-w-[180px]">Sub Stage</HeaderCell>
        <HeaderCell className="min-w-[180px]">Type</HeaderCell>
        <HeaderCell className="min-w-[180px]">Subtype</HeaderCell>
        <HeaderCell className="min-w-[180px]">Converse AI</HeaderCell>
        <HeaderCell className="min-w-[180px]">Studio AI</HeaderCell>
        <HeaderCell className="min-w-[130px]">Region</HeaderCell>
        <HeaderCell className="min-w-[180px]">Country</HeaderCell>
        <HeaderCell className="min-w-[180px]">State</HeaderCell>
        <HeaderCell className="min-w-[180px]">City</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Contracted Date</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Contract Period</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Contracted ARR</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">VINs Contracted</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">One Time Purchase</HeaderCell>
        <HeaderCell className="min-w-[180px]">Addons</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Payment Frequency</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Lock In Period</HeaderCell>
        <HeaderCell className="min-w-[180px]">AE POCs</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">First Payment Date</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">First Payment Amount</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Tax ID</HeaderCell>
        <HeaderCell className="min-w-[180px]">Finance POC</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">T&Cs Edited</HeaderCell>
        <HeaderCell className="w-max whitespace-nowrap">Contract Source</HeaderCell>
        <HeaderCell className="min-w-[180px]">Contract Link</HeaderCell>
        <HeaderCell className="min-w-[180px]">Team ID</HeaderCell>
        <HeaderCell className="min-w-[180px]">Enterprise ID</HeaderCell>
      </tr>
    </thead>
  )
}
