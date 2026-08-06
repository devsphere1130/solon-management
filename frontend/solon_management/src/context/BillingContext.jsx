import { useState } from 'react'
import { BillingContext } from './billingContextValue.js'

const initialInvoices = [
  { id: 'INV-2026-1001', type: 'Salon', customer: 'Aarav Sharma', phone: '+91 98765 43210', date: '04 Aug 2026', items: [{ kind: 'Service', name: 'Haircut & Styling', quantity: 1, price: 850 }], subtotal: 850, discount: 50, tax: 144, total: 944 },
  { id: 'INV-2026-1002', type: 'Product', customer: 'Meera Iyer', phone: '+91 98234 56781', date: '04 Aug 2026', items: [{ kind: 'Product', name: 'Keratin Recovery Hair Mask', quantity: 2, price: 1299 }], subtotal: 2598, discount: 198, tax: 432, total: 2832 },
  { id: 'INV-2026-1003', type: 'Combined', customer: 'Ananya Patel', phone: '+91 97654 32109', date: '03 Aug 2026', items: [{ kind: 'Service', name: 'Hair Spa', quantity: 1, price: 1800 }, { kind: 'Product', name: 'Heat Protect Shine Serum', quantity: 1, price: 749 }], subtotal: 2549, discount: 249, tax: 414, total: 2714 },
]

const initialPayments = [
  { id: 'PAY-5001', invoiceId: 'INV-2026-1001', customer: 'Aarav Sharma', amount: 944, method: 'UPI', reference: 'UPI238491', date: '04 Aug 2026, 10:45 AM' },
  { id: 'PAY-5002', invoiceId: 'INV-2026-1002', customer: 'Meera Iyer', amount: 1500, method: 'Card', reference: 'CARD-8821', date: '04 Aug 2026, 11:20 AM' },
]

export function BillingProvider({ children }) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [payments, setPayments] = useState(initialPayments)

  const addInvoice = (invoice) => setInvoices((current) => [{ ...invoice, id: `INV-2026-${1001 + current.length}` }, ...current])
  const addPayment = (payment) => setPayments((current) => [{ ...payment, id: `PAY-${5001 + current.length}`, date: new Date().toLocaleString('en-IN') }, ...current])
  const paidForInvoice = (invoiceId) => payments.filter((payment) => payment.invoiceId === invoiceId).reduce((sum, payment) => sum + Number(payment.amount), 0)
  const invoiceStatus = (invoice) => { const paid = paidForInvoice(invoice.id); if (paid <= 0) return 'Pending'; if (paid < invoice.total) return 'Partially Paid'; return 'Paid' }
  const value = { invoices, payments, addInvoice, addPayment, paidForInvoice, invoiceStatus }

  return <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
}
