import imgShortRafting from "../assets/Backgroundimg/gallery-raft2.webp";
import imgLongRafting from "../assets/Backgroundimg/gallery-raft1.webp";
import imgKayaking from "../assets/Backgroundimg/kayak-bg.webp";
import imgDrone from "../assets/Backgroundimg/gallery-drone.webp";
import imgScenery from "../assets/Backgroundimg/river-scenery.webp";
import imgJungle from "../assets/Backgroundimg/gallery-jungle.webp";

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
    name: "Karthik G Gadwal",
    rating: 5,
    review:
      "Had an amazing river rafting experience in Dandeli! Huge thanks to guide Kiran for making it super fun, safe, and memorable. His energy and guidance made the whole adventure even better. Highly recommended! Jai Kali river .!!! 🌊🙌 …",
    platform: "Google Review",
    platformUrl: "https://maps.app.goo.gl/YBoZaUZS4c8ekMhz5",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Arman Warsi",
    rating: 5,
    review:
      "Had an amazing river rafting experience in Dandeli! The rapids were thrilling, the guides were professional and friendly, and all safety measures were well maintained. It was an unforgettable adventure and one of the best experiences of my trip. Highly recommended for anyone visiting Dandeli!",
    platform: "Google Review",
    platformUrl: "https://maps.app.goo.gl/x1odGFHtCShQ3X6ZA",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Sumit Marturkar",
    rating: 5,
    review:
      "Fantastic and thriller journey, River rafting was the best experience ever! The nature and greenery were so peaceful.Resort stay was comfortable and fun.Overall, a perfect 5/5 trip with unforgettable memories.",
    platform: "Google Review",
    platformUrl: "https://maps.app.goo.gl/Uno1Pd36VrhohLTq6",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "Varsha",
    rating: 5,
    review:
      "Visiting dandeli was one of my bucket list. Calm atmosphere that made me forget the city life. More importantly I loved the water activities- zip line and river rafting. ALL THANKS TO MR.KARTHIK he arranged everything in short duration and very nicely. The resort food was too good and rooms were hygienic and well maintained.",
    platform: "Google Review",
    platformUrl: "https://maps.app.goo.gl/DMGKFgrN4nqofbX48",
    displayOrder: 4,
  },
];
