import { Clock } from "lucide-react";
import { getDifficultyColor } from "../../lib/difficultyColor";
import { CONTACT } from "../../lib/contact";

const ActivityCard = ({ item }) => {
  const whatsappUrl = `https://wa.me/91${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hey Karthik, I want to know more about ${item.name}`,
  )}`;

  return (
    <article className="bg-slate-900/90 border border-white/15 hover:border-cyan-400/40 rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:-translate-y-1">
      <div className="h-44 sm:h-48 relative overflow-hidden">
        <img
          src={item.image}
          alt={`${item.name} in Dandeli, Karnataka`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-heading font-black uppercase tracking-wider ${getDifficultyColor(item.difficulty)}`}
        >
          {item.difficulty}
        </span>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg font-heading font-black text-white mb-2 leading-snug">{item.name}</h3>
        <p className="text-sm text-gray-300 font-body leading-relaxed mb-4 flex-1">{item.shortDescription}</p>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs font-body text-gray-300 mb-4">
          <span className="inline-flex items-center gap-1.5 text-cyan-300">
            <Clock size={13} />
            {item.duration}
          </span>
          <span className="text-lg font-heading font-black text-amber-400">{item.price}</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-3 bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 border border-white/20 hover:border-amber-400"
        >
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  );
};

export default ActivityCard;
