import { ApiResponse, ApiRequestPayload, ApiTeamData, RooftopsData } from '../types'

// Client-side API service for making requests to external API
// Uses NEXT_PUBLIC_ environment variables to ensure client-side availability
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://uat-api.spyne.xyz/console/v1'
const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_BEARER_TOKEN

/**
 * Client-side API service for fetching contracted teams data
 * All requests are made from the browser using fetch API
 */
export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure this runs only on client side
    if (typeof window === 'undefined') {
      throw new Error('API calls must be made from client side')
    }

    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`,
      'Cookie': 'sails.sid=s%3ARUPPIQWtH0U4n0ir6bE2Cw2zF9iThl6p.rQHQyWTMYHbQRGDmKF5GbJLLHx3vxs6FUqmpfGpoxRw; sails.sid=s%3A82gbG46nbIAMFz8nOKbartgYNnV-mCF1.Hsx68ZhziPctFZsHUUaVnVOQRZDZd%2B8wOiDggDLzcyg'
    }

    console.log('Making API request to:', url)
    console.log('Request payload:', options.body)
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Explicitly set CORS mode for client-side requests
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    console.log('API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('API response data:', data)
    return data
  }

  static async getContractedTeams(payload: ApiRequestPayload): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/enterprise/team/get-contracted-teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  // Test method to verify API connectivity
  static async testConnection(): Promise<boolean> {
    try {
      const testPayload: ApiRequestPayload = {
        page: 1,
        per_page: 1
      }
      await this.getContractedTeams(testPayload)
      return true
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  }

  // Helper function to format dates
  private static formatDate(dateString: string): string {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  // Transform API data to match the existing RooftopsData interface
  static transformApiDataToRooftopsData(apiData: ApiTeamData[]): RooftopsData[] {
    return apiData.map((item, index) => ({
      id: item.team_id,
      groupDealer: item.org_name,
      name: item.team_name, // Rooftop Name
      enterpriseName: item.enterprise_name, // Enterprise Name
      gdName: item.org_name, // GD Name (same as groupDealer)
      logo: '', // Not provided in API
      obProgress: 0, // Not provided in API, using default
      arr: item.arr,
      contractedARR: item.arr, // Contracted ARR
      vinsAlloted: item.vins_contracted, // VINs Contracted
      oneTimePurchase: item.one_time_fees, // One Time Purchase
      addons: item.add_ons, // Addons
      contractedRooftops: 0, // Not provided in API
      potentialRooftops: 0, // Not provided in API
      paymentsFrequency: item.payment_frequency.toString(), // Payment Frequency
      lockinPeriod: item.lock_in_period, // Lock In Period
      firstPaymentDate: this.formatDate(item.first_payment_date), // First Payment Date
      firstPaymentAmount: item.first_payment_amount, // First Payment Amount
      taxID: item.tax_id, // Tax ID
      termsAndConditionsEdited: item.is_terms_edited === 'Yes', // T&C Edited
      contractSource: item.contract_source, // Contract Source
      ageing: 0, // Not provided in API, using default
      accountExecutivePOC: item.ae_name, // AE POCs
      financePOC: item.finance_poc, // Finance POC
      stage: item.stage, // Stage
      subStage: item.sub_stage === "Drop-Off" ? "Drop off" : item.sub_stage, // Sub Stage (normalize Drop-Off to Drop off)
      type: item.account_type, // Type
      subType: item.account_sub_type, // Sub Type
      region: item.region_type, // Region
      country: item.country, // Country
      state: item.state, // State
      city: item.city, // City
      contractedDate: this.formatDate(item.contracted_date), // Contracted Date
      contractPeriod: item.contract_duration.toString(), // Contracted Period
      contractLink: item.contract_link, // Contract Link
      sla: {
        status: "On Track", // Default value as not provided in API
        daysBreached: undefined
      },
      teamId: item.team_id, // Team ID
      enterpriseId: item.enterprise_id, // Enterprise ID
      products: item.products, // Products array for Studio AI icons
      media: item.products, // Using products for media icons
      tat: 0, // Not provided in API, using default
      platform: item.platform,
      // Converse AI - now provided in API
      hasConversationAi: item.hasConversationAi,
      conversationAiPlan: item.conversationAiPlan,
      // Plan is now provided directly from API, fallback to products-based logic if empty
      plan: item.plan && item.plan.trim() !== '' ? [item.plan] : (item.products && item.products.length > 0 ? ['Studio AI'] : [])
    }))
  }

  // Helper method to get teams with default parameters (50 records initially)
  static async getTeamsWithDefaults(
    filters?: Partial<ApiRequestPayload['filters']>,
    contractedOnly?: boolean,
    search?: string
  ): Promise<{ data: RooftopsData[], hasMore: boolean, total: number }> {
    const payload: ApiRequestPayload = {
      page: 1,
      per_page: 50, // Start with 50 records
      ...(filters && { filters }),
      ...(contractedOnly ? { contracted_only: true } : {}),
      ...(search && search.trim() !== '' ? { search: search.trim() } : {})
    }

    const response = await this.getContractedTeams(payload)
    const transformedData = this.transformApiDataToRooftopsData(response.data.teams)
    
    return {
      data: transformedData,
      hasMore: response.data.teams.length === payload.per_page, // Has more if we got full page
      total: response.data.totalCount || response.data.teams.length
    }
  }

  // Method to get next page of data for infinite scroll
  static async getTeamsPage(
    page: number,
    perPage: number = 50,
    filters?: Partial<ApiRequestPayload['filters']>,
    contractedOnly?: boolean,
    search?: string
  ): Promise<{ data: RooftopsData[], hasMore: boolean, total: number }> {
    const payload: ApiRequestPayload = {
      page,
      per_page: perPage,
      ...(filters && { filters }),
      ...(contractedOnly ? { contracted_only: true } : {}),
      ...(search && search.trim() !== '' ? { search: search.trim() } : {})
    }

    const response = await this.getContractedTeams(payload)
    const transformedData = this.transformApiDataToRooftopsData(response.data.teams)
    
    return {
      data: transformedData,
      hasMore: response.data.teams.length === payload.per_page,
      total: response.data.totalCount || response.data.teams.length
    }
  }
}
