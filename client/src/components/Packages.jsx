import { useNavigate } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { usePackages } from "../lib/data";

const PackageCard = ({ pkg, navigate }) => {
  const recommended = pkg.recommended;

  return (
    <article
      className={`relative rounded-4xl overflow-hidden transition-shadow duration-300 ${
        recommended
          ? "bg-primary text-white shadow-2xl ring-2 ring-accent/40"
          : "bg-white border border-gray-100 text-gray-900 shadow-xl hover:shadow-2xl"
      }`}
    >
      {recommended && (
        <div className="absolute -top-px right-6 bg-accent text-gray-900 px-4 py-1.5 rounded-b-xl text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-md z-10">
          <Sparkles size={14} />
          Most Popular
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Image — full width banner on mobile, fixed left column on desktop */}
        <div className="md:w-2/5 h-56 md:min-h-80 relative overflow-hidden shrink-0">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {recommended && (
            <div className="absolute inset-0 bg-linear-to-r from-primary/40 to-transparent" />
          )}
        </div>

        {/* Content */}
        <div className="md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col">
          <div className="mb-6">
            <h3
              className={`text-2xl sm:text-3xl font-heading font-extrabold mb-2 ${
                recommended ? "text-white" : "text-gray-900"
              }`}
            >
              {pkg.name}
            </h3>
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                  recommended ? "text-accent" : "text-secondary"
                }`}
              >
                {pkg.price}
              </span>
              <span
                className={`text-sm font-medium ${
                  recommended ? "text-gray-300" : "text-gray-500"
                }`}
              >
                per person
              </span>
              <span
                className={`ml-auto inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  recommended
                    ? "bg-white/15 text-gray-100"
                    : "bg-green-50 text-secondary"
                }`}
              >
                {pkg.duration}
              </span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {(pkg.activities || []).map((activity, idx) => (
              <li key={idx} className="flex items-start">
                <Check
                  className={`w-5 h-5 mr-3 shrink-0 mt-0.5 ${
                    recommended ? "text-accent" : "text-secondary"
                  }`}
                />
                <span
                  className={`font-body leading-relaxed ${
                    recommended ? "text-gray-100" : "text-gray-600"
                  }`}
                >
                  {activity}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate(`/booking?package=${pkg.id}`)}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:-translate-y-0.5 ${
              recommended
                ? "bg-accent hover:bg-accent/90 text-white"
                : "bg-primary hover:bg-primary-dark text-white"
            }`}
          >
            Book {pkg.name}
          </button>
        </div>
      </div>
    </article>
  );
};

const Packages = () => {
  const { data: packages, loading } = usePackages();
  const navigate = useNavigate();

  return (
    <section
      id="packages"
      className="py-24 bg-green-50/50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
            Packages
          </span>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Choose your adventure
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-body">
            Carefully designed packages for the best value and an unforgettable
            experience in Dandeli.
          </p>
        </div>

        {loading && (
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 rounded-4xl bg-white/60 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        )}

        <div className="space-y-8">
          {packages?.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
