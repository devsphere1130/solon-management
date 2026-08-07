import { useLandingImages } from '../../context/LandingImagesContext.jsx'
import Container from '../common/Container.jsx'

function PromoBannerStrip() {
  const { images } = useLandingImages()

  if (images.banners.length === 0) {
    return null
  }

  return (
    <section className="border-b border-border bg-surface py-6">
      <Container>
        <div className="flex gap-4 overflow-x-auto">
          {images.banners.map((banner) => (
            <img
              key={banner.id}
              src={banner.dataUrl}
              alt=""
              className="h-32 w-auto shrink-0 rounded-2xl object-cover shadow-soft"
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default PromoBannerStrip
