"use client"

import { useState } from 'react'
import { RooftopsTable } from '@/components/Common-rooftops-table/rooftops-table'
import { sampleRooftopData } from './data/sample-data'
import type { RooftopData } from './types'

export default function ContractedRooftopsPage() {
  const [rooftopData, setRooftopData] = useState<RooftopData>(sampleRooftopData)
  const [searchTerm, setSearchTerm] = useState("")

  const handleRooftopSelect = (rooftopId: string) => {
    console.log('Selected rooftop:', rooftopId)
    // Handle rooftop selection logic here
  }

  const handleRooftopUpdate = (rooftopId: string, updates: Partial<RooftopData[string]>) => {
    setRooftopData(prev => ({
      ...prev,
      [rooftopId]: {
        ...prev[rooftopId],
        ...updates
      }
    }))
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Contracted Enterprises
          </h2>
        </div>

        {/* Rooftops Table */}
        <div className="bg-white rounded-2xl shadow">
          <RooftopsTable
            rooftopData={rooftopData}
            onRooftopSelect={handleRooftopSelect}
            onRooftopUpdate={handleRooftopUpdate}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  )
}

export type { RooftopData }
