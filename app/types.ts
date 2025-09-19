// API Response Types
export interface ApiTeamData {
  country: string
  state: string
  city: string
  team_name: string
  enterprise_id: string
  org_name: string
  team_id: string
  enterprise_name: string
  ae_name: string
  stage: string
  sub_stage: string
  account_type: string
  account_sub_type: string
  platform: string
  region_type: string
  arr: number
  products: string[]
  contracted_date: string
  contract_duration: number
  vins_contracted: number
  one_time_fees: number
  add_ons: string[]
  payment_frequency: number | string
  lock_in_period: string
  first_payment_date: string
  first_payment_amount: number
  tax_id: string
  finance_poc: string
  is_terms_edited: string
  contract_source: string
  contract_link: string
  plan: string
  conversationAiPlan: string | null
  hasConversationAi: boolean
  sla: string
}

export interface ApiResponse {
  data: {
    totalCount: number
    teams: ApiTeamData[]
  }
  total?: number
  page?: number
  per_page?: number
}

export interface ApiRequestPayload {
  page: number
  per_page: number
  filters?: {
    region_type?: string
    account_type?: string
    account_sub_type?: string
    ae_id?: string
    sub_stage?: string
    stage?: string[]
  }
  search?: string
}

// Legacy types for backward compatibility
export interface RooftopData {
  [key: string]: {
    name: string
    obProgress: number
    arr: number
    ageing: number
    obPoc: {
      name: string
    }
    status: string
    subStage?: string
    productSuite: string[]
    products: string[]
    tat: number
  }
}

export interface RooftopsData {
  id: string
  groupDealer: string
  enterpriseName: string
  gdName: string
  name: string
  logo: string
  obProgress: number
  arr: number
  contractedARR: number
  vinsAlloted: number | string
  oneTimePurchase: number | string
  addons: string[]
  contractedRooftops: number | string
  potentialRooftops: number | string
  paymentsFrequency: string
  lockinPeriod: string
  firstPaymentDate: string
  firstPaymentAmount: number | string
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
  country?: string
  state?: string
  city?: string
  contractedDate: string
  contractPeriod: string
  contractLink?: string
  sla: string
  teamId: string
  enterpriseId: string
  products: string[]
  media: string[]
  tat: number
  platform: string
  conversationAiPlan?: string | null
  hasConversationAi?: boolean
  plan?: string | string[]
}
