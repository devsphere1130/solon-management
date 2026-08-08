import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Boxes, CirclePlus, ImagePlus, IndianRupee, PackageCheck, PackageX, Pencil, Search, TriangleAlert, Upload, X } from 'lucide-react'
import { products } from '../../data/products.js'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'

const seedInventory = products.slice(0, 8).map((product, index) => ({
  id: product.id,
  sku: `SLN-${String(index + 101).padStart(4, '0')}`,
  name: product.name,
  brand: product.brand,
  category: product.category,
  image: product.images[0]?.src,
  supplier: ['Glow Distribution', 'Beauty Trade India', 'Aurelia Wholesale'][index % 3],
  purchasePrice: Math.round(product.price * 0.62),
  sellingPrice: product.price,
  quantity: [18, 4, 0, 12, 7, 2, 24, 9][index],
  minimumStock: 5,
  unit: index % 2 ? 'Bottles' : 'Pieces',
  manufacturingDate: '2026-01-15',
  expiryDate: '2027-12-31',
  lastUpdated: '04 Aug 2026, 10:30 AM',
  notes: product.description,
}))

const emptyItem = { sku: '', name: '', brand: '', category: 'Hair Care', image: '', supplier: '', purchasePrice: '', sellingPrice: '', quantity: '', minimumStock: '5', unit: 'Pieces', manufacturingDate: '', expiryDate: '', notes: '' }

function stockStatus(item) {
  if (Number(item.quantity) === 0) return 'Out of Stock'
  if (Number(item.quantity) <= Number(item.minimumStock)) return 'Low Stock'
  return 'Available'
}

const statusVariant = { Available: 'success', 'Low Stock': 'warning', 'Out of Stock': 'danger' }

function Field({ label, className = '', ...props }) {
  return <label className={className}><span className="mb-1.5 block text-sm font-semibold text-text">{label}</span><input className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text outline-none focus:border-primary" {...props} /></label>
}

function ItemFormModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item ? { ...item } : emptyItem)
  const imageInputRef = useRef(null)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => { event.preventDefault(); onSave(form) }
  const selectImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('image', reader.result)
    reader.readAsDataURL(file)
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4" onMouseDown={onClose}><div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex justify-between border-b border-border px-6 py-5"><div><h2 className="text-lg font-extrabold text-text">{item ? 'Edit inventory item' : 'Add inventory item'}</h2><p className="mt-1 text-sm text-text-muted">Product, pricing, stock and expiry information.</p></div><button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full border border-border text-text-muted"><X className="size-4" /></button></div><form onSubmit={submit} className="max-h-[76vh] overflow-y-auto p-6 premium-scrollbar"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="SKU / Product ID" required value={form.sku} onChange={(e) => update('sku', e.target.value)} /><Field label="Product name" required value={form.name} onChange={(e) => update('name', e.target.value)} /><Field label="Brand" value={form.brand} onChange={(e) => update('brand', e.target.value)} /><Field label="Category" required value={form.category} onChange={(e) => update('category', e.target.value)} /><Field label="Supplier" value={form.supplier} onChange={(e) => update('supplier', e.target.value)} /><Field label="Purchase price" required type="number" min="0" value={form.purchasePrice} onChange={(e) => update('purchasePrice', e.target.value)} /><Field label="Selling price" required type="number" min="0" value={form.sellingPrice} onChange={(e) => update('sellingPrice', e.target.value)} /><Field label="Current quantity" required type="number" min="0" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} /><Field label="Minimum stock" required type="number" min="0" value={form.minimumStock} onChange={(e) => update('minimumStock', e.target.value)} /><label><span className="mb-1.5 block text-sm font-semibold text-text">Unit</span><select value={form.unit} onChange={(e) => update('unit', e.target.value)} className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary"><option>Pieces</option><option>Bottles</option><option>Boxes</option><option>Grams</option><option>Millilitres</option></select></label><Field label="Manufacturing date" type="date" value={form.manufacturingDate} onChange={(e) => update('manufacturingDate', e.target.value)} /><Field label="Expiry date" type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} /><Field label="Notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="sm:col-span-2" /></div><div className="mt-5"><span className="mb-1.5 block text-sm font-semibold text-text">Product image</span><input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} className="hidden" /><button type="button" onClick={() => imageInputRef.current?.click()} className="flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-background p-4 text-left transition-colors hover:border-primary/40">{form.image ? <img src={form.image} alt="Product preview" className="size-20 rounded-xl object-cover" /> : <span className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ImagePlus className="size-6" /></span>}<span><span className="flex items-center gap-2 text-sm font-bold text-text"><Upload className="size-4 text-primary" />{form.image ? 'Replace product image' : 'Upload product image'}</span><span className="mt-1 block text-xs text-text-muted">PNG, JPG or WebP · stored in browser memory only</span></span></button></div><div className="mt-6 flex justify-end gap-3 border-t border-border pt-5"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{item ? 'Save changes' : 'Add item'}</Button></div></form></div></div>
}

function StockModal({ item, type, onClose, onApply }) {
  const [amount, setAmount] = useState('1')
  const [reason, setReason] = useState('')
  const isOut = type === 'out'
  const submit = (event) => { event.preventDefault(); const value = Number(amount); if (value > 0 && (!isOut || value <= item.quantity)) onApply(value, reason) }
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-secondary/45 p-4" onMouseDown={onClose}><form onSubmit={submit} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"><div className="flex justify-between"><div><h2 className="text-lg font-extrabold text-text">Stock {isOut ? 'Out' : 'In'}</h2><p className="mt-1 text-sm text-text-muted">{item.name} · Available: {item.quantity}</p></div><button type="button" onClick={onClose}><X className="size-5 text-text-muted" /></button></div><div className="mt-5 space-y-4"><Field label="Quantity" type="number" min="1" max={isOut ? item.quantity : undefined} required value={amount} onChange={(e) => setAmount(e.target.value)} /><Field label="Reason / notes" required value={reason} onChange={(e) => setReason(e.target.value)} placeholder={isOut ? 'Used, sold, damaged…' : 'Purchase or restock'} /></div><Button type="submit" className="mt-5 w-full">Update stock</Button></form></div>
}

function DetailsModal({ item, onClose, onEdit, onStock }) {
  const status = stockStatus(item)
  const details = [['SKU', item.sku], ['Brand', item.brand], ['Category', item.category], ['Supplier', item.supplier], ['Purchase price', `₹${Number(item.purchasePrice).toLocaleString('en-IN')}`], ['Selling price', `₹${Number(item.sellingPrice).toLocaleString('en-IN')}`], ['Current stock', `${item.quantity} ${item.unit}`], ['Minimum stock', `${item.minimumStock} ${item.unit}`], ['Manufactured', item.manufacturingDate], ['Expiry', item.expiryDate], ['Last updated', item.lastUpdated]]
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/45 p-4" onMouseDown={onClose}><motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} onMouseDown={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"><div className="flex justify-between border-b border-border px-6 py-5"><div><h2 className="text-lg font-extrabold text-text">Inventory details</h2><p className="mt-1 text-sm text-text-muted">Complete product and stock information.</p></div><button type="button" onClick={onClose}><X className="size-5 text-text-muted" /></button></div><div className="max-h-[75vh] overflow-y-auto p-6 premium-scrollbar"><div className="flex flex-col gap-5 rounded-2xl bg-background p-5 sm:flex-row"><img src={item.image} alt="" className="h-40 w-full rounded-2xl object-cover sm:w-44" /><div className="flex-1"><Badge variant={statusVariant[status]}>{status}</Badge><h3 className="mt-3 text-xl font-extrabold text-text">{item.name}</h3><p className="mt-1 text-sm text-text-muted">{item.brand} · {item.category}</p><p className="mt-3 text-sm leading-6 text-text-muted">{item.notes}</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{details.map(([label, value]) => <div key={label} className="rounded-2xl border border-border p-4"><p className="text-xs text-text-muted">{label}</p><p className="mt-1 text-sm font-bold text-text">{value || 'Not provided'}</p></div>)}</div><div className="mt-6 flex flex-wrap gap-3"><Button type="button" onClick={() => onStock('in')}>Stock In</Button><Button type="button" variant="outline" onClick={() => onStock('out')}>Stock Out</Button><Button type="button" variant="outline" onClick={onEdit}><Pencil className="size-4" />Edit item</Button></div></div></motion.div></div>
}

function Inventory() {
  const [items, setItems] = useState(seedInventory)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [modal, setModal] = useState(null)
  const modalType = modal?.type ?? null
  const modalItem = modal?.item ?? null
  const modalStockType = modal?.stockType ?? null
  const categories = [...new Set(items.map((item) => item.category))]
  const filtered = useMemo(() => { const q = search.toLowerCase().trim(); return items.filter((item) => (!q || [item.name, item.sku, item.category, item.supplier].some((value) => value.toLowerCase().includes(q))) && (!category || item.category === category) && (!status || stockStatus(item) === status)) }, [items, search, category, status])
  const totalValue = items.reduce((sum, item) => sum + Number(item.purchasePrice) * Number(item.quantity), 0)
  const summary = [{ label: 'Total products', value: items.length, icon: Boxes, tone: 'bg-primary/10 text-primary' }, { label: 'Available', value: items.filter((i) => stockStatus(i) === 'Available').length, icon: PackageCheck, tone: 'bg-success/10 text-success' }, { label: 'Low stock', value: items.filter((i) => stockStatus(i) === 'Low Stock').length, icon: TriangleAlert, tone: 'bg-warning/10 text-warning' }, { label: 'Out of stock', value: items.filter((i) => stockStatus(i) === 'Out of Stock').length, icon: PackageX, tone: 'bg-danger/10 text-danger' }, { label: 'Inventory value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: IndianRupee, tone: 'bg-info/10 text-info' }]
  const saveItem = (form) => { const editing = modal?.item; const normalized = { ...form, quantity: Number(form.quantity), minimumStock: Number(form.minimumStock), purchasePrice: Number(form.purchasePrice), sellingPrice: Number(form.sellingPrice), lastUpdated: 'Just now' }; setItems((current) => editing ? current.map((item) => item.id === editing.id ? { ...item, ...normalized } : item) : [...current, { ...normalized, id: `item-${Date.now()}` }]); setModal(null) }
  const applyStock = (amount, reason) => { if (!modalItem) return; const change = modalStockType === 'out' ? -amount : amount; const updated = { ...modalItem, quantity: modalItem.quantity + change, lastUpdated: `Just now · ${reason}` }; setItems((current) => current.map((item) => item.id === modalItem.id ? updated : item)); setModal({ type: 'details', item: updated }) }

  return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-extrabold tracking-tight text-text">Inventory</h1><p className="mt-1 text-sm text-text-muted">Track salon products, stock levels and expiry information.</p></div><Button type="button" onClick={() => setModal({ type: 'form' })}><CirclePlus className="size-4" />Add item</Button></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">{summary.map(({ label, value, icon: Icon, tone }) => <article key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center justify-between gap-2"><div className="min-w-0"><p className="text-xs font-semibold text-text-muted">{label}</p><p className="mt-2 truncate text-xl font-extrabold text-text">{value}</p></div><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span></div></article>)}</div>
    <section className="rounded-2xl border border-border bg-card p-4 shadow-soft"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_200px_180px_auto]"><div className="relative"><Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search product, SKU or supplier" className="h-11 w-full rounded-xl border border-border bg-surface pr-4 pl-10 text-sm outline-none focus:border-primary" /></div><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold"><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl border border-border bg-surface px-4 text-sm font-semibold"><option value="">All statuses</option><option>Available</option><option>Low Stock</option><option>Out of Stock</option></select><Button type="button" variant="outline" onClick={() => { setSearch(''); setCategory(''); setStatus('') }}>Clear filters</Button></div></section>
    <section><div className="mb-4"><h2 className="text-sm font-bold text-text">Products in inventory</h2><p className="mt-1 text-xs text-text-muted">{filtered.length} matching items · Select a card for full information</p></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filtered.map((item) => { const itemStatus = stockStatus(item); return <motion.button key={item.id} type="button" whileHover={{ y: -4 }} onClick={() => setModal({ type: 'details', item })} className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft"><div className="relative h-44 bg-background"><img src={item.image} alt={item.name} className="size-full object-cover" /><Badge variant={statusVariant[itemStatus]} className="absolute top-3 right-3 bg-white/90">{itemStatus}</Badge></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-primary">{item.sku}</p><h3 className="mt-2 truncate text-sm font-extrabold text-text">{item.name}</h3><p className="mt-1 text-xs text-text-muted">{item.brand} · {item.category}</p><div className="mt-4 flex items-end justify-between border-t border-border pt-4"><div><p className="text-xs text-text-muted">Current stock</p><p className="mt-1 text-lg font-extrabold text-text">{item.quantity} <span className="text-xs font-semibold text-text-muted">{item.unit}</span></p></div><div className="text-right"><p className="text-xs text-text-muted">Selling price</p><p className="mt-1 text-sm font-bold text-text">₹{item.sellingPrice.toLocaleString('en-IN')}</p></div></div></div></motion.button> })}{!filtered.length && <div className="col-span-full rounded-2xl border border-dashed border-border bg-card py-14 text-center text-sm font-semibold text-text-muted">No inventory products match these filters.</div>}</div></section>
    <AnimatePresence>{modalType === 'details' && modalItem ? <DetailsModal item={modalItem} onClose={() => setModal(null)} onEdit={() => setModal({ type: 'form', item: modalItem })} onStock={(stockType) => setModal({ type: 'stock', item: modalItem, stockType })} /> : null}{modalType === 'form' ? <ItemFormModal item={modalItem} onClose={() => setModal(null)} onSave={saveItem} /> : null}{modalType === 'stock' && modalItem ? <StockModal item={modalItem} type={modalStockType} onClose={() => setModal({ type: 'details', item: modalItem })} onApply={applyStock} /> : null}</AnimatePresence>
  </div>
}

export default Inventory
