import { useState, useMemo, useEffect } from "react"
import type { RooftopsData } from "./rooftops-table"

interface RooftopsTableRowProps {
  data: RooftopsData
  onRooftopSelect: (rooftopId: string) => void
  onRooftopUpdate: (rooftopId: string, updates: any) => void
}

export function RooftopsTableRow({ data, onRooftopSelect, onRooftopUpdate }: RooftopsTableRowProps) {
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Group Dealer":
        return "bg-blue-100 text-blue-800"
      case "Marketplace":
        return "bg-lime-100 text-lime-800"
      case "Partner":
        return "bg-amber-100 text-amber-800"
      case "Auction Platform":
        return "bg-pink-100 text-pink-800"
      case "Individual Dealer":
        return "bg-purple-100 text-purple-800"
      case "Car Rental Leasing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSubTypeBadgeStyles = (subType: string) => {
    switch (subType) {
      case "Independent":
        return "bg-green-100 text-green-800"
      case "Franchise":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProductBadgeStyles = (product: string) => {
    switch (product) {
      case "Studio AI":
        return "bg-purple-100 text-purple-800"
      case "Converse AI":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMediaBadgeStyles = (media: string) => {
    switch (media) {
      case "Image":
        return "bg-purple-100 text-purple-800"
      case "360 Spin":
        return "bg-blue-100 text-blue-800"
      case "Video Tour":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRegionBadgeStyles = (region: string) => {
    return "bg-gray-100 text-gray-800"
  }

  const getSLABadgeStyles = (status: "On Track" | "Breached") => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "Breached":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="flex items-center gap-2 min-w-max">
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <span className="text-sm text-gray-700 min-w-[35px] font-medium">{progress}%</span>
    </div>
  )

  const formatARR = (arr: number) => {
    if (arr >= 1000000) {
      return `$${(arr / 1000000).toFixed(1)}M`
    } else if (arr >= 1000) {
      return `$${(arr / 1000).toFixed(0)}K`
    } else {
      return `$${arr}`
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Contract Initiated":
        return "bg-blue-100 text-blue-800"
      case "Contract User Pending Signature":
        return "bg-yellow-100 text-yellow-800"
      case "Contract Spyne Pending Signature":
        return "bg-orange-100 text-orange-800"
      case "Contracted":
        return "bg-red-100 text-red-800"
      case "Onboarding":
        return "bg-green-100 text-green-800"
      case "Drop-off":
      case "Drop-Off":
        return "bg-gray-200 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800" // Default to contract initiated style
    }
  }

  const getSubStageColor = (subStage: string) => {
    switch (subStage) {
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "SH Call Pending":
        return "bg-red-100 text-red-800"
      case "SH Call Scheduled":
        return "bg-orange-100 text-orange-800"
      case "SH Call Reschedule":
        return "bg-yellow-100 text-yellow-800"
      case "SH Call Done":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const StageDropdown = ({ stage, rooftopId, currentSubStage }: { stage: string; rooftopId: string; currentSubStage: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const stageSequence = [
      "Contract Initiated",
      "Contract User Pending Signature", 
      "Contract Spyne Pending Signature",
      "Contracted",
      "Onboarding"
    ]

    // Get current stage index
    const currentStageIndex = stageSequence.indexOf(stage)
    const currentStage = currentStageIndex >= 0 ? stage : "Contract Initiated"

    const handleStageChange = (newStage: string) => {
      const updates: any = { status: newStage }
      
      // Auto-set sub-stage when moving to Contracted
      if (newStage === "Contracted") {
        updates.subStage = "SH Call Pending"
      } else if (newStage !== "Contracted" && newStage !== "Onboarding") {
        // Set to Inactive for pre-contracted stages
        updates.subStage = "Inactive"
      }
      
      onRooftopUpdate(rooftopId, updates)
      setIsOpen(false)
    }

    // Get available next stages (can only progress to next stage in sequence)
    const getAvailableStages = () => {
      const currentIndex = stageSequence.indexOf(currentStage)
      if (currentIndex === -1) return [stageSequence[0]] // If stage not found, start from beginning
      
      // Special logic for Contracted stage - can't move to Onboarding until sub-stage is complete
      if (currentStage === "Contracted" && currentSubStage !== "SH Call Done") {
        return [currentStage] // Only show current stage, can't progress
      }
      
      // Can only move to next stage or stay current
      if (currentIndex === stageSequence.length - 1) {
        // If at last stage, only show current stage
        return [currentStage]
      } else {
        // Show current stage and next stage
        return [currentStage, stageSequence[currentIndex + 1]]
      }
    }

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium rounded-md h-[22px] min-w-max hover:opacity-80 transition-opacity ${getStageColor(currentStage)}`}
        >
          <span className="whitespace-nowrap">{currentStage}</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-current flex-shrink-0">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-20 min-w-[200px]">
              {getAvailableStages().map((option) => (
                <button
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStageChange(option)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f9fafb] transition-colors ${
                    option === currentStage ? "bg-[#f0ebff] text-[#4600f2]" : "text-[#333333]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const SubStageDropdown = ({ subStage, rooftopId, currentStage }: { subStage: string; rooftopId: string; currentStage: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showHandoverModal, setShowHandoverModal] = useState(false)
    const [showDoneConfirm, setShowDoneConfirm] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [pendingSubStage, setPendingSubStage] = useState<string | null>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showScheduleForm, setShowScheduleForm] = useState(false)
    
    // Form state
    const [inputPlatforms, setInputPlatforms] = useState<string[]>(["FTP"])
    const [inputDMS, setInputDMS] = useState("HMN")
    const [inputWebsiteProvider, setInputWebsiteProvider] = useState("NA")
    const [outputPlatforms, setOutputPlatforms] = useState<string[]>(["FTP"])
    const [outputDMS, setOutputDMS] = useState("VAuto")
    const [outputWebsiteProvider, setOutputWebsiteProvider] = useState("NA")
    const [sameAsInput, setSameAsInput] = useState(false)
    const [clientLanguages, setClientLanguages] = useState<string[]>(["English"])
    const [rooftopsOnSpyne, setRooftopsOnSpyne] = useState("34")
    const [totalRooftops, setTotalRooftops] = useState("34")
    const [websiteURL, setWebsiteURL] = useState("https://www.laredochryslerdeepjeep.com/")
    const [importantNotes, setImportantNotes] = useState("NA")
    const [isGroupDealership, setIsGroupDealership] = useState(true)
    
    // Schedule form state
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata (IST)")
    const [startTime, setStartTime] = useState("8:00 PM")
    const [endTime, setEndTime] = useState("08:30 PM")
    const [duration, setDuration] = useState("30 mins")
    const [rescheduleReason, setRescheduleReason] = useState("")
    const [includeImages, setIncludeImages] = useState(true)
    const [obCallNotRequired, setObCallNotRequired] = useState(false)
    const [inviteEmails, setInviteEmails] = useState("")
    const [participants, setParticipants] = useState([
      { name: "Onboarding Team", email: "ob@spyne.ai", type: "team" },
      { name: "Abhijeet Kaushik", email: "abhijeet.kaushik@spyne.ai", type: "user" },
      { name: "vishal.singh@spyne.ai", email: "vishal.singh@spyne.ai", type: "user" },
      { name: "richa.lakshmi+80@spyne.co.in", email: "richa.lakshmi+80@spyne.co.in", type: "user" }
    ])

    // OB call not required form state
    const obManagerOptions = [
      'Prakash Kumar (prakash.kumar@spyne.ai)',
      'avinash.jha (avinash.jha@spyne.ai)',
      'kanishk.sharma (kanishk.sharma@spyne.ai)',
      'ritika.agarwal (ritika.agarwal@spyne.ai)'
    ]
    const [obManager, setObManager] = useState(obManagerOptions[0])
    const communicationOptions = ['Email', 'Phone', 'Whatsapp', 'Slack']
    const [modeOfCommunication, setModeOfCommunication] = useState<string[]>(['Email'])
    const [obnrEmail, setObnrEmail] = useState("")
    const [obnrReason, setObnrReason] = useState("")
    
    const platformOptions = ["APP", "API", "FTP", "Web", "Console"]
    const languageOptions = ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Dutch", "Chinese", "Japanese", "Korean"]

    // Next 30 days date options
    const next30DaysOptions = useMemo(() => {
      const options: string[] = []
      const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        const parts = formatter.formatToParts(d)
        // Build like: Thu, 28 Aug 2025
        const weekday = parts.find(p => p.type === 'weekday')?.value || ''
        const day = parts.find(p => p.type === 'day')?.value || ''
        const month = parts.find(p => p.type === 'month')?.value || ''
        const year = parts.find(p => p.type === 'year')?.value || ''
        options.push(`${weekday}, ${day} ${month} ${year}`)
      }
      return options
    }, [])

    // Initialize selectedDate to first option
    if (!selectedDate && next30DaysOptions.length > 0) {
      setSelectedDate(next30DaysOptions[0])
    }

    // Timezones list (IST, PT, MT, CT, ET, GMT)
    const timezoneOptions = [
      'Asia/Kolkata (IST)',
      'America/Los_Angeles (PT)',
      'America/Denver (MT)',
      'America/Chicago (CT)',
      'America/New_York (ET)',
      'GMT'
    ]

    // Time options (15-minute steps across full day)
    const timeOptions = useMemo(() => {
      const list: string[] = []
      const format = (mins: number) => {
        const h24 = Math.floor(mins / 60)
        const m = mins % 60
        const suffix = h24 >= 12 ? 'PM' : 'AM'
        const h12 = ((h24 + 11) % 12) + 1
        const mm = m.toString().padStart(2, '0')
        return `${h12}:${mm} ${suffix}`
      }
      for (let m = 0; m < 24 * 60; m += 15) list.push(format(m))
      return list
    }, [])

    const durationOptions = [
      { label: '30 mins', minutes: 30 },
      { label: '45 mins', minutes: 45 },
      { label: '1 hour', minutes: 60 },
    ]

    const parseTimeToMinutes = (t: string): number => {
      const [time, mer] = t.split(' ')
      const [hh, mm] = time.split(':').map(Number)
      let h = hh % 12
      if ((mer || '').toUpperCase() === 'PM') h += 12
      return h * 60 + (mm || 0)
    }
    const formatMinutesToTime = (mins: number): string => {
      const clamp = Math.max(0, Math.min(mins, 23 * 60 + 59))
      const h24 = Math.floor(clamp / 60)
      const m = clamp % 60
      const suffix = h24 >= 12 ? 'PM' : 'AM'
      const h12 = ((h24 + 11) % 12) + 1
      const mm = m.toString().padStart(2, '0')
      return `${h12}:${mm} ${suffix}`
    }

    useEffect(() => {
      const dur = durationOptions.find(d => d.label === duration)?.minutes ?? 30
      const start = parseTimeToMinutes(startTime || '8:00 PM')
      const end = start + dur
      setEndTime(formatMinutesToTime(end))
    }, [startTime, duration])
    
    // Get available sub-stage options based on current stage and sub-stage
    const getAvailableSubStages = () => {
      // If stage is not Contracted or Onboarding, only show Inactive
      if (currentStage !== "Contracted" && currentStage !== "Onboarding") {
        return ["Inactive"]
      }
      
      // For Contracted/Onboarding stages, show progression options
      const subStageSequence = [
        "SH Call Pending",
        "SH Call Scheduled", 
        "SH Call Reschedule",
        "SH Call Done"
      ]
      
      const currentIndex = subStageSequence.indexOf(subStage)
      if (currentIndex === -1) {
        // If current sub-stage not found, start from beginning
        return ["SH Call Pending"]
      }
      
      // Can stay current or move to next available options
      let options: string[] = []
      if (subStage === "SH Call Pending") {
        options = ["SH Call Pending", "SH Call Scheduled"]
      } else if (subStage === "SH Call Scheduled") {
        options = ["SH Call Scheduled", "SH Call Reschedule", "SH Call Done"]
      } else if (subStage === "SH Call Reschedule") {
        options = ["SH Call Reschedule", "SH Call Scheduled", "SH Call Done"]
      } else if (subStage === "SH Call Done") {
        return ["SH Call Done"] // Final state
      } else {
        options = [subStage]
      }
      if (!options.includes("SH Call Cancelled")) options.push("SH Call Cancelled")
      return options
    }

    const handleSubStageChange = (newSubStage: string) => {
      // Check if changing to "SH Call Scheduled" or "SH Call Reschedule" - show modal
      if ((subStage === "SH Call Pending" && newSubStage === "SH Call Scheduled") ||
          (newSubStage === "SH Call Reschedule")) {
        setPendingSubStage(newSubStage)
        setShowHandoverModal(true)
        setIsOpen(false)
      } else if (newSubStage === "SH Call Done") {
        // Ask for confirmation; if yes, also move Stage to Onboarding
        setPendingSubStage(newSubStage)
        setShowDoneConfirm(true)
        setIsOpen(false)
      } else if (newSubStage === "SH Call Cancelled") {
        setPendingSubStage(newSubStage)
        setShowCancelConfirm(true)
        setIsOpen(false)
      } else {
        onRooftopUpdate(rooftopId, { subStage: newSubStage })
        setIsOpen(false)
      }
    }

    // Handle "Same as Input" checkbox
    const handleSameAsInputChange = (checked: boolean) => {
      setSameAsInput(checked)
      if (checked) {
        setOutputPlatforms([...inputPlatforms])
        setOutputDMS(inputDMS)
        setOutputWebsiteProvider(inputWebsiteProvider)
      }
    }

    const handleModalConfirm = () => {
      // Do NOT update the data yet to avoid re-mount that closes the modal
      // Simply show the success toast and advance to the schedule step
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      setShowScheduleForm(true)
    }
    
    const handleScheduleConfirm = () => {
      // Persist the sub-stage update now that scheduling step is confirmed
      if (pendingSubStage) {
        onRooftopUpdate(rooftopId, { subStage: pendingSubStage })
        setPendingSubStage(null)
      }
      setShowHandoverModal(false)
      setShowScheduleForm(false)
    }
    
    const handleBackToHandover = () => {
      setShowScheduleForm(false)
    }

    const handleModalCancel = () => {
      setPendingSubStage(null)
      setShowHandoverModal(false)
    }

    const handleDoneConfirm = () => {
      // Update both sub stage and overall stage
      onRooftopUpdate(rooftopId, { subStage: 'SH Call Done', status: 'Onboarding' })
      setPendingSubStage(null)
      setShowDoneConfirm(false)
    }
    const handleDoneCancel = () => {
      setPendingSubStage(null)
      setShowDoneConfirm(false)
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-h-[40px] flex flex-wrap items-center gap-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selected.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selected.map((item) => (
                <span 
                  key={item}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {item}
                  <button 
                    className="ml-1 text-blue-600 hover:text-blue-800"
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
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          selected.includes(option) ? 'bg-blue-50 text-blue-700' : ''
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

    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium rounded-md h-[22px] min-w-max hover:opacity-80 transition-opacity ${getSubStageColor(subStage)}`}
        >
          <span className="whitespace-nowrap">{subStage}</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-current flex-shrink-0">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-lg z-20 min-w-[160px] max-h-48 overflow-y-auto">
              {getAvailableSubStages().map((option) => (
                <button
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubStageChange(option)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-[#f9fafb] transition-colors ${
                    option === subStage ? "bg-[#f0ebff] text-[#4600f2]" : "text-[#333333]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Handover Details Modal */}
        {showHandoverModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {showScheduleForm ? 'SH Call Schedule' : 'Handover Details'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {showScheduleForm ? 'Schedule Onboarding call with client' : 'Enter enterprise details for OB team.'}
                  </p>
                </div>
                <button
                  onClick={handleModalCancel}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="px-6 py-4 space-y-6">
                {!showScheduleForm ? (
                  // Handover Form
                  <>
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
                        selected={inputPlatforms}
                        onChange={setInputPlatforms}
                        placeholder="Select platforms"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DMS/IMS*
                      </label>
                      <input
                        type="text"
                        value={inputDMS}
                        onChange={(e) => setInputDMS(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Provider*
                      </label>
                      <input
                        type="text"
                        value={inputWebsiteProvider}
                        onChange={(e) => setInputWebsiteProvider(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        id="sameAsInput"
                        checked={sameAsInput}
                        onChange={(e) => handleSameAsInputChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sameAsInput" className="ml-2 block text-sm text-gray-700">
                        Same as Input
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platforms*
                      </label>
                      <MultiSelectDropdown
                        options={platformOptions}
                        selected={outputPlatforms}
                        onChange={setOutputPlatforms}
                        placeholder="Select platforms"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DMS/IMS*
                      </label>
                      <input
                        type="text"
                        value={outputDMS}
                        onChange={(e) => setOutputDMS(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Provider*
                      </label>
                      <input
                        type="text"
                        value={outputWebsiteProvider}
                        onChange={(e) => setOutputWebsiteProvider(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        Is this a Group Dealership?
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <button 
                          className={`px-4 py-2 text-sm font-medium border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isGroupDealership 
                              ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700' 
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsGroupDealership(true)}
                        >
                          Yes
                        </button>
                        <button 
                          className={`px-4 py-2 text-sm font-medium border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            !isGroupDealership 
                              ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700' 
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsGroupDealership(false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rooftops on Spyne*
                      </label>
                      <input
                        type="text"
                        value={rooftopsOnSpyne}
                        onChange={(e) => setRooftopsOnSpyne(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Rooftops (Potential)*
                      </label>
                      <input
                        type="text"
                        value={totalRooftops}
                        onChange={(e) => setTotalRooftops(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL*
                      </label>
                      <input
                        type="url"
                        value={websiteURL}
                        onChange={(e) => setWebsiteURL(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Important Notes*
                      </label>
                      <textarea
                        rows={4}
                        value={importantNotes}
                        onChange={(e) => setImportantNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Languages*
                      </label>
                      <MultiSelectDropdown
                        options={languageOptions}
                        selected={clientLanguages}
                        onChange={setClientLanguages}
                        placeholder="Select languages"
                      />
                    </div>
                  </div>
                </div>
                  </>
                ) : (
                  // Schedule Form
                  <>
                    {/* OB Call Not Required Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="obCallNotRequired"
                        checked={obCallNotRequired}
                        onChange={(e) => setObCallNotRequired(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="obCallNotRequired" className="ml-2 block text-sm text-gray-700">
                        OB call not required.
                      </label>
                    </div>

                    {/* Conditional OB-not-required form */}
                    {obCallNotRequired ? (
                      <div className="space-y-4 mt-4">
                        {/* Onboarding Manager (single select) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Onboarding Manager*</label>
                          <select
                            value={obManager}
                            onChange={(e) => setObManager(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {obManagerOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        {/* Mode of Communication (multi select) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Communication*</label>
                          <MultiSelectDropdown
                            options={communicationOptions}
                            selected={modeOfCommunication}
                            onChange={setModeOfCommunication}
                            placeholder="Select modes"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                          <input
                            type="email"
                            value={obnrEmail}
                            onChange={(e) => setObnrEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Reason */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reason*</label>
                          <textarea
                            rows={4}
                            value={obnrReason}
                            onChange={(e) => setObnrReason(e.target.value)}
                            placeholder="Write your reason"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Images */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="includeImages2"
                            checked={includeImages}
                            onChange={(e) => setIncludeImages(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeImages2" className="ml-2 block text-sm text-gray-700">
                            Images
                          </label>
                        </div>
                      </div>
                    ) : (
                    /* Invite Participants */
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="text"
                          placeholder="Add email addresses to invite guests"
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Invite
                        </button>
                      </div>

                      {/* Participants List */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">PARTICIPANTS</h4>
                        <div className="space-y-2">
                          {participants.map((participant, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                              <span className="text-sm text-gray-500">{participant.email}</span>
                              {participant.type === "user" && (
                                <button className="text-gray-400 hover:text-gray-600" onClick={() => setParticipants(prev => prev.filter((_, i) => i !== index))}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                              )}
                      </div>
                          ))}
                    </div>
                  </div>
                </div>
                    )}

                    {/* Select Date & Time (hidden when OB call not required) */}
                    {!obCallNotRequired && (
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Select a Date & Time</h4>
                      <div className="space-y-4">
                        <div>
                          <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {next30DaysOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <select
                              value={selectedTimezone}
                              onChange={(e) => setSelectedTimezone(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              {durationOptions.map((d) => (
                                <option key={d.label} value={d.label}>{d.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 items-center">
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {timeOptions.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <div className="text-center text-gray-500">-</div>
                          <input
                            type="text"
                            value={endTime}
                            readOnly
                            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Reschedule Reason (only in schedule flow) */}
                    {!obCallNotRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reschedule Reason *
                      </label>
                      <textarea
                        rows={4}
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                        placeholder="Reschedule Reason *"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    )}

                    {/* Images Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeImages"
                        checked={includeImages}
                        onChange={(e) => setIncludeImages(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="includeImages" className="ml-2 block text-sm text-gray-700">
                        Images
                      </label>
                    </div>
                  </>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                {showScheduleForm && (
                  <button
                    onClick={handleBackToHandover}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleModalCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={showScheduleForm ? handleScheduleConfirm : handleModalConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {showScheduleForm ? (obCallNotRequired ? 'Continue' : 'Schedule') : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal for SH Call Done */}
        {showDoneConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mark SH Call as Done?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">This will move the enterprise Stage to Onboarding. Are you sure?</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleDoneCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal for SH Call Cancelled */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cancel SH Call?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">This will move the enterprise Stage to Drop-off. Are you sure?</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => { setShowCancelConfirm(false); setPendingSubStage(null) }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  No
                </button>
                <button
                  onClick={() => { onRooftopUpdate(rooftopId, { subStage: 'SH Call Cancelled', status: 'Drop-off' }); setShowCancelConfirm(false); setPendingSubStage(null) }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Toast */}
        <SuccessToast 
          show={showSuccessToast} 
          onClose={() => setShowSuccessToast(false)} 
        />
      </div>
    )
  }

  return (
    <tr 
      className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer group"
      onClick={() => onRooftopSelect(data.id)}
    >
      {/* Group Dealer */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] sticky left-0 z-10 bg-white group-hover:bg-gray-50">
        <span className="text-sm text-gray-900">{data.groupDealer}</span>
      </td>

      {/* AE POC */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F0EDF4] text-[#6A5F79] text-xs rounded-md font-medium h-[22px]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#6A5F79] w-3 h-3">
            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
          </svg>
          {data.accountExecutivePOC}
        </span>
      </td>

      {/* Finance POC */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F0EDF4] text-[#6A5F79] text-xs rounded-md font-medium h-[22px]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#6A5F79] w-3 h-3">
            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
          </svg>
          {data.financePOC}
        </span>
      </td>

      {/* Stage */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <StageDropdown stage={data.stage} rooftopId={data.id} currentSubStage={data.subStage} />
      </td>

      {/* Sub Stage */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <SubStageDropdown subStage={data.subStage} rooftopId={data.id} currentStage={data.stage} />
      </td>

      {/* Product */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <div className="flex items-center gap-1">
          {data.products.map((product, index) => (
            <span 
              key={index}
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap ${getProductBadgeStyles(product)}`}
            >
              {product}
            </span>
          ))}
        </div>
      </td>

      {/* Media */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <div className="flex items-center gap-1">
          {data.media.map((media, index) => (
            <span 
              key={index}
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap ${getMediaBadgeStyles(media)}`}
            >
              {media}
            </span>
          ))}
        </div>
      </td>

      {/* Platform */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center bg-gray-100 text-gray-800 whitespace-nowrap">
          {data.platform}
        </span>
      </td>

      {/* Type */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getTypeBadgeStyles(data.type)}`}>
          {data.type}
        </span>
      </td>

      {/* Sub Type */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getSubTypeBadgeStyles(data.subType)}`}>
          {data.subType}
        </span>
      </td>

      {/* Region */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[130px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center justify-center min-w-max whitespace-nowrap ${getRegionBadgeStyles(data.region)}`}>
          {data.region}
        </span>
      </td>

      {/* Contracted Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.contractedDate}</span>
      </td>

      {/* Contract Period */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.contractPeriod}</span>
      </td>

      {/* Contracted ARR */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{formatARR(data.contractedARR)}</span>
      </td>

      {/* VINs Alloted */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center bg-gray-100 text-gray-800 whitespace-nowrap">
          {data.vinsAlloted.toLocaleString()}
        </span>
      </td>

      {/* One Time Purchase */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{formatARR(data.oneTimePurchase)}</span>
      </td>

      {/* Addons */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(data.addons || []).map((addon, index) => (
            <span 
              key={index}
              className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap bg-blue-100 text-blue-800 flex-shrink-0"
            >
              {addon}
            </span>
          ))}
        </div>
      </td>

      {/* Contracted Rooftops */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{(data.contractedRooftops || 0).toLocaleString()}</span>
      </td>

      {/* Potential Rooftops */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{(data.potentialRooftops || 0).toLocaleString()}</span>
      </td>

      {/* Payments Frequency */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap bg-gray-100 text-gray-800">
          {data.paymentsFrequency}
        </span>
      </td>

      {/* Lockin Period */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.lockinPeriod}</span>
      </td>

      {/* First Payment Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.firstPaymentDate}</span>
      </td>

      {/* First Payment Amount */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{formatARR(data.firstPaymentAmount)}</span>
      </td>

      {/* Tax ID */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.taxID}</span>
      </td>

      {/* T&Cs Edited */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap ${
          data.termsAndConditionsEdited 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {data.termsAndConditionsEdited ? 'Yes' : 'No'}
        </span>
      </td>

      {/* Contract Source */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap ${
          data.contractSource === 'Dealhub' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {data.contractSource}
        </span>
      </td>
      {/* Removed Team ID column */}

      {/* Enterprise ID */}
      <td className="px-3 py-2 h-9 min-w-[180px]">
        <span className="text-sm text-gray-700">{data.enterpriseId}</span>
      </td>
    </tr>
  )
}

// Success Toast Component
const SuccessToast = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  if (!show) return null
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Details updated successfully</span>
        <button
          onClick={onClose}
          className="text-white hover:text-green-200 ml-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}
