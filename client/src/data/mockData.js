export const services = [
  {
    id: 1,
    name: "River Rafting",
    shortDescription:
      "Experience the thrill of white water rafting on the Kali River.",
    fullDescription:
      "Our river rafting experience on the Kali River is perfect for adrenaline junkies. Navigate through exciting rapids surrounded by lush green forests. Suitable for both beginners and experienced rafters.",
    image:
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800",
    duration: "2-3 Hours",
    difficulty: "Moderate",
    equipment: ["Life Jacket", "Helmet", "Paddles"],
    images: [
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522869634938-17a42421df60?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 2,
    name: "Kayaking",
    shortDescription:
      "Paddle through calm waters and enjoy the serene environment.",
    fullDescription:
      "Kayaking in Dandeli is a peaceful yet exciting activity. Paddle along the quiet stretches of the Kali River, spotting local birds and enjoying the pristine natural beauty of the Western Ghats.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    duration: "1-2 Hours",
    difficulty: "Easy",
    equipment: ["Kayak", "Life Jacket", "Paddle"],
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 3,
    name: "Jungle Camping",
    shortDescription: "Stay overnight in tents under the starry sky.",
    fullDescription:
      "Disconnect from the world and connect with nature. Our camping sites are located in safe, scenic spots within the forest. Enjoy a bonfire, barbecue, and the soothing sounds of the jungle at night.",
    image:
      "https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=800",
    duration: "1 Night / 2 Days",
    difficulty: "Easy",
    equipment: ["Tent", "Sleeping Bag", "Meals"],
    images: [
      "https://images.unsplash.com/photo-1504280390467-3174246194b1?auto=format&fit=crop&q=80&w=800",
    ],
  },
  {
    id: 4,
    name: "Zipline",
    shortDescription: "Fly across the river for a breathtaking view.",
    fullDescription:
      "Get a bird's eye view of the Kali River and surrounding forests as you zoom across our secure zipline. A short but unforgettable burst of excitement for adventure lovers.",
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
    name: "Jungle Safari",
    shortDescription: "Explore the wildlife in their natural habitat.",
    fullDescription:
      "Embark on a guided jeep safari deep into the Dandeli Wildlife Sanctuary. Keep your eyes peeled for black panthers, elephants, and a diverse range of exotic birds.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    duration: "3-4 Hours",
    difficulty: "Easy",
    equipment: ["Jeep", "Binoculars (Optional)", "Guide"],
    images: [],
  },
  {
    id: 6,
    name: "Coracle Ride",
    shortDescription: "A traditional boat ride on the Kali river.",
    fullDescription:
      "Experience a unique ride in a round, traditional coracle boat. Let the slow currents guide you as you take in the majestic surroundings of the river banks.",
    image:
      "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Faquaheaven.net%2Factivity%2Fcoracle-ride%2F&ved=0CBYQjRxqFwoTCPiGhLHMp5UDFQAAAAAdAAAAABAG&opi=89978449",
    duration: "1 Hour",
    difficulty: "Easy",
    equipment: ["Life Jacket"],
    images: [],
  },
  {
    id: 7,
    name: "Trekking",
    shortDescription: "Trek through the dense forests of the Western Ghats.",
    fullDescription:
      "Join our expert guides for a trek through the thick jungles of Dandeli. Discover hidden waterfalls, unique flora, and challenge yourself physically while breathing the freshest air.",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
    duration: "4-5 Hours",
    difficulty: "Hard",
    equipment: ["Trekking Shoes", "Walking Stick", "Water Bottle"],
    images: [],
  },
  {
    id: 8,
    name: "Bird Watching",
    shortDescription: "Spot over 200 species of birds in the sanctuary.",
    fullDescription:
      "Dandeli is a paradise for bird lovers. Accompanied by our naturalist, you will be able to spot Hornbills, Kingfishers, and many more rare species early in the morning.",
    image:
      "https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=800",
    duration: "2 Hours",
    difficulty: "Easy",
    equipment: ["Binoculars", "Guide Book"],
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
    name: "Google Reviews",
    rating: 5,
    review:
      "The adventure activities were outstanding and the experience was unforgettable.",
    platform: "Google Reviews",
    platformUrl:
      "https://www.google.com/maps/search/?api=1&query=Dandeli+reviews",
    url: "https://www.google.com/maps/search/?api=1&query=Dandeli+reviews",
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
