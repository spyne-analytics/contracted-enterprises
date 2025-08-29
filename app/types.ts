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
