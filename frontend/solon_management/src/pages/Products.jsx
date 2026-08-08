import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Filter,
  Heart,
  Image as ImageIcon,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { useProductCatalog } from '../context/useProductCatalog.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { productBundles, productCategories, popularSearches } from '../data/products.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const priceRanges = [
  { id: 'all', label: 'All prices' },
  { id: '0-500', label: 'Under Rs. 500', min: 0, max: 500 },
  { id: '500-1000', label: 'Rs. 500 - Rs. 1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: 'Rs. 1,000 - Rs. 2,500', min: 1000, max: 2500 },
  { id: '2500+', label: 'Rs. 2,500+', min: 2500, max: Infinity },
]

function formatPrice(price) {
  return INR_FORMATTER.format(price)
}

function ImageWithFallback({ src, alt, className, loading = 'lazy' }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-[#efe8df] text-[#8a7568]', className)}>
        <ImageIcon className="size-8" aria-hidden="true" />
      </div>
    )
  }

  return <img src={src} alt={alt} loading={loading} className={className} onError={() => setHasError(true)} />
}

function Rating({ rating, reviewCount, compact = false }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d5c52]">
      <span className="flex items-center gap-0.5 text-[#b98238]" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={cn('size-3.5', index < Math.round(rating) && 'fill-current')} aria-hidden="true" />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      {!compact && <span className="text-[#9a8b82]">({reviewCount})</span>}
    </div>
  )
}

function ShopHero({ onShopClick, cartCount }) {
  return (
    <section className="relative overflow-hidden bg-[#191716] text-white">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1800&q=84"
        alt="Luxury salon cosmetics and beauty products on a vanity"
        loading="eager"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,23,22,0.94),rgba(25,23,22,0.62),rgba(25,23,22,0.18)),linear-gradient(180deg,rgba(25,23,22,0.08),rgba(25,23,22,0.72))]" />
      <Container className="relative grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-20 lg:grid-cols-[0.96fr_0.74fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <Badge className="border border-white/18 bg-white/12 text-white backdrop-blur">Professional Salon Collection</Badge>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Bring the salon experience home.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
            Discover professional hair, skin, beauty, fragrance, and grooming products selected by salon experts.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" className="bg-white text-[#241915] hover:bg-[#f6eee7]" onClick={onShopClick}>
              Shop Products
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <span className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Cart {cartCount}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:block"
          aria-hidden="true"
        >
          <div className="relative ml-auto max-w-md rounded-[2rem] border border-white/16 bg-white/10 p-5 shadow-[0_28px_90px_-42px_rgba(0,0,0,0.7)] backdrop-blur">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#f8f2ec]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=84"
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-4 text-[#241915] shadow-soft">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Salon Expert Pick</p>
              <p className="mt-1 text-sm font-extrabold">Repair Shampoo + Hair Mask Routine</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function CategoryCards({ activeCategory, onChange, allProducts }) {
  const counts = useMemo(
    () =>
      productCategories.reduce((acc, category) => {
        acc[category.id] =
          category.id === 'all' ? allProducts.length : allProducts.filter((product) => product.category === category.label).length
        return acc
      }, {}),
    [allProducts],
  )

  return (
    <section className="border-b border-[#eadfd6] bg-[#fffaf7] py-12">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Shop By Category</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Products for every routine</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6f5f57]">
            Hair, skin, grooming, makeup, nail care, and fragrance collections curated for salon-level results.
          </p>
        </div>

        <div className="premium-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0 xl:grid-cols-8">
          {productCategories.map((category) => {
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange(category.id)}
                className={cn(
                  'group w-40 shrink-0 overflow-hidden rounded-2xl border bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 lg:w-auto',
                  isActive ? 'border-[#9b5639]' : 'border-[#eadfd6] hover:border-[#cda98d]',
                )}
              >
                <div className="relative h-28 overflow-hidden bg-[#f3ebe4]">
                  <ImageWithFallback
                    src={category.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/62 to-transparent opacity-70 transition-opacity group-hover:opacity-88" />
                  <ArrowRight className="absolute right-3 bottom-3 size-4 text-white transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-extrabold text-[#241915]">{category.label}</p>
                  <p className="mt-1 text-xs font-semibold text-[#8b7b72]">{counts[category.id] ?? 0} products</p>
                </div>
              </button>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function FilterPanel({ filters, onChange, brands, className }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <aside className={cn('space-y-6 rounded-3xl border border-[#eadfd6] bg-white p-5 shadow-soft', className)}>
      <div>
        <h3 className="text-sm font-extrabold text-[#241915]">Filters</h3>
        <p className="mt-1 text-xs text-[#7b6b62]">Refine product discovery.</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Collection</p>
        <div className="grid gap-2">
          {['All', 'Women', 'Men', 'Unisex'].map((audience) => (
            <button
              key={audience}
              type="button"
              onClick={() => update('audience', audience)}
              className={cn(
                'flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-bold transition-colors',
                filters.audience === audience
                  ? 'border-[#9b5639] bg-[#fff1e8] text-[#241915]'
                  : 'border-[#eadfd6] text-[#6f5f57] hover:bg-[#fffaf7]',
              )}
            >
              {audience}
              {filters.audience === audience && <Check className="size-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Price</p>
        <div className="grid gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => update('priceRange', range.id)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-sm font-bold transition-colors',
                filters.priceRange === range.id
                  ? 'border-[#9b5639] bg-[#fff1e8] text-[#241915]'
                  : 'border-[#eadfd6] text-[#6f5f57] hover:bg-[#fffaf7]',
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Brand</p>
        <div className="grid gap-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 rounded-xl border border-[#eadfd6] px-3 py-2 text-sm font-bold text-[#6f5f57]">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={(event) => {
                  update(
                    'brands',
                    event.target.checked ? [...filters.brands, brand] : filters.brands.filter((item) => item !== brand),
                  )
                }}
                className="size-4 accent-[#9b5639]"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Rating</p>
        <button
          type="button"
          onClick={() => update('rating', filters.rating === 4 ? 0 : 4)}
          className={cn(
            'w-full rounded-xl border px-3 py-2 text-left text-sm font-bold transition-colors',
            filters.rating === 4 ? 'border-[#9b5639] bg-[#fff1e8] text-[#241915]' : 'border-[#eadfd6] text-[#6f5f57]',
          )}
        >
          4 star and above
        </button>
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-[#eadfd6] px-3 py-2 text-sm font-bold text-[#6f5f57]">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(event) => update('inStock', event.target.checked)}
          className="size-4 accent-[#9b5639]"
        />
        In stock
      </label>
    </aside>
  )
}

function ProductSearch({ search, onSearch, sort, onSort, onOpenFilters }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative rounded-3xl border border-[#eadfd6] bg-white p-4 shadow-soft">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7b72]" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => window.setTimeout(() => setIsFocused(false), 120)}
            placeholder="Search hair care, skincare, grooming..."
            className="h-12 w-full rounded-full border border-[#eadfd6] bg-[#fffaf7] pr-4 pl-11 text-sm font-semibold text-[#241915] outline-none transition-colors placeholder:text-[#9a8b82] focus:border-[#9b5639]"
          />
        </label>

        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#eadfd6] px-5 text-sm font-bold text-[#241915] lg:hidden"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </button>

        <label className="relative">
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(event) => onSort(event.target.value)}
            className="h-12 w-full appearance-none rounded-full border border-[#eadfd6] bg-[#fffaf7] px-5 pr-10 text-sm font-bold text-[#241915] outline-none focus:border-[#9b5639] lg:w-56"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8b7b72]" aria-hidden="true" />
        </label>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-4 right-4 top-[calc(100%-0.5rem)] z-30 rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-2xl"
          >
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSearch(item)}
                  className="rounded-full bg-[#fff1e8] px-3 py-1.5 text-xs font-bold text-[#6f4a38]"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({ product, index, wishlist, onWishlist, onAddToCart, added, onQuickView }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      className="group flex min-h-[28rem] flex-col overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-white shadow-[0_1px_2px_rgba(36,25,21,0.04),0_20px_54px_-34px_rgba(67,43,32,0.42)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(145deg,#fbf4ee,#ece1d8)] p-5">
        <Link to={`${ROUTE_PATHS.products}/${product.id}`} aria-label={`View ${product.name}`}>
          <ImageWithFallback
            src={product.images[0].src}
            alt={product.images[0].alt}
            className="absolute inset-5 size-[calc(100%-2.5rem)] object-contain transition-opacity duration-300 group-hover:opacity-0"
          />
          <ImageWithFallback
            src={product.images[1]?.src ?? product.images[0].src}
            alt=""
            className="absolute inset-5 size-[calc(100%-2.5rem)] object-contain opacity-0 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          />
        </Link>
        <button
          type="button"
          onClick={() => onWishlist(product)}
          aria-label={wishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          className={cn(
            'absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/88 text-[#6f5f57] shadow-sm transition-all hover:scale-105',
            wishlist && 'text-[#9b5639]',
          )}
        >
          <Heart className={cn('size-4', wishlist && 'fill-current')} aria-hidden="true" />
        </button>
        {product.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-[#241915] px-3 py-1 text-xs font-extrabold text-white">
            {product.badge}
          </span>
        )}
        {product.model3d && (
          <span className="absolute left-4 bottom-16 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#241915] shadow-sm">
            360 View
          </span>
        )}
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-4 translate-y-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#241915] opacity-0 shadow-soft transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
        >
          Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9b5639]">{product.brand}</p>
        <Link to={`${ROUTE_PATHS.products}/${product.id}`} className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-[#241915] hover:text-[#9b5639]">
          {product.name}
        </Link>
        <div className="mt-3">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xl font-extrabold text-[#241915]">{formatPrice(product.price)}</span>
          <span className="text-sm font-bold text-[#9a8b82] line-through">{formatPrice(product.originalPrice)}</span>
          <span className="rounded-full bg-[#edf1ea] px-2 py-1 text-xs font-extrabold text-[#4f664f]">{discount}% off</span>
        </div>
        <p className="mt-3 text-xs font-bold text-[#4f664f]">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <Button
          type="button"
          className={cn('mt-auto w-full bg-[#241915] hover:bg-[#3a2b24]', added && 'bg-[#4f664f] hover:bg-[#4f664f]')}
          onClick={() => onAddToCart(product)}
        >
          {added ? 'Added' : 'Add to Cart'}
          {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
        </Button>
      </div>
    </motion.article>
  )
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="min-h-[28rem] overflow-hidden rounded-[1.35rem] border border-[#eadfd6] bg-white">
          <div className="aspect-square animate-pulse bg-[#f1e5dc]" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#eadfd6]" />
            <div className="h-5 w-full animate-pulse rounded-full bg-[#f1e5dc]" />
            <div className="h-4 w-28 animate-pulse rounded-full bg-[#f1e5dc]" />
            <div className="h-8 w-36 animate-pulse rounded-full bg-[#eadfd6]" />
            <div className="h-11 animate-pulse rounded-full bg-[#eadfd6]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyProducts({ onClear }) {
  return (
    <div className="rounded-3xl border border-[#eadfd6] bg-white p-12 text-center shadow-soft">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff1e8] text-[#9b5639]">
        <Search className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold text-[#241915]">No products found</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6f5f57]">Try another category, search term, or filter.</p>
      <Button type="button" className="mt-6 bg-[#241915] hover:bg-[#3a2b24]" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  )
}

function ProductGrid({ productsList, isLoading, wishlist, addedIds, onWishlist, onAddToCart, onQuickView, onClear }) {
  if (isLoading) {
    return <ProductSkeletonGrid />
  }

  if (productsList.length === 0) {
    return <EmptyProducts onClear={onClear} />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {productsList.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          wishlist={wishlist.has(product.id)}
          added={addedIds.has(product.id)}
          onWishlist={onWishlist}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  )
}

function ProductShelf({ title, description, productsList, wishlist, addedIds, onWishlist, onAddToCart, onQuickView }) {
  return (
    <section className="py-14">
      <Container>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Curated Shelf</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">{title}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#6f5f57]">{description}</p>
        </div>
        <div className="premium-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0 xl:grid-cols-4">
          {productsList.map((product, index) => (
            <div key={product.id} className="w-72 shrink-0 md:w-auto">
              <ProductCard
                product={product}
                index={index}
                wishlist={wishlist.has(product.id)}
                added={addedIds.has(product.id)}
                onWishlist={onWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function ExpertPick({ product, onQuickView }) {
  return (
    <section className="bg-[#f8f4ef] py-16">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-[#eadfd6] bg-white shadow-soft lg:grid-cols-[0.78fr_1fr]">
          <div className="relative min-h-80 bg-[#efe5dc]">
            <ImageWithFallback src={product.images[1]?.src ?? product.images[0].src} alt={product.images[1]?.alt ?? product.images[0].alt} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/68 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Badge className="border border-white/18 bg-white/14 text-white">Salon Expert Pick</Badge>
              <p className="mt-3 text-2xl font-extrabold">{product.name}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Recommended By Our Salon Experts</p>
            <blockquote className="mt-5 text-2xl font-extrabold leading-snug text-[#241915]">"{product.expert.quote}"</blockquote>
            <div className="mt-6 flex items-center gap-3">
              <ImageWithFallback src={product.expert.avatar} alt={product.expert.name} className="size-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-extrabold text-[#241915]">{product.expert.name}</p>
                <p className="text-xs font-bold text-[#7b6b62]">{product.expert.role}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onQuickView(product)}>
                Quick View
              </Button>
              <Link to={`${ROUTE_PATHS.products}/${product.id}`} className={buttonClasses({ variant: 'outline' })}>
                Product Details
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function BundleSection({ onAddBundle }) {
  return (
    <section className="bg-[#fffaf7] py-16">
      <Container>
        <div className="mb-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9b5639]">Product Bundles</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#241915]">Complete your salon routine</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {productBundles.map((bundle) => (
            <article key={bundle.id} className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-soft">
              <div className="relative h-52 overflow-hidden bg-[#efe5dc]">
                <ImageWithFallback src={bundle.image} alt={bundle.name} className="size-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241915]/66 to-transparent" />
                <Badge className="absolute left-4 top-4 bg-white/90 text-[#241915]">Save {formatPrice(bundle.originalPrice - bundle.price)}</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-[#241915]">{bundle.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#9b5639]">{formatPrice(bundle.price)}</span>
                  <span className="font-bold text-[#9a8b82] line-through">{formatPrice(bundle.originalPrice)}</span>
                </div>
                <Button type="button" className="mt-5 w-full bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onAddBundle(bundle)}>
                  Shop Bundle
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function QuickViewModal({ product, onClose, onAddToCart, added }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [variant, setVariant] = useState(product.variants[0]?.name ?? '')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const selectedImage = product.images[imageIndex] ?? product.images[0]

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
        aria-labelledby="quick-view-title"
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="max-h-[94vh] w-full overflow-y-auto rounded-t-[1.75rem] bg-[#fffaf7] shadow-2xl sm:max-w-5xl sm:rounded-[1.75rem]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eadfd6] bg-[#fffaf7]/94 px-5 py-4 backdrop-blur">
          <h2 id="quick-view-title" className="text-lg font-extrabold text-[#241915]">Quick View</h2>
          <button type="button" autoFocus onClick={onClose} aria-label="Close quick view" className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] bg-white">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-[#eadfd6] bg-[#f4ece5] p-8">
              <ImageWithFallback src={selectedImage.src} alt={selectedImage.alt} className="size-full object-contain" />
            </div>
            <div className="premium-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((image, index) => (
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
            {product.model3d && (
              <a
                href={product.model3d.dataUrl}
                download={product.model3d.fileName}
                className="mt-4 flex items-center justify-between rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 text-sm font-extrabold text-[#241915]"
              >
                360 View model attached
                <span className="text-xs text-[#9b5639]">Open</span>
              </a>
            )}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">{product.brand}</p>
            <h3 className="mt-2 text-3xl font-extrabold leading-tight text-[#241915]">{product.name}</h3>
            <div className="mt-3"><Rating rating={product.rating} reviewCount={product.reviewCount} /></div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#9b5639]">{formatPrice(product.price)}</span>
              <span className="font-bold text-[#9a8b82] line-through">{formatPrice(product.originalPrice)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6f5f57]">{product.description}</p>
            <div className="mt-6">
              <p className="text-sm font-extrabold text-[#241915]">Size / Variant</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setVariant(item.name)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-bold',
                      variant === item.name ? 'border-[#9b5639] bg-[#fff1e8] text-[#241915]' : 'border-[#eadfd6] text-[#6f5f57]',
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-extrabold text-[#241915]">Quantity</span>
              <div className="inline-flex items-center rounded-full border border-[#eadfd6] bg-white">
                <button type="button" className="px-4 py-2 font-bold" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
                <span className="min-w-8 text-center text-sm font-extrabold">{quantity}</span>
                <button type="button" className="px-4 py-2 font-bold" onClick={() => setQuantity((value) => value + 1)}>+</button>
              </div>
            </div>
            <Button type="button" size="lg" className={cn('mt-7 w-full bg-[#241915] hover:bg-[#3a2b24]', added && 'bg-[#4f664f]')} onClick={() => onAddToCart(product, quantity, variant)}>
              {added ? 'Added to Cart' : 'Add to Cart'}
              <ShoppingBag className="size-4" aria-hidden="true" />
            </Button>
            <Link to={`${ROUTE_PATHS.products}/${product.id}`} className={buttonClasses({ variant: 'outline', size: 'lg', className: 'mt-3 w-full' })}>
              View Full Details
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

function CartNotice({ notice, onClose }) {
  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed right-4 bottom-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[#eadfd6] bg-white p-4 shadow-2xl"
        >
          <div className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#edf1ea] text-[#4f664f]">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-[#241915]">Product added to your cart</p>
              <p className="mt-0.5 truncate text-xs text-[#7b6b62]">{notice.name}</p>
              <Link to={ROUTE_PATHS.cart} className="mt-2 inline-flex text-xs font-extrabold text-[#9b5639]" onClick={onClose}>
                View Cart
              </Link>
              <button type="button" className="ml-4 mt-2 text-xs font-extrabold text-[#6f5f57]" onClick={onClose}>
                Continue Shop
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MobileFilterDrawer({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#241915]/48 lg:hidden" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[#fffaf7] p-5 lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-extrabold text-[#241915]">Filters</p>
              <button type="button" onClick={onClose} aria-label="Close filters" className="flex size-10 items-center justify-center rounded-full border border-[#eadfd6] bg-white">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function PromoBanner() {
  return (
    <section className="bg-[#fffaf7] py-12">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-[#eadfd6] bg-[#241915] p-6 text-white shadow-soft lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d7b48c]">Complete Your Salon Routine</p>
            <h2 className="mt-2 text-2xl font-extrabold">Special pricing when selected products pair with salon services.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
              Build a take-home routine around treatments like hair spa, facials, beard styling, and bridal prep.
            </p>
          </div>
          <Link to={ROUTE_PATHS.services} className={buttonClasses({ variant: 'accent', size: 'lg', className: 'bg-[#d7b48c] text-[#241915] hover:bg-[#e8c79e]' })}>
            Explore Offers
          </Link>
        </div>
      </Container>
    </section>
  )
}

function Products() {
  const { products } = useProductCatalog()
  const { addItem, totals } = useCart()
  const { isSaved, toggleItem: toggleWishlist } = useWishlist()
  const prefersReducedMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [filters, setFilters] = useState({ audience: 'All', priceRange: 'all', brands: [], rating: 0, inStock: false })
  const [addedIds, setAddedIds] = useState(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [notice, setNotice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const shopRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 240)
    return () => window.clearTimeout(timer)
  }, [])

  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))], [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const selectedPrice = priceRanges.find((range) => range.id === filters.priceRange) ?? priceRanges[0]

    return products
      .filter((product) => activeCategory === 'all' || product.category === productCategories.find((category) => category.id === activeCategory)?.label)
      .filter((product) => !query || [product.name, product.brand, product.category, product.audience].join(' ').toLowerCase().includes(query))
      .filter((product) => filters.audience === 'All' || product.audience === filters.audience || product.audience === 'Unisex')
      .filter((product) => selectedPrice.id === 'all' || (product.price >= selectedPrice.min && product.price <= selectedPrice.max))
      .filter((product) => filters.brands.length === 0 || filters.brands.includes(product.brand))
      .filter((product) => filters.rating === 0 || product.rating >= filters.rating)
      .filter((product) => !filters.inStock || product.stock > 0)
      .sort((a, b) => {
        if (sort === 'popular') return b.reviewCount - a.reviewCount
        if (sort === 'newest') return Number(b.isNew) - Number(a.isNew)
        if (sort === 'price-low') return a.price - b.price
        if (sort === 'price-high') return b.price - a.price
        if (sort === 'rating') return b.rating - a.rating
        return Number(b.isRecommended) - Number(a.isRecommended)
      })
  }, [activeCategory, filters, products, search, sort])

  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4)
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4)
  const expertProduct = products.find((product) => product.isRecommended) ?? products[0]

  function clearFilters() {
    setActiveCategory('all')
    setSearch('')
    setFilters({ audience: 'All', priceRange: 'all', brands: [], rating: 0, inStock: false })
    setSort('featured')
  }

  function handleWishlist(product) {
    toggleWishlist(product)
  }

  function handleAddToCart(product, quantity = 1, variantName) {
    addItem(product, { quantity, variantName })
    setAddedIds((current) => new Set(current).add(product.id))
    setNotice({ id: Date.now(), name: product.name })
    window.setTimeout(() => {
      setAddedIds((current) => {
        const next = new Set(current)
        next.delete(product.id)
        return next
      })
    }, 1400)
  }

  function handleAddBundle(bundle) {
    bundle.productIds.forEach((productId) => {
      const product = products.find((item) => item.id === productId)
      if (product) addItem(product)
    })
    setNotice({ id: Date.now(), name: bundle.name })
  }

  return (
    <div className="bg-[#fffaf7]">
      <ShopHero
        cartCount={totals.itemCount}
        onShopClick={() => shopRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })}
      />
      <CategoryCards activeCategory={activeCategory} onChange={setActiveCategory} allProducts={products} />
      <PromoBanner />
      <section ref={shopRef} className="py-16">
        <Container>
          <ProductSearch
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={setSort}
            onOpenFilters={() => setIsFilterOpen(true)}
          />
          <div className="mt-7 grid gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <FilterPanel filters={filters} onChange={setFilters} brands={brands} className="hidden lg:block" />
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Shop Collection</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-[#241915]">{filteredProducts.length} products found</h2>
                </div>
                <span className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6f5f57] shadow-soft sm:inline-flex">
                  <Filter className="size-4" aria-hidden="true" />
                  Refined discovery
                </span>
              </div>
              <ProductGrid
                productsList={filteredProducts}
                isLoading={isLoading}
                wishlist={{ has: isSaved }}
                addedIds={addedIds}
                onWishlist={handleWishlist}
                onAddToCart={handleAddToCart}
                onQuickView={setQuickViewProduct}
                onClear={clearFilters}
              />
            </div>
          </div>
        </Container>
      </section>
      <ProductShelf
        title="Most loved products"
        description="Top-rated salon products customers keep returning to for home care."
        productsList={bestSellers}
        wishlist={{ has: isSaved }}
        addedIds={addedIds}
        onWishlist={handleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />
      <ExpertPick product={expertProduct} onQuickView={setQuickViewProduct} />
      <ProductShelf
        title="Just arrived"
        description="Fresh additions across hair, skin, makeup, grooming, and fragrance."
        productsList={newArrivals}
        wishlist={{ has: isSaved }}
        addedIds={addedIds}
        onWishlist={handleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />
      <BundleSection onAddBundle={handleAddBundle} />
      <section className="bg-[#f8f4ef] py-16">
        <Container>
          <div className="grid gap-5 rounded-[2rem] border border-[#eadfd6] bg-white p-6 shadow-soft md:grid-cols-4">
            {['Authentic salon products', 'Salon pickup available', 'Expert recommended', 'Secure checkout'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#edf1ea] text-[#4f664f]">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-extrabold text-[#241915]">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <MobileFilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterPanel filters={filters} onChange={setFilters} brands={brands} className="border-0 shadow-none" />
      </MobileFilterDrawer>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            added={addedIds.has(quickViewProduct.id)}
          />
        )}
      </AnimatePresence>
      <CartNotice notice={notice} onClose={() => setNotice(null)} />
    </div>
  )
}

export default Products
