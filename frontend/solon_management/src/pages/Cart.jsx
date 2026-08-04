import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowRight,
  Heart,
  Image as ImageIcon,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { useProductCatalog } from '../context/useProductCatalog.js'
import { productBundles } from '../data/products.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatPrice(price) {
  return INR_FORMATTER.format(Math.max(0, Math.round(price)))
}

function ImageWithFallback({ src, alt, className }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#f2e8df] text-[#8a7568]', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />
}

function CheckoutProgress() {
  const steps = ['Cart', 'Delivery', 'Payment', 'Complete']

  return (
    <div className="mt-8 rounded-3xl border border-[#eadfd6] bg-white p-4 shadow-soft">
      <ol className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <li key={step} className="relative flex flex-col items-center gap-2 text-center">
            {index < steps.length - 1 && <span className="absolute left-1/2 top-4 h-px w-full bg-[#eadfd6]" aria-hidden="true" />}
            <span
              className={cn(
                'relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-extrabold',
                index === 0 ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] bg-white text-[#9a8b82]',
              )}
            >
              {index + 1}
            </span>
            <span className={cn('text-xs font-extrabold', index === 0 ? 'text-[#241915]' : 'text-[#9a8b82]')}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CartHeader({ itemCount }) {
  return (
    <section className="border-b border-[#eadfd6] bg-[#fffaf7] py-14 sm:py-16">
      <Container>
        <Badge className="bg-[#fff1e8] text-[#9b5639]">Your Shopping Bag</Badge>
        <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-[#241915] sm:text-5xl">Review your salon products</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f5f57]">
              Check quantities, choose delivery or salon pickup, apply a promo code, and complete your purchase confidently.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Items</p>
            <p className="mt-1 text-3xl font-extrabold text-[#241915]">{itemCount}</p>
          </div>
        </div>
        <CheckoutProgress />
      </Container>
    </section>
  )
}

function QuantitySelector({ item }) {
  const { updateQuantity } = useCart()
  const atMax = item.quantity >= item.stock

  return (
    <div className="inline-flex items-center rounded-full border border-[#eadfd6] bg-[#fffaf7]">
      <button
        type="button"
        aria-label={`Decrease ${item.name} quantity`}
        disabled={item.quantity <= 1}
        className="flex size-10 items-center justify-center disabled:opacity-40"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <motion.span key={item.quantity} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="min-w-9 text-center text-sm font-extrabold">
        {item.quantity}
      </motion.span>
      <button
        type="button"
        aria-label={`Increase ${item.name} quantity`}
        disabled={atMax}
        className="flex size-10 items-center justify-center disabled:opacity-40"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function CartItem({ item, product }) {
  const { removeItem, moveToWishlist } = useCart()
  const { addItem: addWishlistItem } = useWishlist()
  const currentPrice = product?.price
  const priceChanged = currentPrice && currentPrice !== item.unitPrice
  const limitedStock = item.stock <= 3
  const isOutOfStock = item.stock <= 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="grid gap-4 rounded-[1.5rem] border border-[#eadfd6] bg-white p-4 shadow-soft sm:grid-cols-[8rem_1fr] sm:p-5"
    >
      <div className="aspect-square overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#fbf4ee,#ece1d8)] p-4">
        <ImageWithFallback src={item.image?.src} alt={item.image?.alt ?? item.name} className="size-full object-contain" />
      </div>

      <div className="min-w-0">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9b5639]">{item.brand}</p>
            <Link to={`${ROUTE_PATHS.products}/${item.productId}`} className="mt-1 block text-xl font-extrabold leading-tight text-[#241915] hover:text-[#9b5639]">
              {item.name}
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.badge && <Badge className="bg-[#fff1e8] text-[#9b5639]">{item.badge}</Badge>}
              <span className="rounded-full bg-[#f5eee8] px-3 py-1 text-xs font-bold text-[#6f5f57]">{item.variant.name}</span>
              {limitedStock && !isOutOfStock && <span className="rounded-full bg-[#fff6df] px-3 py-1 text-xs font-bold text-[#8a5b16]">Only {item.stock} left</span>}
              {isOutOfStock && <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">Out of stock</span>}
            </div>
            {priceChanged && <p className="mt-3 text-xs font-bold text-[#8a5b16]">Price changed since added. Review before checkout.</p>}
          </div>
          <div className="text-left lg:text-right">
            <p className="text-xl font-extrabold text-[#241915]">{formatPrice(item.unitPrice * item.quantity)}</p>
            <p className="text-sm font-bold text-[#9a8b82] line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <QuantitySelector item={item} />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (product) addWishlistItem(product)
                moveToWishlist(item.id)
              }}
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#6f5f57] hover:text-[#9b5639]"
            >
              <Heart className="size-4" aria-hidden="true" />
              Move to Wishlist
            </button>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#9b5639]"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function CouponBox({ subtotal, coupon, onApply, onClear }) {
  const [isOpen, setIsOpen] = useState(Boolean(coupon.code))
  const [code, setCode] = useState(coupon.code ?? '')
  const [message, setMessage] = useState('')

  function applyCoupon() {
    const normalized = code.trim().toUpperCase()
    if (normalized === 'SAVE20' && subtotal > 0) {
      onApply({ code: normalized, amount: Math.min(200, Math.round(subtotal * 0.2)) })
      setMessage('SAVE20 applied. You saved on this order.')
      return
    }
    onApply(null)
    setMessage('This coupon is invalid or expired.')
  }

  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-4">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setIsOpen((value) => !value)}>
        <span>
          <span className="block text-sm font-extrabold text-[#241915]">Have a promo code?</span>
          <span className="text-xs text-[#7b6b62]">Try salon promo codes at checkout.</span>
        </span>
        <ArrowRight className={cn('size-4 transition-transform', isOpen && 'rotate-90')} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex gap-2">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="SAVE20"
                className="h-11 min-w-0 flex-1 rounded-full border border-[#eadfd6] bg-[#fffaf7] px-4 text-sm font-bold outline-none focus:border-[#9b5639]"
              />
              <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            {(message || coupon.code) && (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#fffaf7] px-3 py-2 text-xs font-bold text-[#6f5f57]">
                <span>{coupon.code ? `${coupon.code} applied: ${formatPrice(coupon.amount)} saved` : message}</span>
                {coupon.code && (
                  <button type="button" className="text-[#9b5639]" onClick={onClear}>
                    Remove
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DeliveryOptions({ fulfillment, onChange }) {
  return (
    <div className="rounded-2xl border border-[#eadfd6] bg-white p-4">
      <h3 className="text-sm font-extrabold text-[#241915]">Delivery / Salon Pickup</h3>
      <div className="mt-4 grid gap-3">
        {[
          {
            id: 'delivery',
            title: 'Deliver to my address',
            description: 'Local delivery for salon product orders.',
            icon: Truck,
            price: 'Rs. 50',
          },
          {
            id: 'pickup',
            title: 'Pick up from salon',
            description: 'Collect your order during your next salon visit.',
            icon: PackageCheck,
            price: 'FREE',
          },
        ].map((option) => {
          const Icon = option.icon
          const selected = fulfillment === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                'flex items-start gap-3 rounded-2xl border p-3 text-left transition-colors',
                selected ? 'border-[#9b5639] bg-[#fff1e8]' : 'border-[#eadfd6] bg-[#fffaf7] hover:bg-white',
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#9b5639]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-[#241915]">{option.title}</span>
                <span className="mt-1 block text-xs leading-5 text-[#7b6b62]">{option.description}</span>
              </span>
              <span className="text-xs font-extrabold text-[#4f664f]">{option.price}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OrderSummary({ totals, coupon, fulfillment, onCouponApply, onCouponClear, hasOutOfStock }) {
  const delivery = fulfillment === 'pickup' || totals.subtotal === 0 ? 0 : 50
  const taxableSubtotal = Math.max(0, totals.subtotal - coupon.amount)
  const tax = Math.round(taxableSubtotal * 0.05)
  const grandTotal = taxableSubtotal + tax + delivery

  return (
    <aside className="sticky top-24 space-y-4 rounded-[1.75rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Order Summary</p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#241915]">{formatPrice(grandTotal)}</h2>
      </div>

      <CouponBox subtotal={totals.subtotal} coupon={coupon} onApply={onCouponApply} onClear={onCouponClear} />

      <div className="space-y-3 border-t border-[#eadfd6] pt-4 text-sm font-bold text-[#6f5f57]">
        <div className="flex justify-between">
          <span>Items subtotal</span>
          <span>{formatPrice(totals.originalSubtotal)}</span>
        </div>
        <div className="flex justify-between text-[#4f664f]">
          <span>Product discount</span>
          <span>-{formatPrice(totals.itemDiscount)}</span>
        </div>
        {coupon.amount > 0 && (
          <div className="flex justify-between text-[#4f664f]">
            <span>Coupon</span>
            <span>-{formatPrice(coupon.amount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#eadfd6] pt-4">
        <span className="text-base font-extrabold text-[#241915]">Total</span>
        <span className="text-3xl font-extrabold text-[#9b5639]">{formatPrice(grandTotal)}</span>
      </div>

      {hasOutOfStock && <p className="rounded-xl bg-danger/5 px-3 py-2 text-xs font-bold text-danger">Remove out-of-stock items before checkout.</p>}

      <Button type="button" size="lg" className="w-full bg-[#241915] hover:bg-[#3a2b24]" disabled={!totals.itemCount || hasOutOfStock}>
        Proceed to Checkout
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <Link to={ROUTE_PATHS.products} className={buttonClasses({ variant: 'outline', className: 'w-full' })}>
        Continue Shopping
      </Link>

      <div className="grid gap-2 border-t border-[#eadfd6] pt-4">
        {['Secure checkout', 'Authentic salon products', 'Professional recommendations', 'Safe payment'].map((item) => (
          <p key={item} className="flex items-center gap-2 text-xs font-bold text-[#6f5f57]">
            <ShieldCheck className="size-4 text-[#4f664f]" aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>
    </aside>
  )
}

function SmartPickupMessage({ fulfillment, onPickup }) {
  if (fulfillment === 'pickup') return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-[#241915] p-5 text-white shadow-soft">
      <Badge className="border border-white/18 bg-white/12 text-white">Make Your Next Visit Complete</Badge>
      <h2 className="mt-4 text-xl font-extrabold">Pick up products during your salon visit</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
        Salon pickup is free and keeps your product order connected to the in-salon experience.
      </p>
      <Button type="button" className="mt-5 bg-white text-[#241915] hover:bg-[#f6eee7]" onClick={onPickup}>
        Add Salon Pickup
      </Button>
    </section>
  )
}

function CompactProductCard({ product, onAdd }) {
  return (
    <article className="grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-[#eadfd6] bg-white p-3 shadow-soft">
      <div className="aspect-square overflow-hidden rounded-xl bg-[#f4ece5] p-2">
        <ImageWithFallback src={product.images?.[0]?.src} alt="" className="size-full object-contain" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-extrabold uppercase tracking-[0.12em] text-[#9b5639]">{product.brand}</p>
        <Link to={`${ROUTE_PATHS.products}/${product.id}`} className="mt-1 line-clamp-2 text-sm font-extrabold text-[#241915]">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-extrabold text-[#9b5639]">{formatPrice(product.price)}</span>
          <button type="button" onClick={() => onAdd(product)} className="rounded-full bg-[#241915] px-3 py-1.5 text-xs font-extrabold text-white">
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

function Recommendations({ products, onAdd }) {
  if (!products.length) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-[#241915]">Complete your salon routine</h2>
          <p className="text-xs text-[#7b6b62]">Smart recommendations based on your cart.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <CompactProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}

function BundleSuggestion({ bundle, bundleProducts, onAddBundle }) {
  if (!bundle || !bundleProducts.length) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-[#fffaf7] p-5 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Complete Your Routine and Save</p>
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-[#241915]">{bundle.name}</h2>
          <p className="mt-1 text-sm font-bold text-[#6f5f57]">
            {bundleProducts.map((product) => product.name).join(' + ')}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#9b5639]">{formatPrice(bundle.price)}</span>
            <span className="font-bold text-[#9a8b82] line-through">{formatPrice(bundle.originalPrice)}</span>
            <span className="rounded-full bg-[#edf1ea] px-2 py-1 text-xs font-extrabold text-[#4f664f]">
              Save {formatPrice(bundle.originalPrice - bundle.price)}
            </span>
          </div>
        </div>
        <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onAddBundle(bundleProducts)}>
          Add Bundle
        </Button>
      </div>
    </section>
  )
}

function EmptyCart() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]"
          >
            <ShoppingBag className="size-8" aria-hidden="true" />
          </motion.div>
          <h1 className="mt-5 text-3xl font-extrabold text-[#241915]">Your cart is empty</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f5f57]">
            Discover professional salon products selected by our beauty and grooming experts.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={ROUTE_PATHS.products} className={buttonClasses({ className: 'bg-[#241915] hover:bg-[#3a2b24]' })}>
              Explore Products
            </Link>
            <Link to={`${ROUTE_PATHS.products}?shelf=best-sellers`} className={buttonClasses({ variant: 'outline' })}>
              Explore Best Sellers
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Cart() {
  const { items, totals, addItem, lastRemoved, undoRemove, clearLastRemoved } = useCart()
  const { products, getProductById, getProductsByIds } = useProductCatalog()
  const [coupon, setCoupon] = useState({ code: '', amount: 0 })
  const [fulfillment, setFulfillment] = useState('pickup')
  const hasOutOfStock = items.some((item) => item.stock <= 0)

  const recommendations = useMemo(() => {
    const cartProductIds = new Set(items.map((item) => item.productId))
    const routineIds = items.flatMap((item) => item.routineProductIds ?? [])
    const routineProducts = getProductsByIds(routineIds).filter((product) => !cartProductIds.has(product.id))
    const categoryProducts = products.filter((product) => items.some((item) => item.category === product.category) && !cartProductIds.has(product.id))
    return [...new Map([...routineProducts, ...categoryProducts].map((product) => [product.id, product])).values()].slice(0, 4)
  }, [getProductsByIds, items, products])

  const bundle = useMemo(
    () => productBundles.find((item) => item.productIds.some((productId) => items.some((cartItem) => cartItem.productId === productId))),
    [items],
  )
  const bundleProducts = useMemo(() => (bundle ? getProductsByIds(bundle.productIds) : []), [bundle, getProductsByIds])

  if (items.length === 0) {
    return (
      <div className="bg-[#fffaf7]">
        <EmptyCart />
      </div>
    )
  }

  function handleAddRecommended(product) {
    addItem(product)
  }

  function handleAddBundle(bundleItems) {
    bundleItems.forEach((product) => addItem(product))
  }

  return (
    <div className="bg-[#fffaf7] pb-28 lg:pb-0">
      <CartHeader itemCount={totals.itemCount} />
      <Container className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Your Cart</p>
              <h2 className="text-2xl font-extrabold text-[#241915]">{totals.itemCount} selected items</h2>
            </div>
            <Link to={ROUTE_PATHS.products} className="hidden text-sm font-extrabold text-[#9b5639] sm:inline-flex">
              Continue Shopping
            </Link>
          </div>

          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem key={item.id} item={item} product={getProductById(item.productId)} />
            ))}
          </AnimatePresence>

          <SmartPickupMessage fulfillment={fulfillment} onPickup={() => setFulfillment('pickup')} />
          <Recommendations products={recommendations} onAdd={handleAddRecommended} />
          <BundleSuggestion bundle={bundle} bundleProducts={bundleProducts} onAddBundle={handleAddBundle} />
        </div>

        <div className="space-y-4">
          <DeliveryOptions fulfillment={fulfillment} onChange={setFulfillment} />
          <OrderSummary
            totals={totals}
            coupon={coupon}
            fulfillment={fulfillment}
            onCouponApply={(nextCoupon) => setCoupon(nextCoupon ?? { code: '', amount: 0 })}
            onCouponClear={() => setCoupon({ code: '', amount: 0 })}
            hasOutOfStock={hasOutOfStock}
          />
        </div>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadfd6] bg-white p-4 shadow-2xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#7b6b62]">Total</p>
            <p className="text-xl font-extrabold text-[#9b5639]">
              {formatPrice(Math.max(0, totals.subtotal - coupon.amount) + (fulfillment === 'pickup' ? 0 : 50) + Math.round(Math.max(0, totals.subtotal - coupon.amount) * 0.05))}
            </p>
          </div>
          <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" disabled={hasOutOfStock}>
            Checkout
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {lastRemoved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-4 bottom-24 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-2xl lg:bottom-4"
          >
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
                <RotateCcw className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#241915]">
                  {lastRemoved.wishlist ? 'Saved to your wishlist' : 'Product removed from cart'}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#7b6b62]">{lastRemoved.name}</p>
                <div className="mt-2 flex gap-4">
                  {!lastRemoved.wishlist && (
                    <button type="button" onClick={undoRemove} className="text-xs font-extrabold text-[#9b5639]">
                      Undo
                    </button>
                  )}
                  <button type="button" onClick={clearLastRemoved} className="text-xs font-extrabold text-[#6f5f57]">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cart
