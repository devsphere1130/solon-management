import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, PackagePlus, RotateCcw, Save, Trash2, Upload } from 'lucide-react'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import ImageUploader from '../../components/common/ImageUploader.jsx'
import { productCategories, products as seedProducts } from '../../data/products.js'
import { useProductCatalog } from '../../context/useProductCatalog.js'
import { formatFileSize, readModelFile, resizeImageFile } from '../../lib/imageStorage.js'
import { cn } from '../../lib/cn.js'

const editableCategories = productCategories.filter((category) => category.id !== 'all').map((category) => category.label)
const audienceOptions = ['Unisex', 'Women', 'Men']
const defaultProduct = seedProducts[0]

function cloneProduct(product) {
  return JSON.parse(JSON.stringify(product))
}

function createBlankProduct() {
  const timestamp = Date.now()

  return {
    ...cloneProduct(defaultProduct),
    id: `custom-product-${timestamp}`,
    name: 'New Salon Product',
    brand: 'Salon Collection',
    category: 'Hair Care',
    audience: 'Unisex',
    price: 999,
    originalPrice: 1299,
    rating: 4.5,
    reviewCount: 0,
    stock: 10,
    badge: 'New',
    isBestSeller: false,
    isRecommended: true,
    isNew: true,
    description: 'Describe the product benefit, ideal customer, and why the salon recommends it.',
    benefits: ['Salon expert recommended', 'Professional finish', 'Easy at-home routine'],
    howToUse: ['Use as directed by your salon expert'],
    ingredients: ['Salon-grade formula'],
    variants: [{ name: 'Standard', price: 999 }],
    routineProductIds: [],
    model3d: null,
    isCustom: true,
  }
}

function imageToUploaderImage(image) {
  if (!image?.src) return null

  return {
    dataUrl: image.src,
    fileName: image.fileName || 'Product image',
    fileSize: image.fileSize || 0,
    mimeType: image.mimeType || 'image/jpeg',
  }
}

function listToText(items) {
  return (items ?? []).join('\n')
}

function textToList(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function variantsToText(variants) {
  return (variants ?? []).map((variant) => `${variant.name} | ${variant.price}`).join('\n')
}

function textToVariants(value, fallbackPrice) {
  const variants = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, price] = line.split('|').map((item) => item.trim())
      return { name: name || 'Standard', price: Number(price) || fallbackPrice }
    })

  return variants.length ? variants : [{ name: 'Standard', price: fallbackPrice }]
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text outline-none transition-colors focus:border-primary',
        props.className,
      )}
    />
  )
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-28 w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold leading-6 text-text outline-none transition-colors focus:border-primary',
        props.className,
      )}
    />
  )
}

function Select(props) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text outline-none transition-colors focus:border-primary"
    />
  )
}

function ModelUploader({ model, onUpload, onRemove }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setError('')
    setIsUploading(true)

    try {
      const record = await readModelFile(file)
      onUpload(record)
    } catch (err) {
      setError(err.message || 'Model upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold text-text">3D product model</p>
      <p className="mt-0.5 text-xs text-text-muted">Upload a real .glb or .gltf model. The public page will mark the product as 360-ready.</p>

      <div className="mt-2 rounded-xl border border-border bg-background p-4">
        {model ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Box className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{model.fileName}</p>
                <p className="text-xs text-text-muted">{formatFileSize(model.fileSize)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-text-muted hover:text-text"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-danger hover:bg-danger/5"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Upload className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold">{isUploading ? 'Reading model...' : 'Upload .glb or .gltf model'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {error && <p className="mt-1.5 text-xs font-semibold text-danger">{error}</p>}
    </div>
  )
}

function ProductCardPreview({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative aspect-square bg-background p-5">
        <img src={product.images?.[0]?.src} alt="" className="size-full object-contain" />
        {product.badge && <Badge className="absolute right-3 top-3 bg-secondary text-white">{product.badge}</Badge>}
      </div>
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{product.brand}</p>
        <p className="mt-1 line-clamp-2 text-sm font-extrabold text-text">{product.name}</p>
        <p className="mt-2 text-lg font-extrabold text-text">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
        <p className="mt-1 text-xs text-text-muted">{product.category} / {product.audience}</p>
      </div>
    </div>
  )
}

function ProductManagement() {
  const {
    products,
    error,
    saveProduct,
    resetProduct,
    deleteProduct,
    hasProductOverride,
    isCustomProduct,
  } = useProductCatalog()
  const [selectedId, setSelectedId] = useState(products[0]?.id)
  const selectedProduct = products.find((product) => product.id === selectedId)
  const [draft, setDraft] = useState(() => cloneProduct(selectedProduct ?? createBlankProduct()))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (selectedProduct) {
      setDraft(cloneProduct(selectedProduct))
    }
  }, [selectedProduct])

  const stats = useMemo(
    () => ({
      total: products.length,
      custom: products.filter((product) => isCustomProduct(product.id)).length,
      withModel: products.filter((product) => product.model3d).length,
    }),
    [products, isCustomProduct],
  )

  function updateDraft(key, value) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updateExpert(key, value) {
    setDraft((current) => ({ ...current, expert: { ...current.expert, [key]: value } }))
  }

  async function handleImageUpload(index, file) {
    const record = await resizeImageFile(file, { maxWidth: 1200, quality: 0.8 })
    setDraft((current) => {
      const images = [...(current.images ?? [])]
      images[index] = {
        src: record.dataUrl,
        alt: `${current.name} product image`,
        fileName: record.fileName,
        fileSize: record.fileSize,
        mimeType: record.mimeType,
      }
      return { ...current, images }
    })
  }

  async function handleAddImage(file) {
    const record = await resizeImageFile(file, { maxWidth: 1200, quality: 0.8 })
    setDraft((current) => ({
      ...current,
      images: [
        ...(current.images ?? []),
        {
          src: record.dataUrl,
          alt: `${current.name} product image`,
          fileName: record.fileName,
          fileSize: record.fileSize,
          mimeType: record.mimeType,
        },
      ],
    }))
  }

  function handleRemoveImage(index) {
    setDraft((current) => {
      const images = [...(current.images ?? [])]
      images.splice(index, 1)
      return { ...current, images: images.length ? images : cloneProduct(defaultProduct).images }
    })
  }

  function handleSave() {
    const productToSave = {
      ...draft,
      price: Number(draft.price) || 0,
      originalPrice: Number(draft.originalPrice) || Number(draft.price) || 0,
      rating: Number(draft.rating) || 0,
      reviewCount: Number(draft.reviewCount) || 0,
      stock: Number(draft.stock) || 0,
      benefits: textToList(draft.benefitsText ?? listToText(draft.benefits)),
      howToUse: textToList(draft.howToUseText ?? listToText(draft.howToUse)),
      ingredients: textToList(draft.ingredientsText ?? listToText(draft.ingredients)),
      variants: textToVariants(draft.variantsText ?? variantsToText(draft.variants), Number(draft.price) || 0),
      routineProductIds: textToList(draft.routineProductIdsText ?? listToText(draft.routineProductIds)),
    }

    delete productToSave.benefitsText
    delete productToSave.howToUseText
    delete productToSave.ingredientsText
    delete productToSave.variantsText
    delete productToSave.routineProductIdsText

    const savedId = saveProduct(productToSave, selectedId)
    setSelectedId(savedId)
    setNotice('Product saved. Public shop updated.')
    window.setTimeout(() => setNotice(''), 1800)
  }

  function handleNewProduct() {
    const product = createBlankProduct()
    setSelectedId(product.id)
    setDraft(product)
  }

  function handleReset() {
    resetProduct(selectedId)
    setNotice('Product reset to default.')
    window.setTimeout(() => setNotice(''), 1800)
  }

  function handleDelete() {
    deleteProduct(selectedId)
    setSelectedId(products[0]?.id)
    setNotice('Custom product deleted.')
    window.setTimeout(() => setNotice(''), 1800)
  }

  const canReset = selectedId && hasProductOverride(selectedId)
  const canDelete = selectedId && isCustomProduct(selectedId)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge>
              <PackagePlus className="size-3.5" aria-hidden="true" />
              Products
            </Badge>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Product catalog manager</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Add products, edit card details, update pricing, upload gallery images, and attach real 3D model files.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-background p-3 text-center">
            <div>
              <p className="text-xl font-extrabold text-text">{stats.total}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Products</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-text">{stats.custom}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">Custom</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-text">{stats.withModel}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">3D</p>
            </div>
          </div>
        </div>
      </div>

      {(error || notice) && (
        <p className={cn('rounded-xl border px-4 py-3 text-sm font-semibold', error ? 'border-danger/30 bg-danger/5 text-danger' : 'border-success/30 bg-success/5 text-success')}>
          {error || notice}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-text">Catalog</h2>
            <Button type="button" size="sm" onClick={handleNewProduct}>
              Add
            </Button>
          </div>
          <div className="max-h-[42rem] space-y-2 overflow-y-auto pr-1">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedId(product.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors',
                  selectedId === product.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-background',
                )}
              >
                <img src={product.images?.[0]?.src} alt="" className="size-12 rounded-lg bg-background object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-text">{product.name}</span>
                  <span className="block truncate text-xs text-text-muted">{product.brand}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-extrabold text-text">Product details</h2>
                  <p className="mt-1 text-xs text-text-muted">These fields feed the public product card and detail page.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canReset && (
                    <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="size-4" aria-hidden="true" />
                      Reset
                    </Button>
                  )}
                  {canDelete && (
                    <Button type="button" variant="outline" size="sm" className="text-danger" onClick={handleDelete}>
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  )}
                  <Button type="button" size="sm" onClick={handleSave}>
                    <Save className="size-4" aria-hidden="true" />
                    Save Product
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Product name">
                  <TextInput value={draft.name ?? ''} onChange={(event) => updateDraft('name', event.target.value)} />
                </Field>
                <Field label="Brand">
                  <TextInput value={draft.brand ?? ''} onChange={(event) => updateDraft('brand', event.target.value)} />
                </Field>
                <Field label="Category">
                  <Select value={draft.category ?? 'Hair Care'} onChange={(event) => updateDraft('category', event.target.value)}>
                    {editableCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Audience">
                  <Select value={draft.audience ?? 'Unisex'} onChange={(event) => updateDraft('audience', event.target.value)}>
                    {audienceOptions.map((audience) => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Current price">
                  <TextInput type="number" min="0" value={draft.price ?? 0} onChange={(event) => updateDraft('price', event.target.value)} />
                </Field>
                <Field label="Original price">
                  <TextInput type="number" min="0" value={draft.originalPrice ?? 0} onChange={(event) => updateDraft('originalPrice', event.target.value)} />
                </Field>
                <Field label="Stock">
                  <TextInput type="number" min="0" value={draft.stock ?? 0} onChange={(event) => updateDraft('stock', event.target.value)} />
                </Field>
                <Field label="Badge">
                  <TextInput value={draft.badge ?? ''} onChange={(event) => updateDraft('badge', event.target.value)} placeholder="Salon Pick, New, Best Seller" />
                </Field>
                <Field label="Rating">
                  <TextInput type="number" min="0" max="5" step="0.1" value={draft.rating ?? 0} onChange={(event) => updateDraft('rating', event.target.value)} />
                </Field>
                <Field label="Review count">
                  <TextInput type="number" min="0" value={draft.reviewCount ?? 0} onChange={(event) => updateDraft('reviewCount', event.target.value)} />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Description">
                  <TextArea value={draft.description ?? ''} onChange={(event) => updateDraft('description', event.target.value)} />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-base font-extrabold text-text">Images and 3D</h2>
              <p className="mt-1 text-xs text-text-muted">First image is used as the product card image. Second image is used for hover/lifestyle preview.</p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {(draft.images ?? []).map((image, index) => (
                  <ImageUploader
                    key={`${image.src}-${index}`}
                    label={index === 0 ? 'Primary card image' : `Gallery image ${index + 1}`}
                    description={index === 0 ? 'Shown on product cards and detail page.' : 'Shown in gallery and hover previews.'}
                    image={imageToUploaderImage(image)}
                    aspect="square"
                    onUpload={(file) => handleImageUpload(index, file)}
                    onRemove={() => handleRemoveImage(index)}
                  />
                ))}
                <ImageUploader
                  label="Add gallery image"
                  description="Add another product image."
                  image={null}
                  aspect="square"
                  onUpload={handleAddImage}
                  onRemove={() => {}}
                />
              </div>

              <div className="mt-6">
                <ModelUploader
                  model={draft.model3d}
                  onUpload={(record) => updateDraft('model3d', record)}
                  onRemove={() => updateDraft('model3d', null)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-base font-extrabold text-text">Product content</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Benefits">
                  <TextArea
                    value={draft.benefitsText ?? listToText(draft.benefits)}
                    onChange={(event) => updateDraft('benefitsText', event.target.value)}
                    placeholder="One benefit per line"
                  />
                </Field>
                <Field label="How to use">
                  <TextArea
                    value={draft.howToUseText ?? listToText(draft.howToUse)}
                    onChange={(event) => updateDraft('howToUseText', event.target.value)}
                    placeholder="One step per line"
                  />
                </Field>
                <Field label="Ingredients">
                  <TextArea
                    value={draft.ingredientsText ?? listToText(draft.ingredients)}
                    onChange={(event) => updateDraft('ingredientsText', event.target.value)}
                    placeholder="One ingredient per line"
                  />
                </Field>
                <Field label="Variants">
                  <TextArea
                    value={draft.variantsText ?? variantsToText(draft.variants)}
                    onChange={(event) => updateDraft('variantsText', event.target.value)}
                    placeholder="250ml | 699"
                  />
                </Field>
                <Field label="Paired salon service">
                  <TextInput value={draft.pairedService ?? ''} onChange={(event) => updateDraft('pairedService', event.target.value)} />
                </Field>
                <Field label="Routine product IDs">
                  <TextArea
                    value={draft.routineProductIdsText ?? listToText(draft.routineProductIds)}
                    onChange={(event) => updateDraft('routineProductIdsText', event.target.value)}
                    placeholder="repair-shampoo&#10;keratin-mask"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-base font-extrabold text-text">Salon expert recommendation</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Expert name">
                  <TextInput value={draft.expert?.name ?? ''} onChange={(event) => updateExpert('name', event.target.value)} />
                </Field>
                <Field label="Expert role">
                  <TextInput value={draft.expert?.role ?? ''} onChange={(event) => updateExpert('role', event.target.value)} />
                </Field>
                <Field label="Expert quote">
                  <TextArea value={draft.expert?.quote ?? ''} onChange={(event) => updateExpert('quote', event.target.value)} />
                </Field>
                <Field label="Expert image URL">
                  <TextInput value={draft.expert?.avatar ?? ''} onChange={(event) => updateExpert('avatar', event.target.value)} />
                </Field>
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <ProductCardPreview product={draft} />
            <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h2 className="text-sm font-extrabold text-text">Admin notes</h2>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-text-muted">
                <li>Save updates the public Products page immediately in this browser.</li>
                <li>Use square transparent product photos when possible.</li>
                <li>3D upload stores real model files; rendering can be connected to Three.js or model-viewer later.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default ProductManagement
