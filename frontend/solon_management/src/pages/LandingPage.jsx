import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection.jsx'
import PromoBannerStrip from '../components/landing/PromoBannerStrip.jsx'
import FeaturesSection from '../components/landing/FeaturesSection.jsx'
import GalleryPreviewSection from '../components/landing/GalleryPreviewSection.jsx'
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx'
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection.jsx'
import AnalyticsSection from '../components/landing/AnalyticsSection.jsx'
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx'
import PricingSection from '../components/landing/PricingSection.jsx'
import FAQSection from '../components/landing/FAQSection.jsx'
import CTASection from '../components/landing/CTASection.jsx'

function LandingPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined

    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash])

  return (
    <>
      <HeroSection />
      <PromoBannerStrip />
      <FeaturesSection />
      <GalleryPreviewSection />
      <HowItWorksSection />
      <DashboardPreviewSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  )
}

export default LandingPage
