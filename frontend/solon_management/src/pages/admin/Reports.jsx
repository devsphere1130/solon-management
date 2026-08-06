import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, TrendingUp, TriangleAlert } from 'lucide-react'
import ReportsHeader from '../../components/reports/ReportsHeader.jsx'
import KPIOverview from '../../components/reports/KPIOverview.jsx'
import RevenueReport from '../../components/reports/RevenueReport.jsx'
import ServicePerformance from '../../components/reports/ServicePerformance.jsx'
import AppointmentReport from '../../components/reports/AppointmentReport.jsx'
import StaffPerformance from '../../components/reports/StaffPerformance.jsx'
import CustomerInsights from '../../components/reports/CustomerInsights.jsx'
import ProductPerformance from '../../components/reports/ProductPerformance.jsx'
import { PaymentReport, DiscountReport, CancellationReport } from '../../components/reports/PaymentReport.jsx'
import ProfitReport from '../../components/reports/ProfitReport.jsx'
import BusinessInsights from '../../components/reports/BusinessInsights.jsx'
import {
  ReportTabs,
  ReportDetailDrawer,
  ExportModal,
  ReportEmptyState,
  ReportErrorState,
  ReportSkeleton,
  ReportFilters,
} from '../../components/reports/ReportUtilities.jsx'
import ReportCard from '../../components/reports/ReportCard.jsx'
import Badge from '../../components/common/Badge.jsx'
import {
  getReportsOverview,
  getRevenueReport,
  getServicePerformance,
  getAppointmentReport,
  getPeakHoursReport,
  getStaffPerformance,
  getCustomerInsights,
  getProductPerformance,
  getInventoryReport,
  getPaymentReport,
  getDiscountReport,
  getCancellationReport,
  getProfitReport,
  getExpenseReport,
  getBusinessInsights,
  getCrossSellInsights,
} from '../../services/reportsService.js'

const reportTabs = ['Overview', 'Revenue', 'Appointments', 'Services', 'Staff', 'Customers', 'Products', 'Payments', 'Expenses']

const emptyFilters = { location: '', staff: '', category: '', customerType: '', paymentMethod: '' }

function DashboardSummary({ summary }) {
  if (!summary) return null
  const stats = [
    { label: 'Revenue', value: summary.revenue ?? '—' },
    { label: 'Appointments', value: summary.appointments ?? '—' },
    { label: 'New Customers', value: summary.newCustomers ?? '—' },
    { label: 'Returning', value: summary.returningCustomers ?? '—' },
    { label: 'Retention', value: summary.retention ?? '—' },
    { label: 'Staff Utilization', value: summary.staffUtilization ?? '—' },
  ]
  const goingWell = Array.isArray(summary.goingWell) ? summary.goingWell : []
  const needsAttention = Array.isArray(summary.needsAttention) ? summary.needsAttention : []

  return (
    <ReportCard
      title="Your Salon This Month"
      subtitle="A quick health check of your entire business"
      tooltip="Snapshot of the current month. Update your date range above to see a different period."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xl font-extrabold text-text">{stat.value}</p>
            <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-success/20 bg-success/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-success">
            <TrendingUp className="size-4" aria-hidden="true" />
            What's going well
          </p>
          <ul className="mt-3 space-y-2">
            {goingWell.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-xs text-text">
                <CheckCircle2 className="size-3.5 shrink-0 text-success" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-warning">
            <TriangleAlert className="size-4" aria-hidden="true" />
            What needs attention
          </p>
          <ul className="mt-3 space-y-2">
            {needsAttention.map((item) => (
              <li key={item.text} className="flex items-center gap-2 text-xs text-text">
                <TriangleAlert className="size-3.5 shrink-0 text-warning" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ReportCard>
  )
}

function Reports() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [dateRange, setDateRange] = useState('this-month')
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasData] = useState(true)

  const [overview, setOverview] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [services, setServices] = useState([])
  const [appointments, setAppointments] = useState(null)
  const [peakHours, setPeakHours] = useState(null)
  const [staff, setStaff] = useState([])
  const [customers, setCustomers] = useState(null)
  const [products, setProducts] = useState([])
  const [inventory, setInventory] = useState(null)
  const [payments, setPayments] = useState(null)
  const [discounts, setDiscounts] = useState(null)
  const [losses, setLosses] = useState(null)
  const [profit, setProfit] = useState(null)
  const [expenses, setExpenses] = useState(null)
  const [insights, setInsights] = useState([])
  const [crossSell, setCrossSell] = useState([])

  const [detail, setDetail] = useState(null)
  const [exportModal, setExportModal] = useState(null)

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const requestFilters = { date_from: dateRange, ...filters }
      const [
        overviewData,
        revenueData,
        servicesData,
        appointmentsData,
        peakHoursData,
        staffData,
        customersData,
        productsData,
        inventoryData,
        paymentsData,
        discountsData,
        lossesData,
        profitData,
        expensesData,
        insightsData,
        crossSellData,
      ] = await Promise.all([
        getReportsOverview(requestFilters),
        getRevenueReport(requestFilters),
        getServicePerformance(requestFilters),
        getAppointmentReport(requestFilters),
        getPeakHoursReport(requestFilters),
        getStaffPerformance(requestFilters),
        getCustomerInsights(requestFilters),
        getProductPerformance(requestFilters),
        getInventoryReport(requestFilters),
        getPaymentReport(requestFilters),
        getDiscountReport(requestFilters),
        getCancellationReport(requestFilters),
        getProfitReport(requestFilters),
        getExpenseReport(requestFilters),
        getBusinessInsights(requestFilters),
        getCrossSellInsights(requestFilters),
      ])

      setOverview(overviewData)
      setRevenue(revenueData)
      setServices(servicesData)
      setAppointments(appointmentsData)
      setPeakHours(peakHoursData)
      setStaff(staffData)
      setCustomers(customersData)
      setProducts(productsData)
      setInventory(inventoryData)
      setPayments(paymentsData)
      setDiscounts(discountsData)
      setLosses(lossesData)
      setProfit(profitData)
      setExpenses(expensesData)
      setInsights(insightsData)
      setCrossSell(crossSellData)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [dateRange, filters])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const handleExport = (format) => {
    // API-ready: this will call export service when backend is available.
    // For now, simulate the export lifecycle so the UI is realistic.
    setExportModal(format)
    setTimeout(() => setExportModal(null), 2600)
  }

  const handlePrint = () => {
    // API-ready: print-friendly view will be wired here.
    window.print()
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <ReportsHeader dateRange={dateRange} onDateRangeChange={setDateRange} onExport={handleExport} onPrint={handlePrint} />
        <ReportSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ReportsHeader dateRange={dateRange} onDateRangeChange={setDateRange} onExport={handleExport} onPrint={handlePrint} />
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <ReportErrorState onRetry={loadReports} />
        </div>
      </div>
    )
  }

  if (!hasData || !overview || !revenue || !appointments) {
    return (
      <div className="space-y-6">
        <ReportsHeader dateRange={dateRange} onDateRangeChange={setDateRange} onExport={handleExport} onPrint={handlePrint} />
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <ReportEmptyState />
        </div>
      </div>
    )
  }

  const openServiceDetail = (service) => {
    setDetail({
      title: service.name,
      subtitle: service.category,
      type: 'service',
      data: service,
    })
  }

  const openStaffDetail = (member) => {
    setDetail({
      title: member.name,
      subtitle: member.department,
      type: 'staff',
      data: member,
    })
  }

  return (
    <div className="space-y-6">
      <ReportsHeader dateRange={dateRange} onDateRangeChange={setDateRange} onExport={handleExport} onPrint={handlePrint} />

      {loading ? (
        <ReportSkeleton />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <DashboardSummary summary={overview.summary} />
          <KPIOverview kpis={overview.kpis} secondaryKpis={overview.secondaryKpis} />
          <ReportFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
          <BusinessInsights insights={insights} />
          <ReportTabs tabs={reportTabs} active={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
              {activeTab === 'Overview' && (
                <div className="space-y-4">
                  <RevenueReport data={revenue} />
                  <AppointmentReport data={appointments} peakHours={peakHours} />
                  <ServicePerformance services={services} onSelectService={openServiceDetail} />
                </div>
              )}

              {activeTab === 'Revenue' && (
                <div className="space-y-4">
                  <RevenueReport data={revenue} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <DiscountReport discounts={discounts} />
                    <CancellationReport losses={losses} />
                  </div>
                </div>
              )}

              {activeTab === 'Appointments' && (
                <AppointmentReport data={appointments} peakHours={peakHours} />
              )}

              {activeTab === 'Services' && (
                <ServicePerformance services={services} onSelectService={openServiceDetail} />
              )}

              {activeTab === 'Staff' && (
                <StaffPerformance staff={staff} onSelectStaff={openStaffDetail} />
              )}

              {activeTab === 'Customers' && (
                <CustomerInsights data={customers} />
              )}

              {activeTab === 'Products' && (
                <ProductPerformance products={products} inventory={inventory} crossSell={crossSell} />
              )}

              {activeTab === 'Payments' && (
                <div className="space-y-4">
                  <PaymentReport payments={payments} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <DiscountReport discounts={discounts} />
                    <CancellationReport losses={losses} />
                  </div>
                </div>
              )}

              {activeTab === 'Expenses' && (
                <ProfitReport profit={profit} expenses={expenses} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Detail drawer */}
      <ReportDetailDrawer
        open={Boolean(detail)}
        title={detail?.title ?? ''}
        subtitle={detail?.subtitle ?? ''}
        onClose={() => setDetail(null)}
      >
        {detail?.type === 'service' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">{detail.data.category}</Badge>
              <span className="text-xs text-text-muted">{detail.data.gender}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Total Bookings', detail.data.bookings],
                ['Revenue', `₹${detail.data.revenue.toLocaleString('en-IN')}`],
                ['Average Ticket', `₹${detail.data.avgPrice.toLocaleString('en-IN')}`],
                ['Cancellation Rate', `${detail.data.cancellationRate}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border p-4">
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="mt-1 text-sm font-bold text-text">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-bold text-primary">Growth</p>
              <p className="mt-1 text-2xl font-extrabold text-primary">{detail.data.growth >= 0 ? '+' : ''}{detail.data.growth}%</p>
              <p className="mt-1 text-xs text-text-muted">vs previous period</p>
            </div>
            <p className="text-xs leading-5 text-text-muted">
              Top staff for this service: <span className="font-bold text-text">Ritu Menon</span>
            </p>
          </div>
        )}

        {detail?.type === 'staff' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">{detail.data.department}</Badge>
              <span className="text-xs text-text-muted">{detail.data.completed}/{detail.data.appointments} completed</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Appointments', detail.data.appointments],
                ['Revenue', `₹${detail.data.revenue.toLocaleString('en-IN')}`],
                ['Average Ticket', `₹${detail.data.avgTicket.toLocaleString('en-IN')}`],
                ['Rating', detail.data.rating],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border p-4">
                  <p className="text-xs text-text-muted">{label}</p>
                  <p className="mt-1 text-sm font-bold text-text">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Utilization</p>
                <p className="text-lg font-extrabold text-text">{detail.data.utilization}%</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full rounded-full bg-primary" style={{ width: `${detail.data.utilization}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>Booked: {detail.data.bookedHours} hrs</span>
                <span>Available: {detail.data.availableHours} hrs</span>
              </div>
            </div>
          </div>
        )}
      </ReportDetailDrawer>

      {/* Export modal */}
      <ExportModal open={Boolean(exportModal)} format={exportModal ?? ''} onClose={() => setExportModal(null)} />
    </div>
  )
}

export default Reports