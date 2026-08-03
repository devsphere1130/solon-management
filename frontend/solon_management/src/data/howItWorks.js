const imageParams = 'auto=format&fit=crop&w=1400&q=82'

export const audienceJourneys = [
  {
    label: 'Women',
    services: ['Hair Styling', 'Haircut', 'Facial', 'Makeup', 'Nails', 'Spa', 'Bridal Services'],
  },
  {
    label: 'Men',
    services: ['Haircut', 'Beard Styling', 'Grooming', 'Facial', 'Head Massage', 'Spa', 'Hair Treatments'],
  },
]

export const journeySteps = [
  {
    id: 'discover',
    number: '01',
    eyebrow: 'Discover',
    title: 'Find your perfect salon',
    description: 'Explore salons, grooming studios, beauty services, and treatments that fit your style and location.',
    action: 'Explore Salons',
    image: {
      src: `https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?${imageParams}`,
      alt: 'Premium salon interior with styling chairs and mirrors',
    },
    chips: ['Near you', 'Verified salons', 'Beauty and grooming'],
    preview: 'map',
  },
  {
    id: 'services',
    number: '02',
    eyebrow: 'Choose',
    title: 'Choose what you need',
    description: 'Compare services, pricing, duration, add-ons, and care options before you make a decision.',
    action: 'View Services',
    image: {
      src: `https://images.unsplash.com/photo-1560066984-138dadb4c035?${imageParams}`,
      alt: 'Stylist blow drying a client hair in a bright salon',
    },
    chips: ['Haircut', 'Facial', 'Beard grooming', 'Spa'],
    preview: 'services',
  },
  {
    id: 'time',
    number: '03',
    eyebrow: 'Schedule',
    title: 'Pick a time that works',
    description: 'Select your preferred date and appointment slot with clear availability before you confirm.',
    action: 'Pick Time',
    image: {
      src: `https://images.unsplash.com/photo-1515377905703-c4788e51af15?${imageParams}`,
      alt: 'Spa therapist preparing a relaxing salon treatment',
    },
    chips: ['Today', 'Tomorrow', 'Weekend slots'],
    preview: 'calendar',
  },
  {
    id: 'confirm',
    number: '04',
    eyebrow: 'Book',
    title: 'Confirm your appointment',
    description: 'Review the salon, service, stylist, time, and price so every detail is clear before booking.',
    action: 'Confirm Booking',
    image: {
      src: `https://images.unsplash.com/photo-1522337660859-02fbefca4702?${imageParams}`,
      alt: 'Salon team preparing a client appointment station',
    },
    chips: ['Service review', 'Stylist choice', 'Transparent price'],
    preview: 'confirmation',
  },
  {
    id: 'visit',
    number: '05',
    eyebrow: 'Visit',
    title: 'Arrive and relax',
    description: 'Visit at your scheduled time and let trained professionals take care of the service experience.',
    action: 'Get Ready',
    image: {
      src: `https://images.unsplash.com/photo-1540555700478-4be289fbecef?${imageParams}`,
      alt: 'Premium spa treatment table with towels and soft lighting',
    },
    chips: ['No waiting', 'Prepared team', 'Premium care'],
    preview: 'visit',
  },
  {
    id: 'return',
    number: '06',
    eyebrow: 'Return',
    title: 'Your routine, simplified',
    description: 'Save favorite salons, discover new services, and book your next appointment whenever you need it.',
    action: 'Book Again',
    image: {
      src: `https://images.unsplash.com/photo-1519014816548-bf5fe059798b?${imageParams}`,
      alt: 'Fresh manicure with elegant neutral nail polish',
    },
    chips: ['Favorites', 'Book again', 'Personal routine'],
    preview: 'again',
  },
]
