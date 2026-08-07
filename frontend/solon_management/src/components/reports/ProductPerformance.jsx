import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownRight, Boxes, PackageX, TriangleAlert, Zap, Clock3 } from 'lucide-react'
import ReportCard from './ReportCard.jsx'
import Badge from '../common/Badge.jsx'
import { cn } from '../../lib/cn.js'

const statusVariant = {
  Healthy: 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
  'Slow Moving': 'outline',
}

function formatCurrency(value) {
  return `₹${Number(value ?? 0).toLocaleString('en-IN')}`
}

function ProductPerformance({ products, inventory, crossSell }) {
  if (!inventory) return null
  const productItems = Array.isArray(products) ? products : []
  const inventoryItems = Array.isArray(inventory.items) ? inventory.items : []
  const crossSellItems = Array.isArray(crossSell) ? crossSell : []
  const inventoryStats = [
    { label: 'Total Inventory Value', value: formatCurrency(inventory.totalValue ?? 0), icon: Boxes, tone: 'bg-primary/10 text-primary' },
    { label: 'Low Stock Items', value: inventory.lowStock ?? 0, icon: TriangleAlert, tone: 'bg-warning/10 text-warning' },
    { label: 'Out of Stock', value: inventory.outOfStock ?? 0, icon: PackageX, tone: 'bg-danger/10 text-danger' },
    { label: 'Fast Moving', value: inventory.fastMoving ?? 0, icon: Zap, tone: 'bg-success/10 text-success' },
    { label: 'Slow Moving', value: inventory.slowMoving ?? 0, icon: Clock3, tone: 'bg-info/10 text-info' },
  ]

  return (
    <div className="space-y-4">
      <ReportCard
        title="Product Performance"
        subtitle="Units sold, revenue and growth by product"
        tooltip="Growth compares the current period to the previous period. Stock reflects current inventory levels."
      >
        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Units Sold</th>
                <th className="px-3 py-3">Revenue</th>
                <th className="px-3 py-3">Growth</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {productItems.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-bold text-text">{product.name}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{product.unitsSold}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(product.revenue)}</td>
                  <td className="px-3 py-4">
                    <span className={cn('inline-flex items-center gap-1 text-xs font-bold', product.growth >= 0 ? 'text-success' : 'text-danger')}>
                      {product.growth >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : <ArrowDownRight className="size-3.5" aria-hidden="true" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-text-muted">{product.stock}</td>
                  <td className="px-3 py-4">
                    <Badge variant={statusVariant[product.status] ?? 'outline'}>{product.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportCard
        title="Inventory Report"
        subtitle="Stock health and movement"
        tooltip="Fast moving = high units sold. Slow moving = low units sold relative to stock."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {inventoryStats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-xl border border-border bg-background p-4">
              <span className={cn('flex size-9 items-center justify-center rounded-lg', tone)}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-3 text-lg font-extrabold text-text">{value}</p>
              <p className="mt-0.5 text-xs text-text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto premium-scrollbar">
          <table className="w-full min-w-[500px] text-left">
            <thead>
              <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-text-muted">
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">Stock</th>
                <th className="px-3 py-3">Sold</th>
                <th className="px-3 py-3">Revenue</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-bold text-text">{item.name}</td>
                  <td className="px-3 py-4 text-sm text-text-muted">{item.stock}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{item.sold}</td>
                  <td className="px-3 py-4 text-sm font-bold text-text">{formatCurrency(item.revenue)}</td>
                  <td className="px-3 py-4">
                    <Badge variant={statusVariant[item.status] ?? 'outline'}>{item.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportCard>

      <ReportCard
        title="Service + Product Cross-sell"
        subtitle="Customers who book these services are more likely to buy these products"
        tooltip="Cross-sell likelihood is calculated from historical booking and purchase data."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {crossSellItems.map((item) => (
            <div key={item.service} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-bold text-text">{item.service}</p>
              <p className="mt-1 text-xs text-text-muted">→ Recommended product</p>
              <p className="mt-2 text-sm font-bold text-primary">{item.product}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.likelihood}%` }} />
                </div>
                <span className="text-xs font-bold text-text">{item.likelihood}%</span>
              </div>
            </div>
          ))}
        </div>
      </ReportCard>
    </div>
  )
}

export default ProductPerformance