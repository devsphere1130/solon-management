import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import Container from '../common/Container.jsx'
import SectionHeading from './SectionHeading.jsx'
import Button from '../common/Button.jsx'
import { buttonClasses } from '../../lib/buttonClasses.js'
import { cn } from '../../lib/cn.js'
import { pricingPlans } from '../../data/landingContent.js'
import { ROUTE_PATHS } from '../../routes/routeConfig.js'

function PricingSection() {
  return (
    <section id="pricing" className="bg-surface py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing that scales with you"
          description="Start free for 14 days. No credit card required, cancel anytime."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={cn(
                'relative flex flex-col rounded-3xl border p-8',
                plan.highlighted ? 'border-primary bg-secondary text-white shadow-2xl lg:-translate-y-3' : 'border-border bg-card shadow-soft',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
                  Most popular
                </span>
              )}

              <h3 className={cn('text-lg font-bold', plan.highlighted ? 'text-white' : 'text-text')}>{plan.name}</h3>
              <p className={cn('mt-2 text-sm', plan.highlighted ? 'text-white/70' : 'text-text-muted')}>{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className={cn('text-4xl font-extrabold tracking-tight', plan.highlighted ? 'text-white' : 'text-text')}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn('text-sm', plan.highlighted ? 'text-white/60' : 'text-text-muted')}>{plan.period}</span>
                )}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn('mt-0.5 size-4 shrink-0', plan.highlighted ? 'text-accent' : 'text-primary')}
                      aria-hidden="true"
                    />
                    <span className={plan.highlighted ? 'text-white/85' : 'text-text-muted'}>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.cta === 'Start free trial' ? (
                <Link
                  to={ROUTE_PATHS.login}
                  className={buttonClasses({
                    variant: plan.highlighted ? 'accent' : 'outline',
                    className: cn('mt-8 w-full', !plan.highlighted && 'border-border'),
                  })}
                >
                  {plan.cta}
                </Link>
              ) : (
                <Button
                  variant={plan.highlighted ? 'accent' : 'outline'}
                  className={cn('mt-8 w-full', !plan.highlighted && 'border-border')}
                >
                  {plan.cta}
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default PricingSection
