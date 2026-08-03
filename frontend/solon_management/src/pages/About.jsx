import Container from '../components/common/Container.jsx'
import Badge from '../components/common/Badge.jsx'
import { useLandingImages } from '../context/LandingImagesContext.jsx'
import { cn } from '../lib/cn.js'

function About() {
  const { images } = useLandingImages()
  const hasImage = Boolean(images.about)

  return (
    <Container as="section" className={cn('py-24', hasImage ? 'max-w-5xl' : 'max-w-3xl')}>
      <div className={cn(hasImage && 'grid items-center gap-12 lg:grid-cols-2')}>
        <div>
          <Badge>About DevSphere</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            Built for salons that run on precision
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-muted">
            DevSphere is a premium management platform for salons and spas — bringing appointments, customers, staff,
            billing and inventory into one calm, connected workspace so teams can spend less time on admin and more
            time delighting clients.
          </p>
        </div>
        {hasImage && (
          <img src={images.about.dataUrl} alt="" className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
        )}
      </div>
    </Container>
  )
}

export default About
