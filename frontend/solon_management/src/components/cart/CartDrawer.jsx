import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import Button from '../common/Button.jsx'
import { useCart } from '../../context/useCart.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { cn } from '../../lib/cn.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatPrice(price) {
  return INR_FORMATTER.format(price)
}

function DrawerItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const isAtStockLimit = item.quantity >= item.stock

  return (
    <article className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-[#eadfd6] bg-white p-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-[#f4ece5] p-2">
        <img src={item.image?.src} alt="" className="size-full object-contain" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-extrabold uppercase tracking-[0.12em] text-[#9b5639]">{item.brand}</p>
        <p className="mt-1 line-clamp-2 text-sm font-extrabold text-[#241915]">{item.name}</p>
        <p className="mt-1 text-xs font-bold text-[#7b6b62]">{item.variant.name}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-[#eadfd6] bg-[#fffaf7]">
            <button
              type="button"
              aria-label={`Decrease ${item.name} quantity`}
              className="flex size-8 items-center justify-center disabled:opacity-40"
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <span className="min-w-7 text-center text-xs font-extrabold">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase ${item.name} quantity`}
              className="flex size-8 items-center justify-center disabled:opacity-40"
              disabled={isAtStockLimit}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm font-extrabold text-[#241915]">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#9b5639]"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Remove
        </button>
      </div>
    </article>
  )
}

function CartDrawer({ isOpen, onClose }) {
  const { items, totals } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#241915]/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-[1.75rem] bg-[#fffaf7] shadow-2xl',
              'sm:inset-y-0 sm:right-0 sm:left-auto sm:h-screen sm:max-h-none sm:w-[27rem] sm:rounded-none',
            )}
          >
            <div className="flex items-center justify-between border-b border-[#eadfd6] px-5 py-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Shopping Bag</p>
                <h2 id="cart-drawer-title" className="text-xl font-extrabold text-[#241915]">Your Cart</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart drawer"
                className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] bg-white text-[#241915]"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="premium-scrollbar flex-1 overflow-y-auto p-5">
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item) => (
                    <DrawerItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
                    <ShoppingBag className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-[#241915]">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#6f5f57]">Explore professional salon products selected by our experts.</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#eadfd6] bg-white p-5">
              <div className="mb-4 flex items-center justify-between text-sm font-bold text-[#6f5f57]">
                <span>Subtotal</span>
                <span className="text-lg font-extrabold text-[#241915]">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="grid gap-2">
                <Link to={ROUTE_PATHS.cart} onClick={onClose} className={buttonClasses({ className: 'w-full bg-[#241915] hover:bg-[#3a2b24]' })}>
                  View Cart
                </Link>
                <Button type="button" variant="accent" className="w-full bg-[#d7b48c] text-[#241915] hover:bg-[#e8c79e]" disabled={!items.length}>
                  Checkout
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
