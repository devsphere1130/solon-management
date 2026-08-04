import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  Check,
  Heart,
  Image as ImageIcon,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react'
import Badge from '../components/common/Badge.jsx'
import Button from '../components/common/Button.jsx'
import Container from '../components/common/Container.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import { buttonClasses } from '../lib/buttonClasses.js'
import { cn } from '../lib/cn.js'
import { useProductCatalog } from '../context/useProductCatalog.js'
import { useCart } from '../context/useCart.js'
import { useWishlist } from '../context/useWishlist.js'
import { ROUTE_PATHS } from '../routes/routeConfig.js'

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const infoTabs = ['Overview', 'Benefits', 'How to Use', 'Ingredients', 'Reviews']

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

function Rating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-[#6d5c52]">
      <span className="flex items-center gap-0.5 text-[#b98238]" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className={cn('size-4', index < Math.round(rating) && 'fill-current')} aria-hidden="true" />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      <span className="text-[#9a8b82]">({reviewCount} reviews)</span>
    </div>
  )
}

function ProductGallery({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const selectedImage = product.images[selectedIndex] ?? product.images[0]

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[5.75rem_minmax(0,1fr)]">
        <div className="premium-scrollbar order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[34rem] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pr-1">
          {product.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show ${product.name} image ${index + 1}`}
              className={cn(
                'size-20 shrink-0 overflow-hidden rounded-2xl border bg-[#f4ece5] p-2 transition-all',
                selectedIndex === index ? 'border-[#9b5639] shadow-[0_0_0_3px_rgba(155,86,57,0.16)]' : 'border-[#eadfd6]',
              )}
            >
              <ImageWithFallback src={image.src} alt="" className="size-full object-contain" />
            </button>
          ))}
        </div>

        <div className="relative order-1 aspect-square overflow-hidden rounded-[1.75rem] border border-[#eadfd6] bg-[linear-gradient(145deg,#fbf4ee,#ece1d8)] p-8 shadow-soft lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="size-full"
            >
              <ImageWithFallback src={selectedImage.src} alt={selectedImage.alt} className="size-full object-contain" />
            </motion.div>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            aria-label="Open product image fullscreen"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/90 text-[#241915] shadow-soft"
          >
            <Maximize2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#eadfd6] bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#edf1ea] text-[#4f664f]">
            <RotateCcw className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[#241915]">
              {product.model3d ? '360 model attached' : 'Image gallery fallback'}
            </p>
            <p className="text-xs text-[#7b6b62]">
              {product.model3d
                ? `${product.model3d.fileName} is ready for a product viewer integration.`
                : '360 view appears only when a real product model is available.'}
            </p>
          </div>
          {product.model3d && (
            <a
              href={product.model3d.dataUrl}
              download={product.model3d.fileName}
              className="ml-auto rounded-full border border-[#eadfd6] px-3 py-2 text-xs font-extrabold text-[#241915]"
            >
              Open Model
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#191716]/88 p-6"
          >
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen image"
              className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-white text-[#241915]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <ImageWithFallback src={selectedImage.src} alt={selectedImage.alt} className="max-h-[84vh] max-w-[92vw] object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductInformation({ product, onAddToCart }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.name ?? '')
  const [quantity, setQuantity] = useState(1)
  const { isSaved, toggleItem: toggleWishlist } = useWishlist()
  const [added, setAdded] = useState(false)
  const selectedVariantRecord = product.variants.find((variant) => variant.name === selectedVariant)
  const wishlist = isSaved(product.id)

  function handleAdd() {
    setAdded(true)
    onAddToCart(product, quantity, selectedVariant)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <aside className="rounded-[1.75rem] border border-[#eadfd6] bg-white p-6 shadow-soft lg:p-8">
      <div className="flex flex-wrap items-center gap-3">
        {product.badge && <Badge className="bg-[#fff1e8] text-[#9b5639]">{product.badge}</Badge>}
        <span className="rounded-full bg-[#edf1ea] px-3 py-1 text-xs font-extrabold text-[#4f664f]">
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">{product.brand}</p>
      <h1 className="mt-2 text-4xl font-extrabold leading-tight text-[#241915]">{product.name}</h1>
      <div className="mt-4">
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <span className="text-4xl font-extrabold text-[#9b5639]">
          {formatPrice(selectedVariantRecord?.price ?? product.price)}
        </span>
        <span className="text-lg font-bold text-[#9a8b82] line-through">{formatPrice(product.originalPrice)}</span>
      </div>
      <p className="mt-4 text-base leading-7 text-[#6f5f57]">{product.description}</p>

      <div className="mt-7">
        <p className="text-sm font-extrabold text-[#241915]">Size / Variant</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.name}
              type="button"
              onClick={() => setSelectedVariant(variant.name)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-bold',
                selectedVariant === variant.name ? 'border-[#9b5639] bg-[#fff1e8] text-[#241915]' : 'border-[#eadfd6] text-[#6f5f57]',
              )}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <span className="text-sm font-extrabold text-[#241915]">Quantity</span>
        <div className="inline-flex items-center rounded-full border border-[#eadfd6] bg-[#fffaf7]">
          <button type="button" aria-label="Decrease quantity" className="px-4 py-2" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-sm font-extrabold">{quantity}</span>
          <button type="button" aria-label="Increase quantity" className="px-4 py-2" onClick={() => setQuantity((value) => value + 1)}>
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <Button type="button" size="lg" className={cn('bg-[#241915] hover:bg-[#3a2b24]', added && 'bg-[#4f664f]')} onClick={handleAdd}>
          {added ? 'Added' : 'Add to Cart'}
          <ShoppingBag className="size-4" aria-hidden="true" />
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={cn(
            'flex h-13 items-center justify-center gap-2 rounded-full border border-[#eadfd6] px-5 text-sm font-extrabold text-[#241915]',
            wishlist && 'border-[#9b5639] bg-[#fff1e8] text-[#9b5639]',
          )}
        >
          <Heart className={cn('size-4', wishlist && 'fill-current')} aria-hidden="true" />
          Wishlist
        </button>
      </div>

      <Button type="button" size="lg" variant="accent" className="mt-3 w-full bg-[#d7b48c] text-[#241915] hover:bg-[#e8c79e]">
        Buy Now
      </Button>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {[
          ['Authentic products', ShieldCheck],
          ['Salon pickup available', ShoppingBag],
          ['Secure checkout', ShieldCheck],
          ['Fast local delivery', Truck],
        ].map(([label, Icon]) => (
          <div key={label} className="flex items-center gap-2 rounded-2xl bg-[#fffaf7] px-3 py-3 text-sm font-bold text-[#5f4f47]">
            <Icon className="size-4 text-[#4f664f]" aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>
    </aside>
  )
}

function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState(infoTabs[0])

  const content = {
    Overview: <p className="text-sm leading-7 text-[#6f5f57]">{product.description}</p>,
    Benefits: (
      <ul className="grid gap-3 sm:grid-cols-2">
        {product.benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3 text-sm font-bold text-[#241915]">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf1ea] text-[#4f664f]">
              <Check className="size-4" aria-hidden="true" />
            </span>
            {benefit}
          </li>
        ))}
      </ul>
    ),
    'How to Use': (
      <ol className="grid gap-3">
        {product.howToUse.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm font-bold text-[#241915]">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-xs text-[#9b5639]">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    ),
    Ingredients: (
      <div className="flex flex-wrap gap-2">
        {product.ingredients.map((ingredient) => (
          <span key={ingredient} className="rounded-full border border-[#eadfd6] px-3 py-1.5 text-sm font-bold text-[#5f4f47]">
            {ingredient}
          </span>
        ))}
      </div>
    ),
    Reviews: (
      <div className="grid gap-4 md:grid-cols-2">
        {['Beautiful finish and very salon-like.', 'My stylist recommended it and it works well at home.'].map((review) => (
          <blockquote key={review} className="rounded-2xl bg-[#fffaf7] p-4 text-sm font-semibold leading-6 text-[#5f4f47]">
            "{review}"
          </blockquote>
        ))}
      </div>
    ),
  }

  return (
    <section className="rounded-[1.75rem] border border-[#eadfd6] bg-white p-5 shadow-soft sm:p-6">
      <div className="premium-scrollbar flex gap-2 overflow-x-auto pb-2">
        {infoTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-extrabold',
              activeTab === tab ? 'border-[#9b5639] bg-[#9b5639] text-white' : 'border-[#eadfd6] text-[#6f5f57]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-5">{content[activeTab]}</div>
    </section>
  )
}

function ExpertRecommendation({ product }) {
  return (
    <section className="rounded-[1.75rem] border border-[#eadfd6] bg-[#241915] p-6 text-white shadow-soft">
      <Badge className="border border-white/18 bg-white/12 text-white">Salon Expert Pick</Badge>
      <blockquote className="mt-5 text-2xl font-extrabold leading-snug">"{product.expert.quote}"</blockquote>
      <div className="mt-6 flex items-center gap-3">
        <ImageWithFallback src={product.expert.avatar} alt={product.expert.name} className="size-12 rounded-full object-cover" />
        <div>
          <p className="text-sm font-extrabold">{product.expert.name}</p>
          <p className="text-xs font-bold text-white/62">{product.expert.role}</p>
        </div>
      </div>
    </section>
  )
}

function MiniProductCard({ product }) {
  return (
    <Link to={`${ROUTE_PATHS.products}/${product.id}`} className="group grid grid-cols-[5rem_1fr] gap-3 rounded-2xl border border-[#eadfd6] bg-white p-3 shadow-soft">
      <div className="aspect-square overflow-hidden rounded-xl bg-[#f4ece5] p-2">
        <ImageWithFallback src={product.images[0].src} alt="" className="size-full object-contain transition-transform group-hover:scale-105" />
      </div>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#9b5639]">{product.brand}</p>
        <p className="mt-1 line-clamp-2 text-sm font-extrabold text-[#241915]">{product.name}</p>
        <p className="mt-2 text-sm font-extrabold text-[#9b5639]">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

function RoutineSection({ product, routineProducts, onAddRoutine }) {
  if (routineProducts.length === 0) return null

  const total = routineProducts.reduce((sum, item) => sum + item.price, 0)

  return (
    <section className="rounded-[1.75rem] border border-[#eadfd6] bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9b5639]">Complete Your Routine</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#241915]">Pairs with {product.pairedService}</h2>
        </div>
        <Button type="button" className="bg-[#241915] hover:bg-[#3a2b24]" onClick={() => onAddRoutine(routineProducts)}>
          Add Routine to Cart
        </Button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {routineProducts.map((item) => (
          <MiniProductCard key={item.id} product={item} />
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-[#6f5f57]">Routine total: {formatPrice(total)}</p>
    </section>
  )
}

function ProductDetails() {
  const { productId } = useParams()
  const { products, getProductById, getProductsByIds } = useProductCatalog()
  const { addItem } = useCart()
  const product = getProductById(productId)
  const [cartNotice, setCartNotice] = useState('')

  const routineProducts = useMemo(() => (product ? getProductsByIds(product.routineProductIds) : []), [getProductsByIds, product])
  const relatedProducts = useMemo(
    () => (product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3) : []),
    [product, products],
  )

  if (!product) {
    return (
      <Container className="py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Product not found"
          description="The product you are looking for is no longer available."
          action={<Link to={ROUTE_PATHS.products} className={buttonClasses({ className: 'mt-2' })}>Back to Products</Link>}
        />
      </Container>
    )
  }

  function handleAddToCart(item, quantity = 1, variantName) {
    addItem(item, { quantity, variantName })
    setCartNotice(`${quantity} x ${item.name} added to cart`)
    window.setTimeout(() => setCartNotice(''), 1800)
  }

  function handleAddRoutine(items) {
    items.forEach((item) => addItem(item))
    setCartNotice(`${items.length} routine products added to cart`)
    window.setTimeout(() => setCartNotice(''), 1800)
  }

  return (
    <div className="bg-[#fffaf7] py-10 sm:py-14">
      <Container>
        <Link to={ROUTE_PATHS.products} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6f5f57] hover:text-[#241915]">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to products
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.78fr)] lg:items-start">
          <ProductGallery product={product} />
          <ProductInformation product={product} onAddToCart={handleAddToCart} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-8">
            <ProductTabs product={product} />
            <RoutineSection product={product} routineProducts={routineProducts} onAddRoutine={handleAddRoutine} />
          </div>
          <div className="space-y-8">
            <ExpertRecommendation product={product} />
            {relatedProducts.length > 0 && (
              <section className="rounded-[1.75rem] border border-[#eadfd6] bg-white p-5 shadow-soft">
                <h2 className="text-lg font-extrabold text-[#241915]">Related products</h2>
                <div className="mt-4 grid gap-3">
                  {relatedProducts.map((item) => (
                    <MiniProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {cartNotice && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed right-4 bottom-4 z-50 rounded-2xl border border-[#eadfd6] bg-white p-4 text-sm font-extrabold text-[#241915] shadow-2xl"
          >
            {cartNotice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetails
