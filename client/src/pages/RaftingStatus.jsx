import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, CalendarDays, Phone, MessageCircle, Mountain } from "lucide-react";
import LandingHero from "../components/landing/LandingHero";
import FaqSection from "../components/landing/FaqSection";
import LandingCta from "../components/landing/LandingCta";
import GuideLinks from "../components/guides/GuideLinks";
import { useSEO } from "../lib/seo";
import { LANDING_PAGES } from "../lib/landingPagesMeta";
import { CONTACT } from "../lib/contact";
import { getDamStatus } from "../lib/damStatus";
import { guidePath } from "../lib/guides";
import bgImage from "../assets/Backgroundimg/gallery-raft2.webp";

// Activities that don't run on the river, so a dam shutdown doesn't stop them.
const LAND_ACTIVITIES = ["Ziplines", "Canopy walk", "Sky cycling", "Giant swing", "Trekking", "Jungle safari"];

const SEASONS = [
  {
    months: "October – February",
    status: "Peak season",
    body: "Healthy river flow and pleasant weather. All three rafting routes generally run when the dam releases water.",
  },
  {
    months: "March – May",
    status: "Runs, hot days",
    body: "Rafting, kayaking and boating stay popular. Go in the morning or late afternoon to avoid the midday heat.",
  },
  {
    months: "June – September",
    status: "Monsoon break",
    body: "Rafting usually takes a break during the monsoon, when heavy rain makes the river unsafe.",
  },
];

const faqs = [
  {
    q: "Is Dandeli river rafting open today?",
    a: "Check the live status at the top of this page. It turns green when the Supa dam is releasing water into the Kali River, which is what makes rafting at Ganeshgudi possible. Because conditions can change during the day, call or WhatsApp us to confirm before you travel.",
  },
  {
    q: "Is Dandeli rafting open tomorrow?",
    a: "Rafting depends on the next day's water release from the Supa dam, which is decided day by day, so nobody can confirm tomorrow with certainty today. Check this page on the morning of your trip, or message us on WhatsApp and we'll tell you as soon as we know.",
  },
  {
    q: "How does the live status work?",
    a: "The Supa dam generates hydro-electric power by releasing water into the Kali River. We read its power output from the Karnataka State Load Despatch Centre (KPTCL SLDC) public page every 5 minutes. When the power station is generating, water is flowing downstream and rafting is active; at 0 MW the river is calm and rafting is suspended.",
  },
  {
    q: "Is rafting open during the monsoon?",
    a: "Rafting usually takes a break from about June to September, when heavy rain makes the river unsafe. The season generally runs from October to May, subject to daily dam releases.",
  },
  {
    q: "What can I do if rafting is suspended?",
    a: `Land activities don't depend on the river, so they carry on: ${LAND_ACTIVITIES.join(", ").toLowerCase()}. Call or WhatsApp us on ${CONTACT.phone} and we'll suggest what's running that day.`,
  },
  {
    q: "Where does rafting happen?",
    a: "Rafting on the Kali River happens at Ganeshgudi, about 20km from Dandeli town, not in the town itself.",
  },
];

const formatReadingTime = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const LiveStatusCard = () => {
  // Starts in "loading" so the prerendered HTML never claims a status that
  // may be stale by the time a crawler or visitor reads it.
  const [status, setStatus] = useState({ state: "loading" });

  useEffect(() => {
    let active = true;
    getDamStatus()
      .then((data) => {
        if (active) setStatus({ state: data.status, data });
      })
      .catch(() => {
        if (active) setStatus({ state: "error" });
      });
    return () => {
      active = false;
    };
  }, []);

  const { state, data } = status;
  const view = {
    loading: { dot: "bg-amber-300", title: "Checking live status…", body: "Reading the latest Supa dam data." },
    open: { dot: "bg-emerald-400", title: "Rafting is running", body: "The Supa dam is releasing water — the Kali River has rafting flow right now." },
    closed: { dot: "bg-rose-400", title: "Rafting is suspended right now", body: "The Supa dam isn't releasing water, so the river is calm. Land activities are still running." },
    error: { dot: "bg-slate-400", title: "Live status unavailable", body: "We couldn't read the dam data just now. Call or WhatsApp us for today's status." },
  }[state] ?? { dot: "bg-slate-400", title: "Live status unavailable", body: "Call or WhatsApp us for today's status." };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-white/15 p-6 sm:p-8 shadow-2xl" aria-live="polite">
      <p className="text-xs uppercase tracking-[0.2em] text-[#f5c97a] font-bold mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4" /> Live River Status · Ganeshgudi
      </p>
      <div className="flex items-center gap-3">
        <span className="relative flex h-4 w-4 shrink-0">
          {state !== "error" && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${view.dot}`} />}
          <span className={`relative inline-flex rounded-full h-4 w-4 ${view.dot}`} />
        </span>
        <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white">{view.title}</h2>
      </div>
      <p className="mt-4 text-gray-300 font-body leading-relaxed">{view.body}</p>

      {data && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm text-[#f5c97a]">
          <span>SUPA {data.supaValue} MW</span>
          <span>Unit 1: {data.unit1} MW</span>
          <span>Unit 2: {data.unit2} MW</span>
        </div>
      )}
      {data && (data.readingAt || data.fetchedAt) && (
        <p className="mt-2 text-xs text-gray-400 font-body">
          Reading as of {formatReadingTime(data.readingAt || data.fetchedAt)} IST · refreshed every 5 minutes
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {state === "open" && (
          <Link
            to="/booking"
            className="inline-flex justify-center items-center px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-heading font-black uppercase text-xs tracking-wider hover:bg-amber-300 transition-colors"
          >
            Book a Rafting Slot
          </Link>
        )}
        <a
          href={`https://wa.me/91${CONTACT.whatsapp}?text=${encodeURIComponent("Hi, is rafting running today?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-heading font-bold uppercase text-xs tracking-wider hover:bg-white/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Confirm on WhatsApp
        </a>
        <a
          href={`tel:${CONTACT.phoneRaw}`}
          className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-heading font-bold uppercase text-xs tracking-wider hover:bg-white/20 transition-colors"
        >
          <Phone className="w-4 h-4" /> Call {CONTACT.phone}
        </a>
      </div>

      <p className="mt-5 text-xs text-gray-400 font-body leading-relaxed">
        This status is generated automatically from public dam data. Please call or WhatsApp to confirm before you travel.
      </p>
    </div>
  );
};

const RaftingStatus = () => {
  useSEO({ ...LANDING_PAGES.status });

  return (
    <>
      <LandingHero
        eyebrow="Live River Status"
        current="Is Rafting Open Today?"
        intro="Live Kali River rafting status for Ganeshgudi, Dandeli — read from the Supa dam's power output every 5 minutes. Check before you travel."
        bgImage={bgImage}
      >
        Is Dandeli River Rafting Open Today?
      </LandingHero>

      <section className="bg-[#021915] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
          <LiveStatusCard />

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wider mb-4">
              How the <span className="text-amber-400">Status Works</span>
            </h2>
            <div className="space-y-4 text-gray-300 font-body leading-relaxed">
              <p>
                Rafting at Ganeshgudi depends on water released from the Supa dam upstream. The dam releases water to
                generate hydro-electric power, so its power output tells us whether the Kali River has rafting flow.
              </p>
              <p>
                Every 5 minutes we read the Supa power station's output from the Karnataka State Load Despatch Centre's
                public page (KPTCL SLDC). Above 0 MW, water is flowing and rafting is active. At 0 MW, the river is calm
                and rafting is suspended until the next release.
              </p>
              <p>
                Releases are decided day by day, so the status can change during the day. Read more about the river in
                our <Link to={guidePath("dandeli-river-guide")} className="text-cyan-400 underline underline-offset-4">Dandeli river guide</Link>.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wider mb-6 flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-cyan-400" />
              Rafting <span className="text-amber-400">Season</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SEASONS.map(({ months, status, body }) => (
                <div key={months} className="rounded-2xl bg-slate-900/60 border border-white/10 p-5">
                  <p className="text-sm font-heading font-black uppercase text-white">{months}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mt-1">{status}</p>
                  <p className="text-sm text-gray-300 font-body leading-relaxed mt-3">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400 font-body">
              We're open daily, {CONTACT.hours.replace("Open Daily · ", "")}. Month-by-month details are in our{" "}
              <Link to={guidePath("best-time-to-visit-dandeli")} className="text-cyan-400 underline underline-offset-4">
                best time to visit Dandeli
              </Link>{" "}
              guide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wider mb-4 flex items-center gap-3">
              <Mountain className="w-7 h-7 text-cyan-400" />
              If Rafting Is <span className="text-amber-400">Suspended</span>
            </h2>
            <p className="text-gray-300 font-body leading-relaxed mb-4">
              These activities don't depend on the river, so your trip still works on a calm-river day:
            </p>
            <ul className="flex flex-wrap gap-2">
              {LAND_ACTIVITIES.map((name) => (
                <li key={name} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-body text-gray-200">
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-400 font-body">
              See all routes and prices on the{" "}
              <Link to="/rafting-in-dandeli/" className="text-cyan-400 underline underline-offset-4">rafting in Dandeli</Link>{" "}
              page.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />

      <GuideLinks
        heading="Plan Your"
        highlight="Trip"
        slugs={["best-time-to-visit-dandeli", "kali-river-rafting-first-timers-guide", "how-to-reach-dandeli"]}
      />

      <LandingCta
        heading="Planning Your Rafting Day?"
        subheading="Message us on WhatsApp with your date and group size — we'll confirm the river status and your slot."
      />
    </>
  );
};

export default RaftingStatus;
