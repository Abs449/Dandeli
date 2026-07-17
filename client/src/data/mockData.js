export const services = [
  {
    id: 1,
    name: "Short Rafting",
    shortDescription: "1km Short distance river rafting across Kali River",
    image:
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800",
    price: "600₹ per person",
    duration: "1-2hours",
    difficulty: "Beginner",
    equipment: ["Life Jacket", "Helmet", "Paddles"],
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522869634938-17a42421df60?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 2,
    name: "Mid Rafting",
    shortDescription: "5-Km mid river rafting",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    Price: "1350₹ per person",
    duration: "2 Hours",
    difficulty: "Moderate",
    equipment: ["Helmet", "Life Jacket", "Paddles"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 3,
    name: "Long Rafting",
    shortDescription:
      "Navigate 11 km of thrilling white-water rapids along the scenic Kali River.",
    image:
      "https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=800",
    Price: "1750₹ per person",
    duration: "3hrs",
    difficulty: "Amateur",
    equipment: ["LifeJacket", "paddles", "Helmet"],
    images: [
      "https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 4,
    name: "River Zipline",
    shortDescription: "Zipline across the river for a breathtaking view.",
    Price: "350₹ per person",
    image:
      "https://images.unsplash.com/photo-1596489813295-654dbdae3e53?auto=format&fit=crop&q=80&w=800",
    duration: "15 Minutes",
    difficulty: "Easy",
    equipment: ["Harness", "Helmet"],
    images: [
      "https://images.unsplash.com/photo-1596489813295-654dbdae3e53?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 5,
    name: "River Swimming",
    shortDescription: "Swim Across the Kali River",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    duration: "3-4 Hours",
    Price: "150₹ per person",
    difficulty: "Hard",
    equipment: ["LifeJacket", "Boat", "Guide"],
    images: [],
  },
  {
    id: 6,
    name: "Zorbing",
    shortDescription:
      "Walk, roll, and balance on the water in a giant inflatable zorb ball.",

    image:
      "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Faquaheaven.net%2Factivity%2Fcoracle-ride%2F&ved=0CBYQjRxqFwoTCPiGhLHMp5UDFQAAAAAdAAAAABAG&opi=89978449",
    duration: "15mins",
    Price: "300₹ per person",
    difficulty: "Easy",
    equipment: ["Rope"],
    images: [],
  },
  {
    id: 7,
    name: "River Boating",
    shortDescription: "Calm boating across Kali river",
    Price: "100₹ per person",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
    duration: "1-2Hours",
    difficulty: "Easy",
    equipment: ["Boat", "LifeJacket"],
    images: [],
  },
  {
    id: 8,
    name: "River Kayaking",
    shortDescription: "Kayaking across Kali river",
    image:
      "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=800",
    Price: "300₹ per person",
    duration: "2 Hours",
    difficulty: "Easy",
    equipment: ["Kayak", "Paddles", "LifeJacket"],
    images: [],
  },
];

export const packages = [
  {
    id: 1,
    name: "Day Trip Adventurer",
    price: "₹1,499",
    duration: "1 Day",
    activities: ["River Rafting", "Zipline", "Lunch Included"],
    recommended: false,
  },
  {
    id: 2,
    name: "Weekend Explorer",
    price: "₹3,999",
    duration: "2 Days / 1 Night",
    activities: ["Camping", "River Rafting", "Kayaking", "All Meals"],
    recommended: true,
  },
  {
    id: 3,
    name: "Ultimate Forest Stay",
    price: "₹5,999",
    duration: "3 Days / 2 Nights",
    activities: [
      "Resort Stay",
      "All Water Sports",
      "Jungle Safari",
      "All Meals",
    ],
    recommended: false,
  },
];

export const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    review:
      "Absolutely brilliant experience! The rafting instructors were professional and made us feel safe. Highly recommend the weekend package.",
    platform: "Google Reviews",
    platformUrl: "https://maps.app.goo.gl/Tc8hjRYpzHV7DD316",
    url: "https://maps.app.goo.gl/Tc8hjRYpzHV7DD316",
  },
  {
    id: 2,
    name: "Priya Desai",
    rating: 5,
    review:
      "The camping site was beautiful and clean. Waking up to the sound of birds in the Dandeli forest is something I will never forget.",
    platform: "TripAdvisor",
    platformUrl: "https://www.tripadvisor.in/",
    url: "https://www.tripadvisor.in/",
  },
  {
    id: 3,
    name: "Amit Kumar",
    rating: 4,
    review:
      "Great adventure activities. The kayaking was so peaceful. Food provided at the camp could be slightly better, but overall a 5-star trip.",
    platform: "Google Reviews",
    platformUrl:
      "https://www.google.com/maps/search/?api=1&query=Dandeli+reviews",
    url: "https://www.google.com/maps/search/?api=1&query=Dandeli+reviews",
  },
  {
    id: 4,
    name: "Neha Singh",
    rating: 5,
    review:
      "We booked the Ultimate Forest Stay and it was worth every penny. The guides were knowledgeable during the safari.",
    platform: "Facebook",
    platformUrl: "https://www.facebook.com/",
    url: "https://www.facebook.com/",
  },
];
