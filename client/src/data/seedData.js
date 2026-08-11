import imgShortRafting from "../assets/Backgroundimg/DSC_1226.JPG.jpeg";
import imgLongRafting from "../assets/Backgroundimg/DSC_1225.JPG.jpeg";
import imgKayaking from "../assets/Backgroundimg/kayakinwater.webp";
import imgDrone from "../assets/Backgroundimg/dji_fly_20260103_124946_0149_1774087624546_photo.jpg.jpeg";
import imgScenery from "../assets/Backgroundimg/IMG20250524115322.jpg.jpeg";
import imgJungle from "../assets/Backgroundimg/IMG20250524114921.jpg.jpeg";

export const seedServices = [
  {
    id: 1,
    name: "White-Water Rafting (Short Run)",
    shortDescription:
      "A thrilling 1.5 km splash down the Kali River. Perfect for beginners and family groups seeking raw excitement.",
    fullDescription:
      "Experience the adrenaline rush of tackling Class II & III rapids under the supervision of certified river guides. Complete safety gear provided.",
    image: imgShortRafting,
    images: [imgShortRafting, imgDrone, imgScenery],
    price: "₹600 per person",
    duration: "45 mins",
    difficulty: "Beginner",
    equipment: ["Life Jacket", "Helmet", "Paddle"],
    category: "activity",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "White-Water Rafting (Long Run)",
    shortDescription:
      "The ultimate 9.5 km river expedition with major Class III+ rapids through dense teak forests.",
    fullDescription:
      "Conquer Dandeli's longest rafting route. Navigate intense rapids like 'Stanley's Spot' and 'The Pit' with experienced expedition leaders.",
    image: imgLongRafting,
    images: [imgLongRafting, imgDrone, imgJungle],
    price: "₹1,350 per person",
    duration: "3 hours",
    difficulty: "Moderate",
    equipment: ["Life Jacket", "Helmet", "Paddle", "Dry Bag"],
    category: "activity",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Kayaking & Paddle Boarding",
    shortDescription:
      "Glide through calm backwaters, navigate gentle river bends, and explore hidden islands.",
    fullDescription:
      "Single and double kayak rentals with brief safety instruction. Great for quiet nature exploration and wildlife spotting along the banks.",
    image: imgKayaking,
    images: [imgKayaking, imgScenery],
    price: "₹350 per person",
    duration: "30 mins",
    difficulty: "Easy",
    equipment: ["Life Jacket", "Paddle"],
    category: "activity",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "Ziplining & Sky Walk",
    shortDescription:
      "Soar across the Kali River canopy on a 300-meter high-speed zipline with panoramic forest views.",
    fullDescription:
      "Dual-cable high wire zipline inspected to international safety standards. Includes safety harness and brief orientation.",
    image: imgDrone,
    images: [imgDrone, imgJungle],
    price: "₹450 per person",
    duration: "20 mins",
    difficulty: "Easy",
    equipment: ["Harness", "Helmet", "Carabiners"],
    category: "activity",
    displayOrder: 4,
  },
  {
    id: 5,
    name: "Jungle Camping & Campfire",
    shortDescription:
      "Overnight tent stays under the stars with buffet dinner, morning trek, and campfire music.",
    fullDescription:
      "Comfortable waterproof tents equipped with sleeping mats. Includes dinner, breakfast, guided morning bird-watching trek, and evening campfire.",
    image: imgJungle,
    images: [imgJungle, imgScenery],
    price: "₹1,500 per person / night",
    duration: "Overnight (24h)",
    difficulty: "Easy",
    equipment: ["Tent", "Sleeping Bag", "Torch"],
    category: "stay",
    displayOrder: 5,
  },
  {
    id: 6,
    name: "River Jacuzzi & Natural Bath",
    shortDescription:
      "Relax in natural whitewater massage currents created by river rocks along gentle rapids.",
    fullDescription:
      "A soothing outdoor natural hydro-massage experience guided by locals in safe, shallow river sections.",
    image: imgScenery,
    images: [imgScenery, imgShortRafting],
    price: "₹250 per person",
    duration: "45 mins",
    difficulty: "Easy",
    equipment: ["Life Jacket"],
    category: "activity",
    displayOrder: 6,
  },
];

export const seedPackages = [
  {
    id: 1,
    name: "Day Thrill Package",
    price: "₹1,499",
    duration: "1 Day (8 AM – 5 PM)",
    activities: [
      "Short Run White-Water Rafting (1.5 km)",
      "Kayaking or Paddle Boarding",
      "Zipline River Crossing",
      "Buffet Lunch & Evening Tea",
    ],
    recommended: false,
    image: imgShortRafting,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Ultimate Adventure Package",
    price: "₹2,499",
    duration: "2 Days / 1 Night",
    activities: [
      "Long Run White-Water Rafting (9.5 km)",
      "Kayaking & Ziplining",
      "Jungle Tent Stay + Campfire",
      "All Meals (Lunch, Dinner, Breakfast)",
      "Guided Morning Nature Trek",
    ],
    recommended: true,
    image: imgLongRafting,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Family Explorer Package",
    price: "₹1,899",
    duration: "2 Days / 1 Night",
    activities: [
      "Short Run Rafting or Jungle Boat Safari",
      "River Jacuzzi Experience",
      "Resort / Cottage Stay",
      "All Meals Included",
      "Swimming Pool Access",
    ],
    recommended: false,
    image: imgJungle,
    displayOrder: 3,
  },
];

export const seedReviews = [
  {
    id: 1,
    name: "Rohan & Priya Mehta",
    rating: 5,
    review:
      "Conquering the 9.5 km Kali River rapids was the highlight of our year! The guides were super professional, patient, and made safety priority #1.",
    platform: "Google Review",
    platformUrl: "https://google.com",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Anand Kulkarni",
    rating: 5,
    review:
      "Booked the 2-day Ultimate Adventure package with friends. Campfire night under the jungle stars + morning rafting was unforgettable. Transparent pricing, no hidden costs!",
    platform: "Google Review",
    platformUrl: "https://google.com",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Dr. Kavita Shenoy",
    rating: 5,
    review:
      "Wonderful experience for a first-timer! Short rafting run was exhilarating yet totally safe for our family. Highly recommend booking early.",
    platform: "TripAdvisor",
    platformUrl: "https://tripadvisor.com",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "Vikram Sengupta",
    rating: 5,
    review:
      "The guides know every rock and wave on the Kali river. The live water release update feature on their website helped us pick the perfect date!",
    platform: "Google Review",
    platformUrl: "https://google.com",
    displayOrder: 4,
  },
];
