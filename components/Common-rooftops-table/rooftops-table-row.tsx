import { useState, useMemo, useEffect } from "react"
import type { RooftopsData } from "./rooftops-table"

interface RooftopsTableRowProps {
  data: RooftopsData
  onRooftopSelect: (rooftopId: string) => void
  onRooftopUpdate: (rooftopId: string, updates: any) => void
  isSelected: boolean
  onSelectEnterprise: (id: string, checked: boolean) => void
}

export function RooftopsTableRow({ data, onRooftopSelect, onRooftopUpdate, isSelected, onSelectEnterprise }: RooftopsTableRowProps) {
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Group Dealer":
        return "bg-primary-100 text-primary-800"
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
        return "bg-primary-100 text-primary-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlanBadgeStyles = (plan: string) => {
    switch (plan) {
      case "Essential":
        return "bg-primary-100 text-primary-800"
      case "Growth":
        return "bg-purple-100 text-purple-800"
      case "Enterprise":
        return "bg-primary-100 text-primary-800"
      case "Comprehensive":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMediaIcon = (media: string) => {
    switch (media) {
      case "Images":
        return (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.02778 17.5C3.60764 17.5 3.24797 17.3504 2.94878 17.0512C2.64959 16.752 2.5 16.3924 2.5 15.9722V5.27778C2.5 4.85764 2.64959 4.49797 2.94878 4.19878C3.24797 3.89959 3.60764 3.75 4.02778 3.75H14.7222C15.1424 3.75 15.502 3.89959 15.8012 4.19878C16.1004 4.49797 16.25 4.85764 16.25 5.27778V15.9722C16.25 16.3924 16.1004 16.752 15.8012 17.0512C15.502 17.3504 15.1424 17.5 14.7222 17.5H4.02778ZM4.02778 15.9722H14.7222V5.27778H4.02778V15.9722ZM5.55556 14.4444H13.1944C13.3472 14.4444 13.4618 14.3744 13.5382 14.2344C13.6146 14.0943 13.6019 13.9606 13.5 13.8333L11.3993 11.026C11.3229 10.9242 11.2211 10.8733 11.0937 10.8733C10.9664 10.8733 10.8646 10.9242 10.7882 11.026L8.80208 13.6806L7.38889 11.7899C7.3125 11.6881 7.21065 11.6372 7.08333 11.6372C6.95602 11.6372 6.85417 11.6881 6.77778 11.7899L5.25 13.8333C5.14815 13.9606 5.13542 14.0943 5.21181 14.2344C5.28819 14.3744 5.40278 14.4444 5.55556 14.4444ZM6.70139 9.09722C7.01968 9.09722 7.29022 8.98582 7.51302 8.76302C7.73582 8.54022 7.84722 8.26968 7.84722 7.95139C7.84722 7.6331 7.73582 7.36256 7.51302 7.13976C7.29022 6.91696 7.01968 6.80556 6.70139 6.80556C6.3831 6.80556 6.11256 6.91696 5.88976 7.13976C5.66696 7.36256 5.55556 7.6331 5.55556 7.95139C5.55556 8.26968 5.66696 8.54022 5.88976 8.76302C6.11256 8.98582 6.3831 9.09722 6.70139 9.09722Z" fill="#363F72"/>
          </svg>
        )
      case "360 Spin":
        return (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.80078 13.9948C6.023 13.7587 4.55773 13.2726 3.40495 12.5365C2.25217 11.8003 1.67578 10.9531 1.67578 9.99479C1.67578 8.84201 2.47786 7.85938 4.08203 7.04688C5.6862 6.23438 7.66189 5.82812 10.0091 5.82812C12.3563 5.82812 14.332 6.23438 15.9362 7.04688C17.5404 7.85938 18.3424 8.84201 18.3424 9.99479C18.3424 10.7726 17.964 11.4774 17.207 12.1094C16.4501 12.7413 15.4466 13.2378 14.1966 13.599C13.9744 13.6684 13.7765 13.6372 13.6029 13.5052C13.4293 13.3733 13.3424 13.1962 13.3424 12.974C13.3424 12.724 13.4154 12.5017 13.5612 12.3073C13.707 12.1128 13.898 11.974 14.1341 11.8906C14.9674 11.6128 15.5994 11.2969 16.0299 10.9427C16.4605 10.5885 16.6758 10.2726 16.6758 9.99479C16.6758 9.55035 16.082 9.02257 14.8945 8.41146C13.707 7.80035 12.0786 7.49479 10.0091 7.49479C7.93967 7.49479 6.3112 7.80035 5.1237 8.41146C3.9362 9.02257 3.34245 9.55035 3.34245 9.99479C3.34245 10.3281 3.69661 10.7274 4.40495 11.1927C5.11328 11.658 6.12023 12.0087 7.42578 12.2448L6.92578 11.7448C6.773 11.592 6.69661 11.3976 6.69661 11.1615C6.69661 10.9253 6.773 10.7309 6.92578 10.5781C7.07856 10.4253 7.273 10.349 7.50911 10.349C7.74523 10.349 7.93967 10.4253 8.09245 10.5781L10.2591 12.7448C10.4258 12.9115 10.5091 13.1059 10.5091 13.3281C10.5091 13.5503 10.4258 13.7448 10.2591 13.9115L8.09245 16.0781C7.93967 16.2309 7.7487 16.3108 7.51953 16.3177C7.29036 16.3247 7.09245 16.2448 6.92578 16.0781C6.773 15.9253 6.69314 15.7344 6.6862 15.5052C6.67925 15.276 6.75217 15.0781 6.90495 14.9115L7.80078 13.9948Z" fill="#363F72"/>
          </svg>
        )
      case "Video Tour":
        return (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.00977 17.1523C3.58008 17.1523 3.21224 16.9993 2.90625 16.6934C2.60026 16.3874 2.44727 16.0195 2.44727 15.5898V6.21484C2.44727 5.78516 2.60026 5.41732 2.90625 5.11133C3.21224 4.80534 3.58008 4.65234 4.00977 4.65234H13.3848C13.8145 4.65234 14.1823 4.80534 14.4883 5.11133C14.7943 5.41732 14.9473 5.78516 14.9473 6.21484V9.73047L17.4082 7.26953C17.5384 7.13932 17.6816 7.10677 17.8379 7.17188C17.9941 7.23698 18.0723 7.36068 18.0723 7.54297V14.2617C18.0723 14.444 17.9941 14.5677 17.8379 14.6328C17.6816 14.6979 17.5384 14.6654 17.4082 14.5352L14.9473 12.0742V15.5898C14.9473 16.0195 14.7943 16.3874 14.4883 16.6934C14.1823 16.9993 13.8145 17.1523 13.3848 17.1523H4.00977ZM4.00977 15.5898H13.3848V6.21484H4.00977V15.5898Z" fill="#363F72"/>
          </svg>
        )
      default:
        return null
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
          className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <span className="text-sm text-gray-700 min-w-[35px] font-medium">{progress}%</span>
    </div>
  )

  const formatARR = (arr: number | string, isNoDataExample: boolean = false) => {
    // Handle null values or dash
    if (arr === "-" || arr === null || arr === "null" || arr === "Null" || arr === "NULL") {
      return "-";
    }
    
    // Convert to number if it's a string number
    const numArr = typeof arr === 'string' ? parseFloat(arr) : arr;
    
    // Handle invalid numbers
    if (isNaN(numArr)) {
      return "-";
    }
    
    // Handle no-data example case (0 ARR for the dummy row)
    if (numArr === 0 && isNoDataExample) {
      return "-";
    }
    
    if (numArr >= 1000000) {
      return `$${(numArr / 1000000).toFixed(1)}M`
    } else if (numArr >= 1000) {
      return `$${(numArr / 1000).toFixed(0)}K`
    } else {
      return `$${numArr}`
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Contract Initiated":
        return "bg-primary-100 text-primary-800" // Blue (early step, signals fresh start/commitment in progress)
      case "Contracted":
        return "bg-yellow-100 text-yellow-800" // Yellow/Gold (secure but not yet live, feels "locked in")
      case "Onboarding":
        return "bg-orange-100 text-orange-800" // Orange (active progress, in-between phase, energy/movement)
      case "Live":
        return "bg-green-100 text-green-800" // Green (success, active, healthy)
      case "Churned":
        return "bg-red-100 text-red-800" // Red (loss, stop state)
      // Legacy stage mappings for backward compatibility
      case "Contract User Pending Signature":
        return "bg-primary-100 text-primary-800"
      case "Contract Spyne Pending Signature":
        return "bg-primary-100 text-primary-800"
      case "Drop Off":
      case "Drop-off":
      case "Drop-Off":
        return "bg-red-100 text-red-800" // Map to Churned color
      default:
        return "bg-primary-100 text-primary-800" // Default to contract initiated style
    }
  }

  const getSubStageColor = (subStage: string) => {
    switch (subStage) {
      case "Meet Pending":
        return "bg-yellow-100 text-yellow-800" // Yellow (waiting, caution, not finalized yet)
      case "Meet Scheduled":
        return "bg-primary-100 text-primary-800" // Blue (secure, on track, feels stable)
      case "Meet Done":
        return "bg-green-100 text-green-800" // Green (success, meeting happened)
      case "Meet Cancelled":
        return "bg-red-100 text-red-800" // Red (hard negative)
      case "Drop Off":
        return "bg-orange-100 text-orange-800" // Orange (partial negative — didn't complete, but not as final as cancelled)
      case "Meet Reschedule":
        return "bg-yellow-100 text-yellow-800" // Yellow (similar to pending, waiting/caution state)
      case "Inactive":
        return "bg-gray-100 text-gray-800" // Gray (neutral/inactive state)
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const StageBadge = ({ stage }: { stage: string }) => {
    // Only show "Contracted" and "Contract Initiated" stages
    const displayStage = (stage === "Contracted" || stage === "Contract Initiated") ? stage : "Contract Initiated"
    
    return (
      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md h-[22px] min-w-max ${getStageColor(displayStage)}`}>
        <span className="whitespace-nowrap">{displayStage}</span>
      </span>
    )
  }

  const SubStageDropdown = ({ subStage, rooftopId, currentStage }: { subStage: string; rooftopId: string; currentStage: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [showHandoverModal, setShowHandoverModal] = useState(false)
    const [showDoneConfirm, setShowDoneConfirm] = useState(false)
    const [showCancelConfirm, setShowCancelConfirm] = useState(false)
    const [showCancellationModal, setShowCancellationModal] = useState(false)
    const [pendingSubStage, setPendingSubStage] = useState<string | null>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showScheduleForm, setShowScheduleForm] = useState(false)
    const [cancellationReason, setCancellationReason] = useState("")
    
    // Form state
    const [inputPlatforms, setInputPlatforms] = useState<string[]>(["FTP"])
    const [inputDMS, setInputDMS] = useState("HMN")
    const [inputWebsiteProvider, setInputWebsiteProvider] = useState("NA")
    const [outputPlatforms, setOutputPlatforms] = useState<string[]>(["FTP"])
    const [outputDMS, setOutputDMS] = useState("VAuto")
    const [outputWebsiteProvider, setOutputWebsiteProvider] = useState("NA")
    const [sameAsInput, setSameAsInput] = useState(false)
    const [clientLanguages, setClientLanguages] = useState<string[]>(["English"])
    const [importantNotes, setImportantNotes] = useState("NA")
    
    // Schedule form state
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata (IST)")
    const [startTime, setStartTime] = useState("8:00 PM")
    const [endTime, setEndTime] = useState("08:30 PM")
    const [duration, setDuration] = useState("30 mins")
    const [rescheduleReason, setRescheduleReason] = useState("")
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
    const [selectedOnboardingManager, setSelectedOnboardingManager] = useState(obManagerOptions[0])
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
        "Meet Pending",
        "Meet Scheduled", 
        "Meet Reschedule",
        "Meet Done",
        "Meet Cancelled"
      ]
      
      const currentIndex = subStageSequence.indexOf(subStage)
      if (currentIndex === -1) {
        // If current sub-stage not found, start from beginning
        return ["Meet Pending"]
      }
      
      // Can stay current or move to next available options
      let options: string[] = []
      if (subStage === "Meet Pending") {
        options = ["Meet Pending", "Meet Scheduled"]
      } else if (subStage === "Meet Scheduled") {
        options = ["Meet Scheduled", "Meet Reschedule", "Meet Done", "Meet Cancelled"]
      } else if (subStage === "Meet Reschedule") {
        options = ["Meet Reschedule", "Meet Scheduled", "Meet Done"]
      } else if (subStage === "Meet Done") {
        return ["Meet Done"] // Final state
      } else if (subStage === "Meet Cancelled") {
        return ["Meet Cancelled"] // Final state
      } else {
        options = [subStage]
      }
      if (!options.includes("Drop Off")) options.push("Drop Off")
      return options
    }

    const handleSubStageChange = (newSubStage: string) => {
      // Check if changing to "Meet Scheduled" or "Meet Reschedule" - show modal
      if ((subStage === "Meet Pending" && newSubStage === "Meet Scheduled") ||
          (newSubStage === "Meet Reschedule")) {
        setPendingSubStage(newSubStage)
        setShowHandoverModal(true)
        setIsOpen(false)
      } else if (newSubStage === "Meet Done") {
        // Ask for confirmation; if yes, also move Stage to Onboarding
        setPendingSubStage(newSubStage)
        setShowDoneConfirm(true)
        setIsOpen(false)
      } else if (newSubStage === "Meet Cancelled") {
        // Show cancellation reason modal
        setPendingSubStage(newSubStage)
        setShowCancellationModal(true)
        setIsOpen(false)
      } else if (newSubStage === "Drop Off") {
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
      if (!selectedOnboardingManager) {
        return // Don't proceed if no onboarding manager is selected
      }
      
      // Update both sub stage and overall stage, including onboarding manager
      onRooftopUpdate(rooftopId, { 
        subStage: 'Meet Done', 
        status: 'Onboarding',
        onboardingManager: selectedOnboardingManager
      })
      setPendingSubStage(null)
      setShowDoneConfirm(false)
      setSelectedOnboardingManager(obManagerOptions[0]) // Reset to default
    }
    const handleDoneCancel = () => {
      setPendingSubStage(null)
      setShowDoneConfirm(false)
      setSelectedOnboardingManager(obManagerOptions[0]) // Reset to default
    }

    const handleCancellationConfirm = () => {
      if (cancellationReason.trim()) {
        // Update sub stage to Meet Cancelled
        onRooftopUpdate(rooftopId, { subStage: 'Meet Cancelled' })
        setPendingSubStage(null)
        setShowCancellationModal(false)
        setCancellationReason("")
      }
    }

    const handleCancellationCancel = () => {
      setPendingSubStage(null)
      setShowCancellationModal(false)
      setCancellationReason("")
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header - Fixed */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
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
              
              {/* Modal Body - Scrollable */}
              <div className="px-6 py-4 space-y-6 flex-1 overflow-y-auto">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        id="sameAsInput"
                        checked={sameAsInput}
                        onChange={(e) => handleSameAsInputChange(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        value={importantNotes}
                        onChange={(e) => setImportantNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
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
                              value={selectedTimezone}
                              onChange={(e) => setSelectedTimezone(e.target.value)}
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
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
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
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

                                      {/* Reschedule Reason (only when Meet Reschedule is selected) */}
                  {pendingSubStage === "Meet Reschedule" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reschedule Reason *
                      </label>
                      <textarea
                        rows={4}
                        value={rescheduleReason}
                        onChange={(e) => setRescheduleReason(e.target.value)}
                        placeholder="Reschedule Reason *"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    )}

                  </>
                )}
              </div>
              
              {/* Modal Footer - Fixed */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
                {showScheduleForm && (
                  <button
                    onClick={handleBackToHandover}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleModalCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={showScheduleForm ? handleScheduleConfirm : handleModalConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-primary-600 border border-transparent rounded-md hover:from-purple-700 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {showScheduleForm ? (obCallNotRequired ? 'Continue' : 'Schedule') : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal for Meet Done */}
        {showDoneConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mark Meet as Done?</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-gray-700">This will move the enterprise Stage to Onboarding. Are you sure?</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Onboarding Manager *
                  </label>
                  <select
                    value={selectedOnboardingManager}
                    onChange={(e) => setSelectedOnboardingManager(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {obManagerOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleDoneCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneConfirm}
                  disabled={!selectedOnboardingManager}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedOnboardingManager
                      ? 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                      : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Yes, Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal for Drop Off */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mark as Drop Off?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700">This will move the enterprise Stage to Drop Off. Are you sure?</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => { setShowCancelConfirm(false); setPendingSubStage(null) }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  No
                </button>
                <button
                  onClick={() => { onRooftopUpdate(rooftopId, { subStage: 'Drop Off', status: 'Drop Off' }); setShowCancelConfirm(false); setPendingSubStage(null) }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Yes, Drop Off
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meet Cancellation Modal */}
        {showCancellationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Meet Cancellation</h3>
              </div>
              <div className="px-6 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason *
                  </label>
                  <textarea
                    rows={6}
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please provide the reason for cancelling the meet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    required
                  />
                  {!cancellationReason.trim() && (
                    <p className="text-sm text-red-600 mt-1">This field is required</p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCancellationCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancellationConfirm}
                  disabled={!cancellationReason.trim()}
                  className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    cancellationReason.trim()
                      ? 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Cancel Meet
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
      {/* Checkbox + Rooftop Name - Combined sticky column */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-[332px] sticky left-0 z-20 bg-white group-hover:bg-gray-50" style={{ width: "332px !important", minWidth: "332px", maxWidth: "332px" }}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelectEnterprise(data.id, e.target.checked)
            }}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:outline-none flex-shrink-0"
          />
          <span className="text-sm text-gray-900 truncate">{data.name}</span>
        </div>
      </td>

      {/* Enterprise Name */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{data.enterpriseName}</span>
      </td>

      {/* GD Name */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">{data.gdName}</span>
      </td>

      {/* Stage */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <StageBadge stage={data.stage} />
      </td>

      {/* Sub Stage */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <SubStageDropdown subStage={data.subStage} rooftopId={data.id} currentStage={data.stage} />
      </td>

      {/* Type */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getTypeBadgeStyles(data.type)}`}>
          {data.type}
        </span>
      </td>

      {/* Subtype */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getSubTypeBadgeStyles(data.subType)}`}>
          {data.subType}
        </span>
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

      {/* Studio AI */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <div className="flex items-center gap-2">
          {/* Plan Badges */}
          <div className="flex items-center gap-1">
            {(data.plan || []).map((plan, index) => (
              <span 
                key={`plan-${index}`}
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap ${getPlanBadgeStyles(plan)}`}
              >
                {plan}
              </span>
            ))}
          </div>
          
          {/* Media Icons */}
          <div className="flex items-center gap-1">
            {(data.media || []).map((media, index) => (
              <div
                key={`media-${index}`}
                className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-gray-600"
                title={media}
              >
                {getMediaIcon(media)}
              </div>
            ))}
          </div>
        </div>
      </td>

      {/* Region */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[130px]">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center justify-center min-w-max whitespace-nowrap ${getRegionBadgeStyles(data.region)}`}>
          {data.region}
        </span>
      </td>

      {/* Country - New column */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-900">{data.country || 'N/A'}</span>
      </td>

      {/* State - New column */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-900">{data.state || 'N/A'}</span>
      </td>

      {/* City - New column */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-900">{data.city || 'N/A'}</span>
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
        <span className="text-sm text-gray-900">{formatARR(data.contractedARR, data.name === 'No Data Example Dealership')}</span>
      </td>

      {/* VINs Contracted */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center bg-gray-100 text-gray-800 whitespace-nowrap">
          {data.vinsAlloted === "-" ? "-" : typeof data.vinsAlloted === 'number' ? data.vinsAlloted.toLocaleString() : data.vinsAlloted}
        </span>
      </td>

      {/* One Time Purchase */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.oneTimePurchase === "-" ? "-" : typeof data.oneTimePurchase === 'number' ? formatARR(data.oneTimePurchase) : data.oneTimePurchase}</span>
      </td>

      {/* Addons */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(data.addons || []).map((addon, index) => (
            <span 
              key={index}
              className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap bg-primary-100 text-primary-800 flex-shrink-0"
            >
              {addon}
            </span>
          ))}
        </div>
      </td>

      {/* Contracted Rooftops */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.contractedRooftops === "-" ? "-" : typeof data.contractedRooftops === 'number' ? data.contractedRooftops.toLocaleString() : data.contractedRooftops}</span>
      </td>

      {/* Potential Rooftops */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.potentialRooftops === "-" ? "-" : typeof data.potentialRooftops === 'number' ? data.potentialRooftops.toLocaleString() : data.potentialRooftops}</span>
      </td>

      {/* Payment Frequency */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center whitespace-nowrap bg-gray-100 text-gray-800">
          {data.paymentsFrequency}
        </span>
      </td>

      {/* Lock In Period */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.lockinPeriod}</span>
      </td>

      {/* AE POCs */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F0EDF4] text-[#6A5F79] text-xs rounded-md font-medium h-[22px]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-[#6A5F79] w-3 h-3">
            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor"/>
          </svg>
          {data.accountExecutivePOC}
        </span>
      </td>

      {/* First Payment Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.firstPaymentDate}</span>
      </td>

      {/* First Payment Amount */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.firstPaymentAmount === "-" ? "-" : typeof data.firstPaymentAmount === 'number' ? formatARR(data.firstPaymentAmount) : data.firstPaymentAmount}</span>
      </td>

      {/* Tax ID */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 w-max whitespace-nowrap">
        <span className="text-sm text-gray-900">{data.taxID}</span>
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

      {/* Contract Link - New column */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-primary-600 underline cursor-pointer">{data.contractLink || 'N/A'}</span>
      </td>

      {/* Team ID */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px]">
        <span className="text-sm text-gray-700">{data.teamId}</span>
      </td>

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
