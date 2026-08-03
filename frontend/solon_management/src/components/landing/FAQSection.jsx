import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import Accordion from '../common/Accordion.jsx'
import { faqs } from '../../data/landingContent.js'

function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 rounded-2xl border border-border bg-card px-6 shadow-soft">
          <Accordion items={faqs} />
        </div>
      </Container>
    </section>
  )
}

export default FAQSection
