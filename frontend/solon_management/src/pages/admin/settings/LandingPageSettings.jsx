import { X } from 'lucide-react'
import ImageUploader from '../../../components/common/ImageUploader.jsx'
import { useLandingImages } from '../../../context/LandingImagesContext.jsx'
import { features } from '../../../data/landingContent.js'
import defaultBannerVideo from '../../../assets/videos/banner.mp4'
import defaultHeroImage from '../../../assets/img/hero.png'

const defaultBannerVideoPreview = { dataUrl: defaultBannerVideo, mimeType: 'video/mp4' }
const defaultHeroImagePreview = { dataUrl: defaultHeroImage, mimeType: 'image/png' }

function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-sm font-bold text-text">{title}</h2>
      {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}

function LandingPageSettings() {
  const { images, error, setImage, removeImage, setFeatureImage, removeFeatureImage, addBanner, removeBanner } =
    useLandingImages()

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{error}</p>
      )}

      <SettingsCard title="Hero" description="Shown at the top of the public landing page.">
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUploader
            label="Hero image"
            description="Replaces the product mockup panel. Defaults to hero.png until you upload your own."
            image={images.hero || (images.heroVideo ? null : defaultHeroImagePreview)}
            isDefault={!images.hero && !images.heroVideo}
            aspect="video"
            onUpload={(file) => setImage('hero', file)}
            onRemove={() => removeImage('hero')}
          />
          <ImageUploader
            label="Hero video"
            description="Autoplay looping video in the mockup's place (max 50MB). Takes priority over Hero image when both are set."
            image={images.heroVideo}
            accept="video/*"
            aspect="video"
            onUpload={(file) => setImage('heroVideo', file)}
            onRemove={() => removeImage('heroVideo')}
          />
          <ImageUploader
            label="Hero background"
            description="Full-bleed image behind the hero content."
            image={images.heroBackground}
            aspect="video"
            onUpload={(file) => setImage('heroBackground', file)}
            onRemove={() => removeImage('heroBackground')}
          />
          <ImageUploader
            label="Hero background video"
            description="Full-bleed looping video behind the hero content (max 50MB). Takes priority over Hero background when both are set. Defaults to banner.mp4 until you upload your own."
            image={images.heroBackgroundVideo || (images.heroBackground ? null : defaultBannerVideoPreview)}
            isDefault={!images.heroBackgroundVideo && !images.heroBackground}
            accept="video/*"
            aspect="video"
            onUpload={(file) => setImage('heroBackgroundVideo', file)}
            onRemove={() => removeImage('heroBackgroundVideo')}
          />
        </div>
      </SettingsCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <SettingsCard title="About page" description="Shown alongside the About page copy.">
          <ImageUploader
            image={images.about}
            aspect="square"
            onUpload={(file) => setImage('about', file)}
            onRemove={() => removeImage('about')}
          />
        </SettingsCard>

        <SettingsCard title="Call to action" description="Background for the closing CTA banner.">
          <ImageUploader
            image={images.cta}
            aspect="wide"
            onUpload={(file) => setImage('cta', file)}
            onRemove={() => removeImage('cta')}
          />
        </SettingsCard>
      </div>

      <SettingsCard title="Feature images" description="Replaces each feature card's icon when set.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map((feature) => (
            <ImageUploader
              key={feature.title}
              label={feature.title}
              image={images.features[feature.title]}
              aspect="square"
              onUpload={(file) => setFeatureImage(feature.title, file)}
              onRemove={() => removeFeatureImage(feature.title)}
            />
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Promotional banners" description="Shown as a scrolling strip near the top of the landing page.">
        {images.banners.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-4">
            {images.banners.map((banner) => (
              <div key={banner.id} className="relative w-40 overflow-hidden rounded-xl border border-border">
                <img src={banner.dataUrl} alt="" className="aspect-video w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeBanner(banner.id)}
                  aria-label="Remove banner"
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImageUploader label="Add banner" image={null} aspect="wide" onUpload={addBanner} onRemove={() => {}} />
      </SettingsCard>
    </div>
  )
}

export default LandingPageSettings
