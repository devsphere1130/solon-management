import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  Check,
  ChevronDown,
  Heart,
  Image as ImageIcon,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { useCart } from '../context/useCart.js'
import { useProductCatalog } from '../context/useProductCatalog.js'
import { useWishlist } from '../context/useWishlist.js'
import { productCategories } from '../data/products.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const sortOptions = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'recently-viewed', label: 'Recently Viewed' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
]

function formatPrice(price) {
  return INR_FORMATTER.format(Math.max(0, Math.round(price)))
}

function ImageWithFallback({ src, alt, className }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#efe8df] text-[#8a7568]', className)}>
        <ImageIcon className="size-7" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setHasError(true)} />
}

function Rating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d5c52]">
      <span className="flex items-center gap-0.5 text-[#b98238]" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={cn('size-3.5', index < Math.round(rating) && 'fill-current')} aria-hidden="true" />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      <span className="text-[#9a8b82]">({reviewCount})</span>
    </div>
  )
}

function WishlistHeader({ savedProducts }) {
  const categoryCounts = savedProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <section className="border-b border-[#eadfd6] bg-[#fffaf7] py-14 sm:py-16">
      <Container>
        <Badge className="bg-[#fff1e8] text-[#9b5639]">Your Saved Collection</Badge>
        <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-[#241915] sm:text-5xl">My Wishlist</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f5f57]">
              Products you have saved for your next salon routine.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-soft">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Saved Products</p>
            <p className="mt-1 text-3xl font-extrabold text-[#241915]">{savedProducts.length}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categoryCounts)
            .slice(0, 4)
            .map(([category, count]) => (
              <div key={category} className="rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 shadow-soft">
                <p className="text-xl font-extrabold text-[#241915]">{count}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7b6b62]">{category}</p>
              </div>
            ))}
          {savedProducts.length === 0 && (
            <div className="rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 shadow-soft">
              <p className="text-xl font-extrabold text-[#241915]">0</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#7b6b62]">Saved Products</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

function WishlistToolbar({ search, onSearch, activeCategory, onCategory, sort, onSort, savedProducts }) {
  const categories = productCategories.filter((category) => {
    if (category.id === 'all') return true
    return savedProducts.some((product) => product.category === category.label)
  })

  return (
    <div className="rounded-3xl border border-[#eadfd6] bg-white p-4 shadow-soft">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7b72]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search your wishlist..."
            className="h-12 w-full rounded-full border border-[#eadfd6] bg-[#fffaf7] pr-4 pl-11 text-sm font-semibold text-[#241915] outline-none transition-colors placeholder:text-[#9a8b82] focus:border-[#9b5639]"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Sort wishlist</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-[#eadfd6] bg-[#fffaf7] px-5 pr-10 text-sm font-bold text-[#241915] outline-none focus:border-[#9b5639] lg:w-56"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7b72]" aria-hidden="true" />
        </label>
      </div>

      <div className="premium-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((category) => {
          const isActive = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategory(category.id)}
              aria-pressed={isActive}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
                isActive ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] bg-white text-[#6f5f57] hover:bg-[#fffaf7]',
              )}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StockState({ product }) {
  if (product.stock <= 0) {
    return <span className="text-xs font-extrabold text-danger">Currently unavailable</span>
  }

  if (product.stock <= 3) {
    return <span className="text-xs font-extrabold text-[#8a5b16]">Only {product.stock} left</span>
  }

  return <span className="text-xs font-extrabold text-[#4f664f]">In Stock</span>
}

function WishlistCard({ product, wishlistItem, index, onRemove, onAddToCart, onMoveToCart, onQuickView, added }) {
  const discount = product.originalPrice > 0 ? Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)) : 0
  const priceDropped = wishlistItem.priceAtSave > product.price

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      whileHover={{ y: -5 }}
      className="group flex min-h-[30rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-white shadow-[0_1px_2px_rgba(36,25,21,0.04),0_20px_54px_-34px_rgba(67,43,32,0.42)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(145deg,#fbf4ee,#ece1d8)] p-5">
        <Link to={`${ROUTE_PATHS.products}/${product.id}`} aria-label={`View ${product.name}`}>
          <ImageWithFallback src={product.images?.[0]?.src} alt={product.images?.[0]?.alt ?? product.name} className="size-full object-contain transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <motion.button
          type="button"
          whileTap={{ scale: 1.18 }}
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-[#9b5639] shadow-sm"
        >
          <Heart className="size-4 fill-current" aria-hidden="true" />
        </motion.button>
        {product.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-[#241915] px-3 py-1 text-xs font-extrabold text-white">
            {product.badge}
          </span>
        )}
        {product.model3d && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#241915] shadow-sm">
            360 View
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9b5639]">{product.brand}</p>
        <Link to={`${ROUTE_PATHS.products}/${product.id}`} className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-[#241915] hover:text-[#9b5639]">
          {product.name}
        </Link>
        <div className="mt-3">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-[#241915]">{formatPrice(product.price)}</span>
          <span className="text-sm font-bold text-[#9a8b82] line-through">{formatPrice(product.originalPrice)}</span>
          {discount > 0 && <span className="rounded-full bg-[#edf1ea] px-2 py-1 text-xs font-extrabold text-[#4f664f]">{discount}% off</span>}
        </div>
        {priceDropped && (
          <p className="mt-3 rounded-xl bg-[#fff6df] px-3 py-2 text-xs font-extrabold text-[#8a5b16]">
            Price drop: you save {formatPrice(wishlistItem.priceAtSave - product.price)}
          </p>
        )}
        <div className="mt-3">
          <StockState product={product} />
        </div>

        <div className="mt-auto space-y-2 pt-5">
          <Button
            type="button"
            className={cn('w-full bg-[#241915] hover:bg-[#3a2b24]', added && 'bg-[#4f664f] hover:bg-[#4f664f]')}
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
          >
            {product.stock <= 0 ? 'Notify Me' : added ? 'Added to Cart' : 'Add to Cart'}
            {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded-full border border-[#eadfd6] px-3 py-2 text-xs font-extrabold text-[#6f5f57] hover:bg-[#fffaf7]"
              onClick={() => onQuickView(product)}
            >
              Quick View
            </button>
            <button
              type="button"
              className="rounded-full border border-[#eadfd6] px-3 py-2 text-xs font-extrabold text-[#9b5639] hover:bg-[#fff1e8]"
              disabled={product.stock <= 0}
              onClick={() => onMoveToCart(product)}
            >
              Move to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function QuickViewModal({ product, onClose, onAddToCart, added }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.name ?? '')
  const selectedImage = product.images?.[imageIndex] ?? product.images?.[0]
  const selectedVariantRecord = product.variants?.find((variant) => variant.name === selectedVariant)
  const displayPrice = selectedVariantRecord?.price ?? product.price

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#241915]/62 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-quick-view-title"
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[#fffaf7] shadow-2xl sm:max-w-5xl sm:rounded-[1.75rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd6] bg-[#fffaf7]/94 px-5 py-4 backdrop-blur">
          <h2 id="wishlist-quick-view-title" className="text-lg font-extrabold text-[#241915]">Wishlist Quick View</h2>
          <button type="button" autoFocus onClick={onClose} aria-label="Close quick view" className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] bg-white">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-[#eadfd6] bg-[#f4ece5] p-8">
              <ImageWithFallback src={selectedImage?.src} alt={selectedImage?.alt ?? product.name} className="size-full object-contain" />
            </div>
            <div className="premium-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {(product.images ?? []).map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    'size-20 shrink-0 overflow-hidden rounded-2xl border bg-[#f4ece5] p-2',
                    index === imageIndex ? 'border-[#9b5639]' : 'border-[#eadfd6]',
                  )}
                >
                  <ImageWithFallback src={image.src} alt="" className="size-full object-contain" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">{product.brand}</p>
            <h3 className="mt-2 text-3xl font-extrabold leading-tight text-[#241915]">{product.name}</h3>
            <div className="mt-3"><Rating rating={product.rating} reviewCount={product.reviewCount} /></div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#9b5639]">{formatPrice(displayPrice)}</span>
              <span className="font-bold text-[#9a8b82] line-through">{formatPrice(product.originalPrice)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6f5f57]">{product.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3 py-2 shadow-soft">
                <StockState product={product} />
              </span>
              {selectedVariant && (
                <span className="rounded-full bg-white px-3 py-2 text-xs font-extrabold text-[#6f5f57] shadow-soft">
                  Variant: {selectedVariant}
                </span>
              )}
            </div>
            {(product.variants ?? []).length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#7b6b62]">Choose Variant</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setSelectedVariant(variant.name)}
                      aria-pressed={selectedVariant === variant.name}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-extrabold transition-colors',
                        selectedVariant === variant.name
                          ? 'border-[#9b5639] bg-[#9b5639] text-white'
                          : 'border-[#eadfd6] bg-white text-[#6f5f57] hover:bg-[#fffaf7]',
                      )}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(product.benefits ?? []).slice(0, 4).map((benefit) => (
                <p key={benefit} className="flex items-center gap-2 text-sm font-bold text-[#241915]">
                  <Check className="size-4 text-[#4f664f]" aria-hidden="true" />
                  {benefit}
                </p>
              ))}
            </div>
            {product.expert?.quote && (
              <blockquote className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-[#5f4f47] shadow-soft">
                "{product.expert.quote}"
              </blockquote>
            )}
            {product.model3d && (
              <a href={product.model3d.dataUrl} download={product.model3d.fileName} className="mt-5 inline-flex rounded-full border border-[#eadfd6] px-4 py-2 text-sm font-extrabold text-[#241915]">
                View in 3D
              </a>
            )}
            <Button
              type="button"
              size="lg"
              disabled={product.stock <= 0}
              className={cn('mt-7 w-full bg-[#241915] hover:bg-[#3a2b24]', added && 'bg-[#4f664f]', product.stock <= 0 && 'bg-[#b8ada6] hover:bg-[#b8ada6]')}
              onClick={() => onAddToCart(product, { variantName: selectedVariant })}
            >
              {product.stock <= 0 ? 'Notify Me' : added ? 'Added to Cart' : 'Add to Cart'}
              <ShoppingBag className="size-4" aria-hidden="true" />
            </Button>
            <Link to={`${ROUTE_PATHS.products}/${product.id}`} className={buttonClasses({ variant: 'outline', size: 'lg', className: 'mt-3 w-full' })}>
              View Details
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

function EmptyWishlist() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-[2rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]"
          >
            <Heart className="size-8" aria-hidden="true" />
          </motion.div>
          <h1 className="mt-5 text-3xl font-extrabold text-[#241915]">Your wishlist is waiting</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f5f57]">
            Save products you love and come back when you are ready to make them yours.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={ROUTE_PATHS.products} className={buttonClasses({ className: 'bg-[#241915] hover:bg-[#3a2b24]' })}>
              Explore Products
            </Link>
            <Link to={ROUTE_PATHS.products} className={buttonClasses({ variant: 'outline' })}>
              View Best Sellers
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function CompactProductCard({ product, onAdd, actionLabel = 'Add' }) {
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
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => onAdd(product)}
            className={cn(
              'rounded-full bg-[#241915] px-3 py-1.5 text-xs font-extrabold text-white transition-colors hover:bg-[#3a2b24]',
              product.stock <= 0 && 'cursor-not-allowed bg-[#b8ada6] hover:bg-[#b8ada6]',
            )}
          >
            {product.stock <= 0 ? 'Out' : actionLabel}
          </button>
        </div>
      </div>
    </article>
  )
}

function CompleteRoutineSection({ baseProduct, products, onAdd }) {
  if (!baseProduct || !products.length) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-[#fff6ef] p-5 shadow-soft">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Badge className="bg-white text-[#9b5639]">Complete Your Routine</Badge>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#241915]">
            Complete your {baseProduct.category.toLowerCase()} routine
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f5f57]">
            You saved {baseProduct.name}. Add these supporting products for a salon-rounded home routine.
          </p>
        </div>
        <Link to={`${ROUTE_PATHS.products}/${baseProduct.id}`} className={buttonClasses({ variant: 'outline', className: 'shrink-0 bg-white' })}>
          View Saved Product
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product) => (
          <CompactProductCard key={product.id} product={product} onAdd={onAdd} actionLabel="Cart" />
        ))}
      </div>
    </section>
  )
}

function RecommendationSection({ products, onAdd }) {
  if (!products.length) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-[#241915]">You may also like</h2>
          <p className="text-xs text-[#7b6b62]">Related products based on your saved collection.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <CompactProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}

function ServiceRecommendation({ savedProducts }) {
  const firstCategory = savedProducts[0]?.category
  if (!firstCategory) return null

  return (
    <section className="rounded-[1.5rem] border border-[#eadfd6] bg-[#241915] p-6 text-white shadow-soft">
      <Badge className="border border-white/18 bg-white/12 text-white">Salon Connection</Badge>
      <h2 className="mt-4 text-2xl font-extrabold">Planning your next {firstCategory.toLowerCase()} routine?</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
        Book a professional salon service and get expert advice for maintaining your results at home.
      </p>
      <Link to={ROUTE_PATHS.services} className={buttonClasses({ className: 'mt-5 bg-white text-[#241915] hover:bg-[#f6eee7]' })}>
        Explore Services
      </Link>
    </section>
  )
}

function Wishlist() {
  const { items, count, removeItem, markViewed, lastRemoved, undoRemove, clearLastRemoved } = useWishlist()
  const { addItem: addCartItem } = useCart()
  const { products, getProductsByIds } = useProductCatalog()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('recent')
  const [addedIds, setAddedIds] = useState(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [notice, setNotice] = useState('')

  const savedRecords = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((candidate) => candidate.id === item.productId)
          return product ? { wishlistItem: item, product } : null
        })
        .filter(Boolean),
    [items, products],
  )

  const savedProducts = useMemo(() => savedRecords.map((record) => record.product), [savedRecords])

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase()
    const category = productCategories.find((item) => item.id === activeCategory)?.label

    return [...savedRecords]
      .filter(({ product }) => activeCategory === 'all' || product.category === category)
      .filter(({ product }) => !query || [product.name, product.brand, product.category].join(' ').toLowerCase().includes(query))
      .sort((a, b) => {
        if (sort === 'price-low') return a.product.price - b.product.price
        if (sort === 'price-high') return b.product.price - a.product.price
        if (sort === 'rating') return b.product.rating - a.product.rating
        if (sort === 'recently-viewed') {
          const viewedA = new Date(a.wishlistItem.lastViewedAt ?? a.wishlistItem.addedAt).getTime()
          const viewedB = new Date(b.wishlistItem.lastViewedAt ?? b.wishlistItem.addedAt).getTime()
          return viewedB - viewedA
        }
        if (sort === 'discount') {
          const discountA = a.product.originalPrice - a.product.price
          const discountB = b.product.originalPrice - b.product.price
          return discountB - discountA
        }
        return new Date(b.wishlistItem.addedAt).getTime() - new Date(a.wishlistItem.addedAt).getTime()
      })
  }, [activeCategory, savedRecords, search, sort])

  const routineBaseProduct = savedProducts.find((product) => product.routineProductIds?.length > 0)

  const routineRecommendations = useMemo(() => {
    const savedIds = new Set(savedProducts.map((product) => product.id))
    const routineIds = savedProducts.flatMap((product) => product.routineProductIds ?? [])
    return [...new Map(getProductsByIds(routineIds).filter((product) => !savedIds.has(product.id)).map((product) => [product.id, product])).values()]
  }, [getProductsByIds, savedProducts])

  const recommendations = useMemo(() => {
    const savedIds = new Set(savedProducts.map((product) => product.id))
    const routineIds = new Set(routineRecommendations.map((product) => product.id))
    const categoryProducts = products.filter((product) =>
      savedProducts.some((saved) => saved.category === product.category) && !savedIds.has(product.id) && !routineIds.has(product.id),
    )
    return categoryProducts.slice(0, 4)
  }, [products, routineRecommendations, savedProducts])

  function handleAddToCart(product, options = {}) {
    addCartItem(product, options)
    setAddedIds((current) => new Set(current).add(product.id))
    setNotice(`${product.name} added to cart`)
    window.setTimeout(() => {
      setAddedIds((current) => {
        const next = new Set(current)
        next.delete(product.id)
        return next
      })
      setNotice('')
    }, 1600)
  }

  function handleMoveToCart(product) {
    addCartItem(product)
    removeItem(product.id)
    setNotice(`${product.name} moved to cart`)
    window.setTimeout(() => setNotice(''), 1600)
  }

  function handleRemove(productId) {
    removeItem(productId)
    setNotice('Removed from wishlist')
    window.setTimeout(() => setNotice(''), 1600)
  }

  function handleQuickView(product) {
    markViewed(product.id)
    setQuickViewProduct(product)
  }

  if (count === 0) {
    return (
      <div className="bg-[#fffaf7]">
        <WishlistHeader savedProducts={[]} />
        <EmptyWishlist />
      </div>
    )
  }

  return (
    <div className="bg-[#fffaf7] pb-16">
      <WishlistHeader savedProducts={savedProducts} />
      <Container className="space-y-8 py-10">
        <WishlistToolbar
          search={search}
          onSearch={setSearch}
          activeCategory={activeCategory}
          onCategory={setActiveCategory}
          sort={sort}
          onSort={setSort}
          savedProducts={savedProducts}
        />

        {filteredRecords.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredRecords.map(({ product, wishlistItem }, index) => (
                <WishlistCard
                  key={product.id}
                  product={product}
                  wishlistItem={wishlistItem}
                  index={index}
                  added={addedIds.has(product.id)}
                  onRemove={handleRemove}
                  onAddToCart={handleAddToCart}
                  onMoveToCart={handleMoveToCart}
                  onQuickView={handleQuickView}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-[1.5rem] border border-[#eadfd6] bg-white p-10 text-center shadow-soft">
            <h2 className="text-2xl font-extrabold text-[#241915]">No saved products found</h2>
            <p className="mt-2 text-sm text-[#6f5f57]">Try another search or category filter.</p>
            <Button type="button" className="mt-5 bg-[#241915] hover:bg-[#3a2b24]" onClick={() => {
              setSearch('')
              setActiveCategory('all')
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        <ServiceRecommendation savedProducts={savedProducts} />
        <CompleteRoutineSection baseProduct={routineBaseProduct} products={routineRecommendations} onAdd={handleAddToCart} />
        <RecommendationSection
          products={recommendations}
          onAdd={handleAddToCart}
        />
      </Container>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            key={quickViewProduct.id}
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            added={addedIds.has(quickViewProduct.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(notice || lastRemoved) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-4 bottom-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-2xl"
          >
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
                <Heart className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#241915]">{notice || 'Removed from wishlist'}</p>
                {lastRemoved && (
                  <div className="mt-2 flex gap-4">
                    <button type="button" className="text-xs font-extrabold text-[#9b5639]" onClick={undoRemove}>
                      Undo
                    </button>
                    <button type="button" className="text-xs font-extrabold text-[#6f5f57]" onClick={clearLastRemoved}>
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Wishlist
