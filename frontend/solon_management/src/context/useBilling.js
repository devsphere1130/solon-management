import { useContext } from 'react'
import { BillingContext } from './billingContextValue.js'

export function useBilling() {
  const context = useContext(BillingContext)
  if (!context) throw new Error('useBilling must be used inside BillingProvider')
  return context
}
