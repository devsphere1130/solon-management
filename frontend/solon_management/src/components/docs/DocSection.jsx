import { motion } from 'motion/react'
import Accordion from '../common/Accordion.jsx'
import { Callout, CardsGrid, ClosingBanner, DataTable, Flow, NoteStrip, RoleBadge, Steps } from './DocBlocks.jsx'

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-[15px] leading-relaxed text-text-muted">{block.text}</p>
    case 'h3':
      return <h3 className="mt-2 text-base font-extrabold text-text">{block.text}</h3>
    case 'list':
      return (
        <ul className="space-y-1.5 pl-5 text-[15px] leading-relaxed text-text-muted marker:text-accent">
          {block.items.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <Callout variant={block.variant} label={block.label}>
          {block.text}
        </Callout>
      )
    case 'steps':
      return <Steps items={block.items} />
    case 'cards':
      return <CardsGrid items={block.items} />
    case 'table':
      return <DataTable headers={block.headers} rows={block.rows} />
    case 'flow':
      return <Flow items={block.items} />
    case 'note':
      return <NoteStrip>{block.text}</NoteStrip>
    case 'faq':
      return <Accordion items={block.items} />
    case 'closing':
      return <ClosingBanner big={block.big} sub={block.sub} tagline={block.tagline} />
    default:
      return null
  }
}

function DocSection({ index, section }) {
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="border-t border-border py-12 first:border-none first:pt-0"
    >
      <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-accent uppercase">
        <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
        <span>{section.eyebrow}</span>
      </div>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">{section.title}</h2>
      {section.role && <RoleBadge>{section.role}</RoleBadge>}
      {section.lede && <p className="mt-3 max-w-2xl text-base text-text-muted">{section.lede}</p>}

      <div className="mt-6 space-y-5">
        {section.blocks.map((block, blockIndex) => (
          <Block key={blockIndex} block={block} />
        ))}
      </div>
    </motion.section>
  )
}

export default DocSection
