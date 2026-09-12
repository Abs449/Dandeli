import { useMemo } from "react";
import { Waves, ShieldCheck, MapPin, Users } from "lucide-react";
import LandingHero from "../components/landing/LandingHero";
import ActivityCard from "../components/landing/ActivityCard";
import FaqSection from "../components/landing/FaqSection";
import LandingCta from "../components/landing/LandingCta";
import { seedServices } from "../data/seedData";
import { useSEO } from "../lib/seo";
import { LANDING_PAGES } from "../lib/landingPagesMeta";
import { CONTACT } from "../lib/contact";
import bgImage from "../assets/Backgroundimg/gallery-raft1.webp";

const highlights = [
  {
    Icon: Waves,
    title: "Class II–III Rapids",
    body: "Real white-water on the Kali River — not a lazy float. Routes range from a beginner-friendly 1km stretch to an 11km, 3-hour expedition.",
  },
  {
    Icon: ShieldCheck,
    title: "Safety-First Guiding",
    body: "Every raft carries a certified local guide, life jackets, and helmets. We only run rafting when river flow is confirmed safe.",
  },
  {
    Icon: MapPin,
    title: "Ganeshgudi, Not Dandeli Town",
    body: "Rafting actually happens on the Kali River at Ganeshgudi, about 20km from Dandeli town — we handle pickup logistics so you don't have to guess.",
  },
  {
    Icon: Users,
    title: "8+ Years, 5000+ Rafters",
    body: "Locally run since day one, with transparent pricing and no hidden add-ons.",
  },
];

const faqs = [
  {
    q: "Does rafting happen in Dandeli town or somewhere else?",
    a: "White-water rafting on the Kali River takes place at Ganeshgudi, around 20km from Dandeli town — a common point of confusion for first-time visitors. We can arrange pickup/drop from Dandeli so this isn't something you need to plan around.",
  },
  {
    q: "Is Kali River rafting safe for beginners and kids?",
    a: "Yes. The Short Rafting (1km) route is rated Beginner and is a good starting point for first-timers and families. Every rafter wears a life jacket and helmet, and a certified guide rides in every raft. Longer, moderate-difficulty routes suit rafters comfortable with faster rapids.",
  },
  {
    q: "What should I bring for rafting?",
    a: "Wear quick-dry clothing and secure footwear (sandals with a back strap or old sports shoes). Bring a change of clothes and a dry bag or waterproof phone pouch if you want to carry a phone — dry bags are provided on the longer routes.",
  },
  {
    q: "Is rafting always available, or does it depend on the river?",
    a: "Rafting depends on daily water release from the Kali (Supa) dam. We track live river status and will tell you upfront if conditions mean rafting is paused for the day — check the live status banner on our homepage or call ahead before you travel.",
  },
  {
    q: "How do I book a rafting slot?",
    a: `Fill out our booking form or message us on WhatsApp at ${CONTACT.phone} with your preferred date and group size, and we'll confirm your slot within 24 hours.`,
  },
];

const RaftingInDandeli = () => {
  useSEO({ ...LANDING_PAGES.rafting });

  const raftingRoutes = useMemo(
    () => seedServices.filter((service) => service.category === "rafting"),
    [],
  );

  return (
    <>
      <LandingHero
        eyebrow="Kali River Rafting"
        current="Rafting in Dandeli"
        intro="Three white-water rafting routes on the Kali River at Ganeshgudi — from a quick 40-minute introduction to a full 3-hour expedition through the Western Ghats. Certified guides, complete safety gear, and transparent pricing on every route."
        bgImage={bgImage}
      >
        White-Water Rafting in Dandeli on the Kali River
      </LandingHero>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 bg-[#021915] text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {highlights.map(({ Icon, title, body }) => (
            <div key={title} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
              <Icon className="w-7 h-7 text-cyan-400 mb-4" />
              <h2 className="text-sm font-heading font-black text-white uppercase tracking-wide mb-2">{title}</h2>
              <p className="text-xs text-gray-300 font-body leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white mb-8 tracking-wider text-center">
          Choose Your <span className="text-amber-400">Rafting Route</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {raftingRoutes.map((route) => (
            <ActivityCard key={route.id} item={route} />
          ))}
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <LandingCta
        heading="Ready to Hit the Rapids?"
        subheading="Book your Kali River rafting slot online, or message us on WhatsApp and we'll confirm availability the same day."
      />
    </>
  );
};

export default RaftingInDandeli;
