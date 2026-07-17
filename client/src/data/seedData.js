// Cleaned-up seed data. This is the *canonical* shape used everywhere and
// the fallback when Supabase is unreachable. The same rows are imported
// into Supabase via supabase/seed.sql (or by pasting into the Table Editor).

export const seedServices = [
  {
    id: 1,
    name: 'Short Rafting',
    shortDescription: '1 km short-distance river rafting across the Kali River.',
    fullDescription:
      'Perfect for first-timers and families. Navigate gentle Class II rapids on a 1 km stretch of the Kali River with a certified guide. Includes safety briefing and all equipment.',
    image:
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=1200',
    price: '₹600 per person',
    duration: '1–2 hours',
    difficulty: 'Beginner',
    equipment: ['Life Jacket', 'Helmet', 'Paddles'],
    images: [],
    category: 'activity',
  },
  {
    id: 2,
    name: 'Mid Rafting',
    shortDescription: '5 km of mid-range rapids through the Dandeli forests.',
    fullDescription:
      'A 5 km stretch combining Class II and III rapids with calmer pools for swimming breaks. Suitable for anyone with reasonable fitness.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    price: '₹1,350 per person',
    duration: '2 hours',
    difficulty: 'Moderate',
    equipment: ['Helmet', 'Life Jacket', 'Paddles'],
    images: [],
    category: 'activity',
  },
  {
    id: 3,
    name: 'Long Rafting',
    shortDescription: '11 km of thrilling white-water rapids along the scenic Kali River.',
    fullDescription:
      'Our flagship trip. 11 km of continuous rapids, cliff jumps at designated points, and a riverside snack stop. Best for adventure-seekers.',
    image:
      'https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=1200',
    price: '₹1,750 per person',
    duration: '3 hours',
    difficulty: 'Hard',
    equipment: ['Life Jacket', 'Paddles', 'Helmet'],
    images: [],
    category: 'activity',
  },
  {
    id: 4,
    name: 'River Zipline',
    shortDescription: 'Zipline across the river for a breathtaking view.',
    fullDescription:
      'A 250 m zipline running above the Kali River. Two parallel lines so you can race a friend. Includes harness, helmet, and a quick safety briefing.',
    image:
      'https://images.unsplash.com/photo-1596489813295-654dbdae3e53?auto=format&fit=crop&q=80&w=1200',
    price: '₹350 per person',
    duration: '15 minutes',
    difficulty: 'Easy',
    equipment: ['Harness', 'Helmet'],
    images: [],
    category: 'activity',
  },
  {
    id: 5,
    name: 'River Swimming',
    shortDescription: 'Swim across the Kali River with a guide and boat support.',
    fullDescription:
      'A guided swim across a calm stretch of the Kali River with a support boat alongside. Life jackets provided; suitable for confident swimmers.',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200',
    price: '₹150 per person',
    duration: '3–4 hours',
    difficulty: 'Hard',
    equipment: ['Life Jacket', 'Boat', 'Guide'],
    images: [],
    category: 'activity',
  },
  {
    id: 6,
    name: 'Zorbing',
    shortDescription: 'Walk and roll on the water inside a giant inflatable zorb ball.',
    fullDescription:
      'A 10-minute zorb session in a sealed 3 m ball on a calm section of the river. Hilarious, surprisingly relaxing, and totally safe.',
    image:
      'https://images.unsplash.com/photo-1567604130959-7ea7ab2a7eaa?auto=format&fit=crop&q=80&w=1200',
    price: '₹300 per person',
    duration: '15 minutes',
    difficulty: 'Easy',
    equipment: ['Zorb Ball', 'Tether'],
    images: [],
    category: 'activity',
  },
  {
    id: 7,
    name: 'River Boating',
    shortDescription: 'Calm boating across the Kali River — perfect for groups.',
    fullDescription:
      'A peaceful coracle or motorboat ride along a quiet stretch of the river. Great for families, photography, and bird-spotting.',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200',
    price: '₹100 per person',
    duration: '1–2 hours',
    difficulty: 'Easy',
    equipment: ['Boat', 'Life Jacket'],
    images: [],
    category: 'activity',
  },
  {
    id: 8,
    name: 'River Kayaking',
    shortDescription: 'Solo or tandem kayaking on the Kali River.',
    fullDescription:
      'Single and double kayaks available. Paddle a 2 km stretch of gentle rapids with our guide close by. No prior experience needed.',
    image:
      'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=1200',
    price: '₹300 per person',
    duration: '2 hours',
    difficulty: 'Easy',
    equipment: ['Kayak', 'Paddles', 'Life Jacket'],
    images: [],
    category: 'activity',
  },
];

export const seedPackages = [
  {
    id: 1,
    name: 'Day Trip Adventurer',
    price: '₹1,499',
    duration: '1 Day',
    activities: ['River Rafting (5 km)', 'Zipline', 'Lunch Included'],
    recommended: false,
    image:
      'https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 2,
    name: 'Weekend Explorer',
    price: '₹3,999',
    duration: '2 Days / 1 Night',
    activities: ['Camping', 'River Rafting', 'Kayaking', 'All Meals', 'Bonfire'],
    recommended: true,
    image:
      'https://images.unsplash.com/photo-1504280390367-3174246194b1?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 3,
    name: 'Ultimate Forest Stay',
    price: '₹5,999',
    duration: '3 Days / 2 Nights',
    activities: [
      'Resort Stay',
      'All Water Sports',
      'Jungle Safari',
      'All Meals',
      'Bird Watching',
    ],
    recommended: false,
    image:
      'https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=1200',
  },
];

export const seedReviews = [
  {
    id: 1,
    name: 'Rahul Sharma',
    rating: 5,
    review:
      'Absolutely brilliant experience! The rafting instructors were professional and made us feel safe. Highly recommend the weekend package.',
    platform: 'Google Reviews',
    platformUrl: 'https://maps.app.goo.gl/Tc8hjRYpzHV7DD316',
  },
  {
    id: 2,
    name: 'Priya Desai',
    rating: 5,
    review:
      'The camping site was beautiful and clean. Waking up to the sound of birds in the Dandeli forest is something I will never forget.',
    platform: 'TripAdvisor',
    platformUrl: 'https://www.tripadvisor.in/',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    rating: 4,
    review:
      'Great adventure activities. The kayaking was so peaceful. Food provided at the camp could be slightly better, but overall a 5-star trip.',
    platform: 'Google Reviews',
    platformUrl: 'https://www.google.com/maps/search/?api=1&query=Dandeli+reviews',
  },
  {
    id: 4,
    name: 'Neha Singh',
    rating: 5,
    review:
      'We booked the Ultimate Forest Stay and it was worth every penny. The guides were knowledgeable during the safari.',
    platform: 'Facebook',
    platformUrl: 'https://www.facebook.com/',
  },
];
