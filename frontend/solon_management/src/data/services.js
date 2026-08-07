export const serviceCategories = [
  'All Services',
  'Hair',
  'Hair Styling',
  'Makeup',
  'Facial',
  'Skin Care',
  'Nails',
  'Spa',
  'Bridal',
  'Packages',
]

const imageParams = 'auto=format&fit=crop&w=1200&q=82'

export const salonServices = [
  {
    id: 'signature-cut',
    name: 'Signature Cut & Styling',
    category: 'Hair',
    highlight: 'Signature',
    price: 799,
    duration: '45 min',
    description: 'Precision haircut, cleanse, blow-dry, and finish tailored to your face shape and daily routine.',
    fullDescription:
      'A consult-led haircut experience with a refreshing cleanse, precision shaping, thermal protection, and a polished finish that works beyond the salon chair.',
    benefits: ['Face-shape consultation', 'Luxury cleanse', 'Heat-protect finish', 'At-home styling plan'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1560066984-138dadb4c035?${imageParams}`,
        alt: 'Stylist blow drying hair in a bright salon',
      },
      {
        src: `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?${imageParams}`,
        alt: 'Salon stylist preparing long hair for a haircut',
      },
      {
        src: `https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?${imageParams}`,
        alt: 'Premium salon interior with styling chairs',
      },
      {
        src: `https://images.unsplash.com/photo-1519699047748-de8e457a634e?${imageParams}`,
        alt: 'Finished styled hair with soft waves',
      },
    ],
  },
  {
    id: 'glass-hair-ritual',
    name: 'Glass Hair Ritual',
    category: 'Hair Styling',
    highlight: 'High gloss',
    price: 1299,
    duration: '60 min',
    description: 'Smoothing, glossing, and mirror-shine styling for sleek hair with movement and softness.',
    fullDescription:
      'A gloss-focused styling ritual designed for events, shoots, and elevated everyday polish. The service includes smoothing prep, shine infusion, and a long-wear finish.',
    benefits: ['Frizz-control prep', 'Gloss infusion', 'Sleek finish', 'Humidity-aware styling'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1523263685509-57c1d050d19b?${imageParams}`,
        alt: 'Stylist smoothing long brunette hair',
      },
      {
        src: `https://images.unsplash.com/photo-1522336572468-97b06e8ef143?${imageParams}`,
        alt: 'Hair styling tools arranged on a salon counter',
      },
      {
        src: `https://images.unsplash.com/photo-1595475038665-8fdf4c599f5f?${imageParams}`,
        alt: 'Polished hairstyle with glossy finish',
      },
    ],
  },
  {
    id: 'soft-glam-makeup',
    name: 'Soft Glam Makeup',
    category: 'Makeup',
    highlight: 'Event ready',
    price: 2199,
    duration: '75 min',
    description: 'Radiant complexion, defined eyes, and camera-ready color for dinners, parties, and portraits.',
    fullDescription:
      'A refined makeup session focused on glowing skin, soft definition, and comfortable long wear. Includes skin prep, base, eyes, lips, and setting.',
    benefits: ['Skin prep included', 'Custom complexion match', 'Photo-friendly finish', 'Transfer-aware setting'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?${imageParams}`,
        alt: 'Makeup artist applying eye makeup',
      },
      {
        src: `https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?${imageParams}`,
        alt: 'Makeup brushes and cosmetics on a beauty table',
      },
      {
        src: `https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?${imageParams}`,
        alt: 'Luxury makeup products arranged neatly',
      },
    ],
  },
  {
    id: 'hydrating-facial',
    name: 'Hydra Bloom Facial',
    category: 'Facial',
    highlight: 'Deep hydration',
    price: 1499,
    duration: '50 min',
    description: 'Deep hydration facial with cleansing, exfoliation, mask therapy, and calming facial massage.',
    fullDescription:
      'A glow-restoring facial for dehydrated and tired skin. The treatment combines gentle exfoliation, hydration layering, mask therapy, and a calming massage.',
    benefits: ['Hydrating cleanse', 'Gentle exfoliation', 'Massage therapy', 'Soothing mask finish'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?${imageParams}`,
        alt: 'Client receiving a relaxing facial treatment',
      },
      {
        src: `https://images.unsplash.com/photo-1519823551278-64ac92734fb1?${imageParams}`,
        alt: 'Spa therapist applying skincare treatment',
      },
      {
        src: `https://images.unsplash.com/photo-1596755389378-c31d21fd1273?${imageParams}`,
        alt: 'Skincare products beside soft towels',
      },
    ],
  },
  {
    id: 'derma-bright',
    name: 'Derma Bright Skin Care',
    category: 'Skin Care',
    highlight: 'Brightening',
    price: 1899,
    duration: '65 min',
    description: 'Brightening skin ritual that targets dullness with exfoliation, serum infusion, and SPF finish.',
    fullDescription:
      'A targeted skin-care appointment for uneven tone and dull texture. The ritual layers active brightening care with barrier support for a healthy finish.',
    benefits: ['Tone review', 'Active serum layer', 'Barrier support', 'SPF finish'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1556228720-195a672e8a03?${imageParams}`,
        alt: 'Premium skincare bottles arranged on a counter',
      },
      {
        src: `https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?${imageParams}`,
        alt: 'Skincare serum being applied during a treatment',
      },
      {
        src: `https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?${imageParams}`,
        alt: 'Minimal skincare products on a clean vanity',
      },
    ],
  },
  {
    id: 'atelier-manicure',
    name: 'Atelier Manicure',
    category: 'Nails',
    highlight: 'Detail finish',
    price: 999,
    duration: '55 min',
    description: 'Cuticle care, shaping, polish, and nourishing hand treatment with a high-gloss finish.',
    fullDescription:
      'A detail-focused manicure with careful nail shaping, cuticle refinement, polish, and a nourishing hand treatment for a clean editorial finish.',
    benefits: ['Nail shaping', 'Cuticle refinement', 'Polish finish', 'Hand hydration'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1519014816548-bf5fe059798b?${imageParams}`,
        alt: 'Manicure with glossy neutral nail polish',
      },
      {
        src: `https://images.unsplash.com/photo-1604654894610-df63bc536371?${imageParams}`,
        alt: 'Nail polish bottles arranged in a salon',
      },
      {
        src: `https://images.unsplash.com/photo-1610992015732-2449b76344bc?${imageParams}`,
        alt: 'Nail technician painting a client manicure',
      },
    ],
  },
  {
    id: 'aroma-spa',
    name: 'Aroma Spa Therapy',
    category: 'Spa',
    highlight: 'Restorative',
    price: 2499,
    duration: '90 min',
    description: 'A restorative spa session with aromatherapy, warm towels, and slow-release relaxation techniques.',
    fullDescription:
      'A calm, sensory spa experience designed to release tension and reset the body. Includes aromatherapy, pressure-point relaxation, and a warm towel close.',
    benefits: ['Aromatherapy blend', 'Pressure-point work', 'Warm towel finish', 'Recovery tea'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1540555700478-4be289fbecef?${imageParams}`,
        alt: 'Spa stones, towel, and candle in a treatment room',
      },
      {
        src: `https://images.unsplash.com/photo-1515377905703-c4788e51af15?${imageParams}`,
        alt: 'Spa therapist preparing a relaxing massage treatment',
      },
      {
        src: `https://images.unsplash.com/photo-1600334129128-685c5582fd35?${imageParams}`,
        alt: 'Calm spa room with warm lighting',
      },
    ],
  },
  {
    id: 'bridal-luxe',
    name: 'Bridal Luxe Suite',
    category: 'Bridal',
    highlight: 'Premium suite',
    price: 8999,
    duration: '3 hr',
    description: 'Complete bridal beauty with hair, makeup, draping assistance, and final touch-up kit.',
    fullDescription:
      'A premium bridal appointment planned around the event timeline. Includes skin prep, bridal makeup, hair styling, draping support, and touch-up essentials.',
    benefits: ['Pre-look consultation', 'Bridal makeup', 'Hair styling', 'Touch-up kit'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1525258946800-98cfd641d0de?${imageParams}`,
        alt: 'Bride with elegant hair and makeup styling',
      },
      {
        src: `https://images.unsplash.com/photo-1519741497674-611481863552?${imageParams}`,
        alt: 'Bridal styling details with veil and soft light',
      },
      {
        src: `https://images.unsplash.com/photo-1523438885200-e635ba2c371e?${imageParams}`,
        alt: 'Wedding makeup preparation on a vanity',
      },
    ],
  },
  {
    id: 'glow-day-package',
    name: 'Glow Day Package',
    category: 'Packages',
    highlight: 'Best value',
    price: 3999,
    duration: '2 hr 30 min',
    description: 'A bundled refresh with hair spa, express facial, manicure, and soft finish styling.',
    fullDescription:
      'A complete beauty reset for days when you want everything to feel considered. The package brings hair, skin, nails, and styling into one appointment.',
    benefits: ['Bundled savings', 'Hair spa refresh', 'Express facial', 'Manicure included'],
    images: [
      {
        src: `https://images.unsplash.com/photo-1522337660859-02fbefca4702?${imageParams}`,
        alt: 'Salon team preparing a beauty treatment station',
      },
      {
        src: `https://images.unsplash.com/photo-1512496015851-a90fb38ba796?${imageParams}`,
        alt: 'Beauty products and brushes arranged for a package service',
      },
      {
        src: `https://images.unsplash.com/photo-1607008829749-c0f284a498a3?${imageParams}`,
        alt: 'Premium salon treatment room prepared for a client',
      },
    ],
  },
]
