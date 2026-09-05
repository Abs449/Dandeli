import imgShortRafting from "../assets/Backgroundimg/gallery-raft2.webp";
import imgLongRafting from "../assets/Backgroundimg/gallery-raft1.webp";
import imgKayaking from "../assets/Backgroundimg/kayak-bg.webp";
import imgDrone from "../assets/Backgroundimg/gallery-drone.webp";
import imgScenery from "../assets/Backgroundimg/river-scenery.webp";
import imgJungle from "../assets/Backgroundimg/gallery-jungle.webp";
import imgswing from "../assets/Backgroundimg/Giant_Swing.webp";
import imgcampfire from "../assets/Backgroundimg/campfire.webp";
import imgkayak from "../assets/Backgroundimg/kayaking.webp";
import imgNature from "../assets/Backgroundimg/Nature_trails.webp";
import imgTrek from "../assets/Backgroundimg/Trekking.webp";
import imgZip from "../assets/Backgroundimg/zipline.webp";
import imgZorb from "../assets/Backgroundimg/Zorbing.webp";
import imgWaterZip from "../assets/Backgroundimg/water_zipline.webp";

export const seedServices = [
  // ─────────────────────────────────────────
  // WHITE WATER RAFTING
  // ─────────────────────────────────────────
  {
    id: 1,
    name: "Short Rafting (1km / 40 Mins)",
    shortDescription:
      "A thrilling 1km rafting experience on the Kali River, perfect for beginners and families looking for a quick adventure.",
    fullDescription:
      "Experience the excitement of white-water rafting on the Kali River with experienced guides and complete safety equipment.",
    image: imgShortRafting,
    images: [imgShortRafting, imgDrone, imgScenery],
    price: "₹700",
    duration: "40 Mins",
    difficulty: "Beginner",
    equipment: ["Life Jacket", "Helmet", "Paddle"],
    category: "rafting",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Mid Rafting (5km / 1.5 Hours)",
    shortDescription:
      "A 5km rafting adventure through the exciting rapids of the Kali River, ideal for adventure seekers.",
    fullDescription:
      "Take on a longer stretch of the Kali River with exciting rapids, beautiful forest surroundings, and experienced river guides.",
    image: imgLongRafting,
    images: [imgLongRafting, imgDrone, imgJungle],
    price: "₹1,350",
    duration: "1.5 Hours",
    difficulty: "Moderate",
    equipment: ["Life Jacket", "Helmet", "Paddle", "Dry Bag"],
    category: "rafting",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Long Rafting (11km / 3 Hours)",
    shortDescription:
      "An unforgettable 11km rafting expedition through the scenic Kali River and dense Western Ghats forests.",
    fullDescription:
      "Experience the ultimate Kali River rafting adventure with an extended 11km route, challenging rapids, and spectacular forest scenery.",
    image: imgLongRafting,
    images: [imgLongRafting, imgDrone, imgJungle],
    price: "₹1,750",
    duration: "3 Hours",
    difficulty: "Moderate",
    equipment: ["Life Jacket", "Helmet", "Paddle", "Dry Bag"],
    category: "rafting",
    displayOrder: 3,
  },

  // ─────────────────────────────────────────
  // WATER & ADVENTURE SPORTS
  // ─────────────────────────────────────────
  {
    id: 4,
    name: "River Zip-line",
    shortDescription:
      "Soar across the river on an exciting zip-line adventure surrounded by the forests of Dandeli.",
    fullDescription:
      "Enjoy an exhilarating river zip-line experience with safety equipment and guidance from experienced instructors.",
    image: imgWaterZip,
    images: [imgWaterZip, imgScenery, imgJungle],
    price: "₹350",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Harness", "Helmet", "Safety Gear"],
    category: "water",
    displayOrder: 4,
  },
  {
    id: 5,
    name: "River Kayaking",
    shortDescription:
      "Paddle through the calm waters of the Kali River while enjoying the surrounding natural beauty.",
    fullDescription:
      "Explore the river at your own pace with a kayaking experience suitable for those looking for a peaceful water adventure.",
    image: imgkayak,
    images: [imgkayak, imgScenery, imgDrone],
    price: "₹300",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Life Jacket", "Kayak", "Paddle"],
    category: "water",
    displayOrder: 5,
  },
  {
    id: 6,
    name: "Water Zorbing",
    shortDescription:
      "Enjoy a fun-filled water zorbing experience suitable for friends and families.",
    fullDescription:
      "Step inside a large inflatable water ball and enjoy a playful adventure on the water.",
    image: imgZorb,
    images: [imgZorb, imgScenery, imgKayaking],
    price: "₹300",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Water Zorb", "Safety Gear"],
    category: "water",
    displayOrder: 6,
  },
  {
    id: 7,
    name: "River Swimming",
    shortDescription:
      "Enjoy a refreshing swim in the natural waters of the Kali River.",
    fullDescription:
      "Relax and enjoy a refreshing river swimming experience in a designated and supervised section of the river.",
    image: imgScenery,
    images: [imgScenery, imgJungle],
    price: "₹150",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Life Jacket"],
    category: "water",
    displayOrder: 7,
  },
  {
    id: 8,
    name: "River Jacuzzi",
    shortDescription:
      "Relax in the natural currents of the Kali River for a refreshing river jacuzzi experience.",
    fullDescription:
      "Enjoy a relaxing natural hydro-massage experience created by the flowing river currents and surrounding rocks.",
    image: imgScenery,
    images: [imgScenery, imgShortRafting],
    price: "₹150",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Life Jacket"],
    category: "water",
    displayOrder: 8,
  },
  {
    id: 9,
    name: "River Boating",
    shortDescription:
      "Enjoy a peaceful boating experience surrounded by the scenic beauty of the Kali River.",
    fullDescription:
      "Take a relaxing boat ride across the river while enjoying the surrounding forests and natural landscape.",
    image: imgScenery,
    images: [imgScenery, imgDrone],
    price: "₹100",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Life Jacket"],
    category: "water",
    displayOrder: 9,
  },

  // ─────────────────────────────────────────
  // ADVENTURE ACTIVITIES
  // ─────────────────────────────────────────
  {
    id: 10,
    name: "Roller Coaster Zipline (480m)",
    shortDescription:
      "Experience an exciting 480m roller coaster zipline adventure through the forest.",
    fullDescription:
      "Take on the 480-meter roller coaster zipline and experience an exciting aerial adventure surrounded by nature.",
    image: imgDrone,
    images: [imgDrone, imgJungle, imgScenery],
    price: "₹1,400",
    duration: "As per activity",
    difficulty: "Moderate",
    equipment: ["Harness", "Helmet", "Carabiners"],
    category: "adventure",
    displayOrder: 10,
  },
  {
    id: 11,
    name: "Canopy Walk",
    shortDescription:
      "Walk above the forest floor and experience Dandeli's rich greenery from a unique perspective.",
    fullDescription:
      "Explore the forest canopy through an elevated walking experience surrounded by the natural beauty of Dandeli.",
    image: imgJungle,
    images: [imgJungle, imgDrone, imgScenery],
    price: "₹600",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Safety Gear"],
    category: "adventure",
    displayOrder: 11,
  },
  {
    id: 12,
    name: "Sky Cycling",
    shortDescription:
      "Cycle high above the ground for a thrilling aerial adventure surrounded by nature.",
    fullDescription:
      "Experience the thrill of cycling above the ground while enjoying panoramic views of the surrounding forest.",
    image: imgDrone,
    images: [imgDrone, imgJungle],
    price: "₹400",
    duration: "As per activity",
    difficulty: "Moderate",
    equipment: ["Safety Harness", "Helmet"],
    category: "adventure",
    displayOrder: 12,
  },
  {
    id: 13,
    name: "Giant Swing",
    shortDescription:
      "Feel the rush of a giant swing experience surrounded by the forests of Dandeli.",
    fullDescription:
      "Take a thrilling swing from an elevated platform with professional safety equipment and supervision.",
    image: imgswing,
    images: [imgswing, imgJungle, imgDrone],
    price: "₹400",
    duration: "As per activity",
    difficulty: "Moderate",
    equipment: ["Harness", "Helmet", "Safety Gear"],
    category: "adventure",
    displayOrder: 13,
  },
  {
    id: 14,
    name: "Zipline",
    shortDescription:
      "Fly through the air on an exciting zipline surrounded by the lush forests of Dandeli.",
    fullDescription:
      "Enjoy a fun and exciting zipline experience with professional safety equipment and guidance.",
    image: imgZip,
    images: [imgZip, imgJungle],
    price: "₹300",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Harness", "Helmet", "Carabiners"],
    category: "adventure",
    displayOrder: 14,
  },
  {
    id: 15,
    name: "Trekking",
    shortDescription:
      "Explore the beautiful forests and natural trails surrounding Dandeli on foot.",
    fullDescription:
      "Discover the natural beauty of the Western Ghats through guided trekking trails surrounded by dense forests and wildlife.",
    image: imgTrek,
    images: [imgTrek, imgScenery],
    price: "₹250",
    duration: "As per activity",
    difficulty: "Moderate",
    equipment: ["Comfortable Shoes", "Water Bottle"],
    category: "adventure",
    displayOrder: 15,
  },
  {
    id: 16,
    name: "Fishing",
    shortDescription:
      "Enjoy a peaceful fishing experience surrounded by the natural beauty of the Kali River.",
    fullDescription:
      "Spend time by the river and enjoy a relaxing fishing experience surrounded by Dandeli's scenic landscape.",
    image: imgScenery,
    images: [imgScenery, imgJungle],
    price: "₹250",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Fishing Equipment"],
    category: "adventure",
    displayOrder: 16,
  },

  // ─────────────────────────────────────────
  // WILDLIFE & NATURE
  // ─────────────────────────────────────────
  {
    id: 17,
    name: "Nature Trails",
    shortDescription:
      "Explore the forests of Dandeli through scenic nature trails surrounded by rich greenery.",
    fullDescription:
      "Walk through the natural landscapes of Dandeli and experience the forests, plants, and wildlife of the Western Ghats.",
    image: imgNature,
    images: [imgNature, imgScenery, imgDrone],
    price: "₹1,800",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Comfortable Shoes", "Water Bottle"],
    category: "wildlife",
    displayOrder: 17,
  },
  {
    id: 18,
    name: "Jungle Safari",
    shortDescription:
      "Explore the forests of Dandeli on an exciting jungle safari in search of wildlife.",
    fullDescription:
      "Experience the wilderness of Dandeli through a guided jungle safari across the forest landscape.",
    image: imgJungle,
    images: [imgJungle, imgDrone, imgScenery],
    price: "₹800",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Comfortable Clothing", "Water Bottle"],
    category: "wildlife",
    displayOrder: 18,
  },
  {
    id: 19,
    name: "Bird Watching",
    shortDescription:
      "Discover the rich variety of birds found in the forests and river surroundings of Dandeli.",
    fullDescription:
      "Enjoy a peaceful bird-watching experience while exploring the diverse habitats and forests around Dandeli.",
    image: imgJungle,
    images: [imgJungle, imgScenery],
    price: "₹650",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: ["Binoculars"],
    category: "wildlife",
    displayOrder: 19,
  },

  // ─────────────────────────────────────────
  // CAMPING & STAY
  // ─────────────────────────────────────────
  {
    id: 20,
    name: "Resort Stays",
    shortDescription:
      "Relax in comfortable resort accommodation surrounded by the natural beauty of Dandeli.",
    fullDescription:
      "Enjoy a comfortable stay close to nature with convenient access to Dandeli's adventure activities and attractions.",
    image: imgJungle,
    images: [imgJungle, imgScenery],
    price: "₹2,700",
    duration: "Overnight",
    difficulty: "Easy",
    equipment: ["Accommodation"],
    category: "camping",
    displayOrder: 20,
  },
  {
    id: 21,
    name: "Jungle Camping",
    shortDescription:
      "Spend a night surrounded by the sounds and beauty of the Dandeli forest.",
    fullDescription:
      "Experience an immersive jungle camping stay surrounded by nature, with comfortable camping arrangements.",
    image: imgJungle,
    images: [imgJungle, imgScenery, imgDrone],
    price: "₹1,800",
    duration: "Overnight",
    difficulty: "Easy",
    equipment: ["Tent", "Sleeping Bag", "Torch"],
    category: "camping",
    displayOrder: 21,
  },
  {
    id: 22,
    name: "Riverside Camping",
    shortDescription:
      "Enjoy an overnight camping experience beside the scenic Kali River.",
    fullDescription:
      "Stay close to the river and enjoy the peaceful atmosphere of a riverside camping experience surrounded by nature.",
    image: imgScenery,
    images: [imgScenery, imgJungle, imgDrone],
    price: "₹1,800",
    duration: "Overnight",
    difficulty: "Easy",
    equipment: ["Tent", "Sleeping Bag", "Torch"],
    category: "camping",
    displayOrder: 22,
  },
  {
    id: 23,
    name: "Campfire",
    shortDescription:
      "Relax around a warm campfire and enjoy an evening surrounded by nature.",
    fullDescription:
      "Unwind after a day of adventure with a peaceful campfire experience in the natural surroundings of Dandeli.",
    image: imgcampfire,
    images: [imgcampfire, imgJungle, imgScenery],
    price: "₹150",
    duration: "As per activity",
    difficulty: "Easy",
    equipment: [],
    category: "camping",
    displayOrder: 23,
  },
];

export const seedPackages = [
  {
    id: 1,
    name: "Day Thrill Package",
    price: "₹1,599",
    duration: "1 Day",
    checkIn: null,
    checkOut: null,

    description:
      "Get ready for the ultimate adventure day-out by the Kali River. Perfect for families, friends, and corporate groups.",

    meals: [
      "Breakfast",
      "Buffet Lunch",
    ],

    riverActivities: [
      "Short Rafting (1km)",
      "River Kayaking",
      "River Boating",
      "River Swimming",
      "Zorbing",
      "Zip-line",
    ],

    resortFun: [
      "Swimming Pool",
      "Rain Dance",
    ],

    stayOptions: [],

    sightseeing: [],

    recommended: false,
    image: imgShortRafting,
    displayOrder: 1,
  },

  {
    id: 2,
    name: "Stay Package",
    price: "₹2,699",
    duration: "2 Days / 1 Night",
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",

    description:
      "Get ready for the ultimate getaway by the Kali River. An all-inclusive stay package perfect for families, friends, and corporate groups.",

    stayOptions: [
      "Cozy Rooms",
      "Commando Tents",
    ],

    meals: [
      "Breakfast",
      "Buffet Lunch (Veg & Non-Veg)",
      "Dinner (Veg & Non-Veg)",
      "Evening Tea/Coffee",
    ],

    riverActivities: [
      "Short Rafting (1km)",
      "River Kayaking",
      "River Boating",
      "River Swimming",
      "Water Zorbing",
      "Thrilling Zip-line",
    ],

    resortFun: [
      "Swimming Pool",
      "Rain Dance",
      "Cycling",
      "Night Campfire",
      "Forest Trekking",
      "Archery",
      "Carrom & Indoor Games",
    ],

    sightseeing: [
      "Honey Park",
      "Supa Dam Backwaters",
    ],

    recommended: true,
    image: imgLongRafting,
    displayOrder: 2,
  },

  {
    id: 3,
    name: "Premium River Side Stay Package",
    price: "₹4,599",
    duration: "2 Days / 1 Night",
    checkIn: "12:00 PM",
    checkOut: "11:00 AM",

    description:
      "Get ready for the ultimate premium getaway by the Kali River. An all-inclusive riverside stay package perfect for families, friends, and corporate groups.",

    stayOptions: [
      "River Side Rooms",
      "Commando Tents",
    ],

    meals: [
      "Breakfast",
      "Buffet Lunch (Veg & Non-Veg)",
      "Dinner (Veg & Non-Veg)",
      "Evening Tea/Coffee",
    ],

    riverActivities: [
      "Short Rafting (1km)",
      "River Kayaking",
      "River Boating",
      "River Swimming",
      "Water Zorbing",
      "Thrilling Zip-line",
    ],

    resortFun: [
      "Swimming Pool",
      "Rain Dance",
      "Cycling",
      "Night Campfire",
      "Forest Trekking",
      "Archery",
      "Carrom & Indoor Games",
    ],

    sightseeing: [
      "Honey Park",
      "Supa Dam Backwaters",
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
