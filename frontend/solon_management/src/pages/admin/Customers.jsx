import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  Pencil,
  Search,
  UserCheck,
  UserRound,
  UsersRound,
  UserX,
  X,
} from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Badge from '../../components/common/Badge.jsx'

const initialCustomers = [
  { id: 1, name: 'Aarav Sharma', phone: '+91 98765 43210', email: 'aarav@example.com', gender: 'Male', visits: 12, spending: 12850, lastVisit: '03 Aug 2026', status: 'Active', birthday: '14 March', address: 'Andheri West, Mumbai', worker: 'Arjun Rao', notes: 'Prefers evening appointments.' },
  { id: 2, name: 'Meera Iyer', phone: '+91 98234 56781', email: 'meera@example.com', gender: 'Female', visits: 8, spending: 22400, lastVisit: '03 Aug 2026', status: 'Active', birthday: '22 June', address: 'Indiranagar, Bengaluru', worker: 'Riya Mehta', notes: 'Bridal package customer.' },
  { id: 3, name: 'Kabir Singh', phone: '+91 99876 54321', email: 'kabir@example.com', gender: 'Male', visits: 5, spending: 4600, lastVisit: '02 Aug 2026', status: 'Active', birthday: '09 January', address: 'Sector 17, Chandigarh', worker: 'Arjun Rao', notes: 'Prefers short waiting time.' },
  { id: 4, name: 'Ananya Patel', phone: '+91 97654 32109', email: 'ananya@example.com', gender: 'Female', visits: 16, spending: 31500, lastVisit: '01 Aug 2026', status: 'Active', birthday: '18 September', address: 'Navrangpura, Ahmedabad', worker: 'Neha Kapoor', notes: 'Regular hair spa customer.' },
  { id: 5, name: 'Ishaan Verma', phone: '+91 96543 21098', email: 'ishaan@example.com', gender: 'Male', visits: 3, spending: 5100, lastVisit: '28 Jul 2026', status: 'Inactive', birthday: '30 April', address: 'Gomti Nagar, Lucknow', worker: 'Pooja Das', notes: 'Sensitive skin products only.' },
  { id: 6, name: 'Sara Khan', phone: '+91 95432 10987', email: 'sara@example.com', gender: 'Female', visits: 10, spending: 18750, lastVisit: '25 Jul 2026', status: 'Active', birthday: '11 November', address: 'Banjara Hills, Hyderabad', worker: 'Pooja Das', notes: 'Prefers weekend appointments.' },
  { id: 7, name: 'Rohan Gupta', phone: '+91 94321 09876', email: 'rohan@example.com', gender: 'Male', visits: 7, spending: 9800, lastVisit: '19 Jul 2026', status: 'Active', birthday: '05 May', address: 'Salt Lake, Kolkata', worker: 'Arjun Rao', notes: 'Uses ammonia-free hair colour.' },
  { id: 8, name: 'Diya Nair', phone: '+91 93210 98765', email: 'diya@example.com', gender: 'Female', visits: 14, spending: 42600, lastVisit: '15 Jul 2026', status: 'Active', birthday: '27 February', address: 'Kakkanad, Kochi', worker: 'Neha Kapoor', notes: 'Premium membership customer.' },
  { id: 9, name: 'Vivaan Joshi', phone: '+91 92109 87654', email: 'vivaan@example.com', gender: 'Male', visits: 2, spending: 1400, lastVisit: '08 Jul 2026', status: 'Inactive', birthday: '16 August', address: 'Kothrud, Pune', worker: 'Arjun Rao', notes: 'New customer.' },
  { id: 10, name: 'Ira Malhotra', phone: '+91 91098 76543', email: 'ira@example.com', gender: 'Female', visits: 9, spending: 27300, lastVisit: '01 Jul 2026', status: 'Active', birthday: '03 December', address: 'Saket, New Delhi', worker: 'Riya Mehta', notes: 'Interested in makeup packages.' },
]

const emptyForm = { name: '', phone: '', email: '', gender: 'Female', birthday: '', address: '', worker: '', notes: '', status: 'Active' }
const pageSize = 6

function Field({ label, required, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-text">{label}{required && <span className="text-danger"> *</span>}</span>
      <input required={required} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary" {...props} />
    </label>
  )
}

function CustomerModal({ mode, customer, onClose, onSave }) {
  const [form, setForm] = useState(customer ? { ...customer } : emptyForm)
  const isView = mode === 'view'
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event) => { event.preventDefault(); onSave(form) }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4">
        <motion.div initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-lg font-extrabold text-text">{isView ? 'Customer details' : customer ? 'Edit customer' : 'Add customer'}</h2>
              <p className="mt-1 text-sm text-text-muted">{isView ? 'Profile, visits, spending and preferences.' : 'Enter the customer information below.'}</p>
            </div>
            <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted hover:bg-background" aria-label="Close"><X className="size-4" /></button>
          </div>

          {isView ? (
            <div className="max-h-[72vh] overflow-y-auto p-6 premium-scrollbar">
              <div className="flex flex-col gap-5 rounded-2xl bg-background p-5 sm:flex-row sm:items-center">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <div className="min-w-0 flex-1"><h3 className="text-xl font-extrabold text-text">{customer.name}</h3><p className="mt-1 text-sm text-text-muted">{customer.phone} · {customer.email}</p></div>
                <Badge variant={customer.status === 'Active' ? 'success' : 'outline'}>{customer.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[['Total visits', customer.visits], ['Total spending', `₹${customer.spending.toLocaleString('en-IN')}`], ['Last visit', customer.lastVisit], ['Preferred worker', customer.worker]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border p-4"><p className="text-xs text-text-muted">{label}</p><p className="mt-1 text-sm font-bold text-text">{value}</p></div>)}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[['Gender', customer.gender], ['Birthday', customer.birthday || 'Not provided'], ['Address', customer.address || 'Not provided'], ['Notes', customer.notes || 'No notes']].map(([label, value]) => <div key={label} className="rounded-2xl border border-border p-4"><p className="text-xs font-semibold text-text-muted">{label}</p><p className="mt-1.5 text-sm leading-6 text-text">{value}</p></div>)}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="max-h-[75vh] overflow-y-auto p-6 premium-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Customer name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Enter full name" />
                <Field label="Mobile number" required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Enter mobile number" />
                <Field label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="Enter email address" />
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Gender</span><select value={form.gender} onChange={(event) => update('gender', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option>Female</option><option>Male</option><option>Other</option></select></label>
                <Field label="Date of birth" type="date" value={form.birthday.includes?.('-') ? form.birthday : ''} onChange={(event) => update('birthday', event.target.value)} />
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Preferred worker</span><select value={form.worker} onChange={(event) => update('worker', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option value="">Select worker</option><option>Neha Kapoor</option><option>Riya Mehta</option><option>Arjun Rao</option><option>Pooja Das</option></select></label>
                <Field label="Address" value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Enter address" className="sm:col-span-2" />
                <Field label="Notes" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Customer preferences or notes" className="sm:col-span-2" />
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option>Active</option><option>Inactive</option></select></label>
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{customer ? 'Save changes' : 'Add customer'}</Button></div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return customers.filter((customer) => (!query || [customer.name, customer.phone, customer.email].some((value) => value.toLowerCase().includes(query))) && (!status || customer.status === status) && (!gender || customer.gender === gender))
  }, [customers, search, status, gender])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleCustomers = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const activeCount = customers.filter((customer) => customer.status === 'Active').length
  const summary = [
    { label: 'Total customers', value: customers.length, icon: UsersRound, tone: 'bg-primary/10 text-primary' },
    { label: 'New this month', value: 4, icon: CalendarDays, tone: 'bg-info/10 text-info' },
    { label: 'Active customers', value: activeCount, icon: UserCheck, tone: 'bg-success/10 text-success' },
    { label: 'Inactive customers', value: customers.length - activeCount, icon: UserX, tone: 'bg-warning/10 text-warning' },
  ]

  const saveCustomer = (form) => {
    const editingCustomer = modal?.customer
    if (editingCustomer) setCustomers((current) => current.map((customer) => customer.id === editingCustomer.id ? { ...customer, ...form } : customer))
    else setCustomers((current) => [...current, { ...form, id: Date.now(), visits: 0, spending: 0, lastVisit: 'No visits yet' }])
    setModal(null)
  }
  const clearFilters = () => { setSearch(''); setStatus(''); setGender(''); setPage(1) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-extrabold tracking-tight text-text">Customers</h1><p className="mt-1 text-sm text-text-muted">Manage customer profiles, visits and preferences.</p></div><Button type="button" onClick={() => setModal({ mode: 'add' })}><CirclePlus className="size-4" />Add customer</Button></div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{summary.map(({ label, value, icon: Icon, tone }, index) => <motion.article key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -3 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-text-muted">{label}</p><p className="mt-2 text-2xl font-extrabold text-text">{String(value).padStart(2, '0')}</p></div><span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span></div></motion.article>)}</div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
        <div className="relative"><Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search name, phone or email" className="h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm outline-none placeholder:text-text-muted focus:border-primary" /></div>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold outline-none focus:border-primary"><option value="">All statuses</option><option>Active</option><option>Inactive</option></select>
        <select value={gender} onChange={(event) => { setGender(event.target.value); setPage(1) }} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold outline-none focus:border-primary"><option value="">All genders</option><option>Female</option><option>Male</option><option>Other</option></select>
        <Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>
      </div></section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-bold text-text">Customer list</h2><p className="mt-0.5 text-xs text-text-muted">{filtered.length} matching customers</p></div>
        <div className="overflow-x-auto premium-scrollbar"><table className="w-full min-w-[1150px] text-left"><thead className="bg-background"><tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">{['Sr. No.', 'Customer', 'Mobile number', 'Gender', 'Appointments', 'Total spending', 'Last visit', 'Status', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3.5">{heading}</th>)}</tr></thead><tbody>
          {visibleCustomers.map((customer, index) => <tr key={customer.id} className="border-b border-border/70 last:border-0 hover:bg-primary/[0.035]"><td className="px-5 py-4 text-sm font-semibold text-text-muted">{(currentPage - 1) * pageSize + index + 1}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><p className="text-sm font-bold text-text">{customer.name}</p><p className="text-xs text-text-muted">{customer.email}</p></div></div></td><td className="px-5 py-4 text-sm text-text-muted">{customer.phone}</td><td className="px-5 py-4 text-sm text-text">{customer.gender}</td><td className="px-5 py-4 text-sm font-bold text-text">{customer.visits}</td><td className="px-5 py-4 text-sm font-bold text-text">₹{customer.spending.toLocaleString('en-IN')}</td><td className="px-5 py-4 text-sm text-text-muted">{customer.lastVisit}</td><td className="px-5 py-4"><Badge variant={customer.status === 'Active' ? 'success' : 'outline'}>{customer.status}</Badge></td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" onClick={() => setModal({ mode: 'view', customer })} className="flex size-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-primary" aria-label={`View ${customer.name}`}><Eye className="size-4" /></button><button type="button" onClick={() => setModal({ mode: 'edit', customer })} className="flex size-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-primary" aria-label={`Edit ${customer.name}`}><Pencil className="size-4" /></button></div></td></tr>)}
          {!visibleCustomers.length && <tr><td colSpan="9" className="px-5 py-14 text-center"><UserRound className="mx-auto size-8 text-text-muted/50" /><p className="mt-3 text-sm font-bold text-text">No customers found</p><p className="mt-1 text-xs text-text-muted">Try changing or clearing the filters.</p></td></tr>}
        </tbody></table></div>
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-text-muted">Showing <strong className="text-text">{filtered.length ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong className="text-text">{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong className="text-text">{filtered.length}</strong></p><div className="flex items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-40"><ChevronLeft className="size-4" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`size-9 rounded-lg text-xs font-bold ${number === currentPage ? 'bg-primary text-white' : 'border border-border text-text-muted'}`}>{number}</button>)}<button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="flex size-9 items-center justify-center rounded-lg border border-border text-text-muted disabled:opacity-40"><ChevronRight className="size-4" /></button></div></div>
      </section>
      {modal ? <CustomerModal mode={modal.mode} customer={modal.customer ?? null} onClose={() => setModal(null)} onSave={saveCustomer} /> : null}
    </div>
  )
}

export default Customers
