import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Cake,
  CalendarClock,
  CirclePlus,
  Crown,
  Eye,
  Gift,
  Megaphone,
  Search,
  Send,
  Trash2,
  TrendingUp,
  UserPlus,
  UserX,
  X,
} from 'lucide-react'
import Button from '../../components/common/Button.jsx'
import Badge from '../../components/common/Badge.jsx'

const initialCampaigns = [
  { id: 1, name: 'Monsoon Hair Spa Bonanza', type: 'SMS', segment: 'All Customers', offer: '20% off hair spa', status: 'Active', sent: 480, redemptions: 62, startDate: '01 Aug 2026', endDate: '31 Aug 2026' },
  { id: 2, name: 'Birthday Glow Offer', type: 'WhatsApp', segment: 'Birthday This Month', offer: 'Free add-on service', status: 'Active', sent: 18, redemptions: 9, startDate: '01 Aug 2026', endDate: '31 Aug 2026' },
  { id: 3, name: 'We Miss You', type: 'Email', segment: 'Inactive Customers', offer: '25% off next visit', status: 'Scheduled', sent: 0, redemptions: 0, startDate: '12 Aug 2026', endDate: '26 Aug 2026' },
  { id: 4, name: 'VIP Early Access', type: 'WhatsApp', segment: 'VIP Customers', offer: 'Priority booking + 15% off', status: 'Completed', sent: 34, redemptions: 21, startDate: '01 Jul 2026', endDate: '15 Jul 2026' },
  { id: 5, name: 'Welcome Aboard', type: 'Email', segment: 'New Customers', offer: '10% off first rebook', status: 'Active', sent: 12, redemptions: 4, startDate: '01 Jul 2026', endDate: '31 Dec 2026' },
  { id: 6, name: 'Festive Season Teaser', type: 'SMS', segment: 'All Customers', offer: 'Flat ₹300 off', status: 'Draft', sent: 0, redemptions: 0, startDate: '-', endDate: '-' },
  { id: 7, name: 'Weekend Slot Filler', type: 'Push', segment: 'All Customers', offer: 'Free head massage', status: 'Paused', sent: 210, redemptions: 18, startDate: '20 Jul 2026', endDate: '27 Jul 2026' },
]

const segments = [
  { label: 'Birthday this month', value: 3, icon: Cake, tone: 'bg-accent/15 text-accent-foreground' },
  { label: 'Inactive 60+ days', value: 2, icon: UserX, tone: 'bg-warning/10 text-warning' },
  { label: 'VIP customers', value: 4, icon: Crown, tone: 'bg-primary/10 text-primary' },
  { label: 'New customers', value: 2, icon: UserPlus, tone: 'bg-info/10 text-info' },
]

const statusVariant = { Active: 'success', Scheduled: 'info', Completed: 'default', Draft: 'outline', Paused: 'warning' }
const typeVariant = { SMS: 'accent', Email: 'info', WhatsApp: 'success', Push: 'outline' }
const emptyForm = { name: '', type: 'SMS', segment: 'All Customers', offer: '', status: 'Draft', startDate: '', endDate: '' }

function Field({ label, required, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-text">{label}{required && <span className="text-danger"> *</span>}</span>
      <input required={required} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none placeholder:text-text-muted focus:border-primary" {...props} />
    </label>
  )
}

function CampaignModal({ mode, campaign, onClose, onSave }) {
  const [form, setForm] = useState(campaign ? { ...campaign } : emptyForm)
  const isView = mode === 'view'
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event) => { event.preventDefault(); onSave(form) }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4">
        <motion.div initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-lg font-extrabold text-text">{isView ? 'Campaign details' : 'New campaign'}</h2>
              <p className="mt-1 text-sm text-text-muted">{isView ? 'Reach, redemptions and offer details.' : 'Set up a targeted campaign for your customers.'}</p>
            </div>
            <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted hover:bg-background" aria-label="Close"><X className="size-4" /></button>
          </div>

          {isView ? (
            <div className="max-h-[72vh] overflow-y-auto p-6 premium-scrollbar">
              <div className="flex flex-col gap-4 rounded-2xl bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="text-lg font-extrabold text-text">{campaign.name}</h3><p className="mt-1 text-sm text-text-muted">{campaign.offer}</p></div>
                <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[['Type', campaign.type], ['Audience', campaign.segment], ['Sent', campaign.sent], ['Redemptions', campaign.redemptions]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border p-4"><p className="text-xs text-text-muted">{label}</p><p className="mt-1 text-sm font-bold text-text">{value}</p></div>)}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[['Start date', campaign.startDate], ['End date', campaign.endDate]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border p-4"><p className="text-xs font-semibold text-text-muted">{label}</p><p className="mt-1.5 text-sm leading-6 text-text">{value}</p></div>)}
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="max-h-[75vh] overflow-y-auto p-6 premium-scrollbar">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Campaign name" required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Festive Season Offer" className="sm:col-span-2" />
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Channel</span><select value={form.type} onChange={(event) => update('type', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option>SMS</option><option>Email</option><option>WhatsApp</option><option>Push</option></select></label>
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Audience</span><select value={form.segment} onChange={(event) => update('segment', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option>All Customers</option><option>VIP Customers</option><option>Inactive Customers</option><option>Birthday This Month</option><option>New Customers</option></select></label>
                <Field label="Offer" required value={form.offer} onChange={(event) => update('offer', event.target.value)} placeholder="e.g. 20% off next visit" className="sm:col-span-2" />
                <Field label="Start date" type="date" value={form.startDate} onChange={(event) => update('startDate', event.target.value)} />
                <Field label="End date" type="date" value={form.endDate} onChange={(event) => update('endDate', event.target.value)} />
                <label><span className="mb-1.5 block text-sm font-semibold text-text">Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary"><option>Draft</option><option>Scheduled</option><option>Active</option></select></label>
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">Create campaign</Button></div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Marketing() {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return campaigns.filter((campaign) => (!query || [campaign.name, campaign.offer, campaign.segment].some((value) => value.toLowerCase().includes(query))) && (!status || campaign.status === status) && (!type || campaign.type === type))
  }, [campaigns, search, status, type])

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalRedemptions = campaigns.reduce((sum, campaign) => sum + campaign.redemptions, 0)
  const summary = [
    { label: 'Active campaigns', value: campaigns.filter((campaign) => campaign.status === 'Active').length, icon: Megaphone, tone: 'bg-primary/10 text-primary' },
    { label: 'Messages sent', value: totalSent, icon: Send, tone: 'bg-info/10 text-info' },
    { label: 'Redemptions', value: totalRedemptions, icon: Gift, tone: 'bg-success/10 text-success' },
    { label: 'Redemption rate', value: `${totalSent ? Math.round((totalRedemptions / totalSent) * 100) : 0}%`, icon: TrendingUp, tone: 'bg-warning/10 text-warning' },
  ]

  const addCampaign = (form) => { setCampaigns((current) => [...current, { ...form, id: Date.now(), sent: 0, redemptions: 0 }]); setModal(null) }
  const deleteCampaign = (id) => setCampaigns((current) => current.filter((campaign) => campaign.id !== id))
  const clearFilters = () => { setSearch(''); setStatus(''); setType('') }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-extrabold tracking-tight text-text">Marketing</h1><p className="mt-1 text-sm text-text-muted">Plan campaigns and reach the right customer segments.</p></div>
        <Button type="button" onClick={() => setModal({ mode: 'add' })}><CirclePlus className="size-4" />New campaign</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{summary.map(({ label, value, icon: Icon, tone }, index) => <motion.article key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -3 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold text-text-muted">{label}</p><p className="mt-2 text-2xl font-extrabold text-text">{value}</p></div><span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span></div></motion.article>)}</div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-4"><h2 className="text-sm font-bold text-text">Audience segments</h2><p className="mt-0.5 text-xs text-text-muted">Ready-made customer groups you can target.</p></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{segments.map(({ label, value, icon: Icon, tone }) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-border p-4"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span><div><p className="text-lg font-extrabold text-text">{value}</p><p className="text-xs text-text-muted">{label}</p></div></div>)}</div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-soft"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
        <div className="relative"><Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search campaign, offer or audience" className="h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm outline-none placeholder:text-text-muted focus:border-primary" /></div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold outline-none focus:border-primary"><option value="">All statuses</option><option>Draft</option><option>Scheduled</option><option>Active</option><option>Paused</option><option>Completed</option></select>
        <select value={type} onChange={(event) => setType(event.target.value)} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold outline-none focus:border-primary"><option value="">All channels</option><option>SMS</option><option>Email</option><option>WhatsApp</option><option>Push</option></select>
        <Button type="button" variant="outline" onClick={clearFilters}>Clear filters</Button>
      </div></section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border px-5 py-4"><h2 className="text-sm font-bold text-text">Campaigns</h2><p className="mt-0.5 text-xs text-text-muted">{filtered.length} matching campaigns</p></div>
        <div className="overflow-x-auto premium-scrollbar"><table className="w-full min-w-[1100px] text-left"><thead className="bg-background"><tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">{['Campaign', 'Channel', 'Audience', 'Status', 'Sent', 'Redemptions', 'Duration', 'Actions'].map((heading) => <th key={heading} className="px-5 py-3.5">{heading}</th>)}</tr></thead><tbody>
          {filtered.map((campaign) => <tr key={campaign.id} className="border-b border-border/70 last:border-0 hover:bg-primary/[0.035]"><td className="px-5 py-4"><p className="text-sm font-bold text-text">{campaign.name}</p><p className="text-xs text-text-muted">{campaign.offer}</p></td><td className="px-5 py-4"><Badge variant={typeVariant[campaign.type]}>{campaign.type}</Badge></td><td className="px-5 py-4 text-sm text-text-muted">{campaign.segment}</td><td className="px-5 py-4"><Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge></td><td className="px-5 py-4 text-sm font-bold text-text">{campaign.sent}</td><td className="px-5 py-4 text-sm font-bold text-text">{campaign.redemptions}</td><td className="px-5 py-4 text-sm text-text-muted">{campaign.startDate} – {campaign.endDate}</td><td className="px-5 py-4"><div className="flex gap-2"><button type="button" onClick={() => setModal({ mode: 'view', campaign })} className="flex size-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-primary" aria-label={`View ${campaign.name}`}><Eye className="size-4" /></button><button type="button" onClick={() => deleteCampaign(campaign.id)} className="flex size-8 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-background hover:text-danger" aria-label={`Delete ${campaign.name}`}><Trash2 className="size-4" /></button></div></td></tr>)}
          {!filtered.length && <tr><td colSpan="8" className="px-5 py-14 text-center"><CalendarClock className="mx-auto size-8 text-text-muted/50" /><p className="mt-3 text-sm font-bold text-text">No campaigns found</p><p className="mt-1 text-xs text-text-muted">Try changing or clearing the filters.</p></td></tr>}
        </tbody></table></div>
      </section>

      {modal ? <CampaignModal mode={modal.mode} campaign={modal.campaign ?? null} onClose={() => setModal(null)} onSave={addCampaign} /> : null}
    </div>
  )
}

export default Marketing
