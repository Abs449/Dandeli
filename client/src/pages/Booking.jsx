import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
  Users,
  Home as HomeIcon,
  Car,
  Utensils,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { submitBookingToSheets } from "../lib/sheets";
import { usePackages } from "../lib/data";

const fieldClass =
  "w-full px-5 py-3.5 rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-md focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all duration-300 outline-none shadow-sm text-white text-sm";
const labelClass =
  "block text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2 font-heading";
const errorClass = "mt-1.5 text-xs font-semibold text-rose-400";

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-heading font-black text-white mb-6 border-b border-white/15 pb-3 flex items-center gap-2">
    {children}
  </h3>
);

const Booking = () => {
  const { data: packages } = usePackages();
  const [searchParams] = useSearchParams();
  const prefillPackage = searchParams.get("package") || "";

  const [submitState, setSubmitState] = useState({
    status: "idle",
    error: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      whatsapp: "",
      package_name: "",
      preferred_date: "",
      adults: 2,
      children: 0,
      accommodation: false,
      transportation: false,
      food_package: false,
      special_requests: "",
    },
  });

  // Keep package_name in sync with URL param (matches package ID to package name)
  useEffect(() => {
    if (!prefillPackage) return;

    if (packages) {
      const matched = packages.find(
        (pkg) =>
          String(pkg.id) === String(prefillPackage) ||
          pkg.name === prefillPackage,
      );
      if (matched) {
        setValue("package_name", matched.name);
        return;
      }
    }

    setValue("package_name", prefillPackage);
  }, [prefillPackage, packages, setValue]);

  const onSubmit = async (data) => {
    setSubmitState({ status: "submitting", error: null });

    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      whatsapp: data.whatsapp?.trim() || null,
      package_name: data.package_name || null,
      preferred_date: data.preferred_date || null,
      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,
      accommodation: Boolean(data.accommodation),
      transportation: Boolean(data.transportation),
      food_package: Boolean(data.food_package),
      special_requests: data.special_requests?.trim() || null,
    };

    const sheetsResult = await submitBookingToSheets(payload);

if (!sheetsResult.ok) {
  setSubmitState({
    status: "error",
    error: "Could not submit your booking. Please try again or call us.",
  });

  return;
}

setSubmitState({ status: "success", error: null });

window.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#021915] py-20 px-4 relative overflow-hidden text-white">
        <div className="absolute top-20 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/90 backdrop-blur-xl p-10 rounded-4xl shadow-2xl text-center max-w-md w-full border border-cyan-500/30 relative z-10 text-white"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-cyan-950 rounded-full border border-cyan-500/40">
              <CheckCircle className="w-14 h-14 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-black text-white mb-4 tracking-tight">
            Booking Received!
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed font-body text-sm sm:text-base">
            Thank you for choosing Dandeli Adventure. We've received your
            inquiry and our team will contact you shortly to confirm the
            details.
          </p>
          <Link
            to="/"
            className="block w-full bg-amber-400 hover:bg-yellow-300 text-slate-950 py-4 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-400/25 hover:-translate-y-0.5"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#021915] pt-24 sm:pt-28 pb-14 sm:pb-18 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden text-white">
      <div className="absolute top-20 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-cyan-400 uppercase tracking-[0.3em] text-xs font-bold mb-3 bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
            Plan your trip
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase text-white mb-3 tracking-wider leading-snug">
            Book Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-200 pr-1">
              Adventure
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-body">
            Fill out the form and we'll get back to you within 24 hours to
            confirm your trip.
          </p>
        </div>

        {submitState.status === "error" && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500/30 text-rose-300 rounded-2xl flex items-start gap-3 shadow-sm font-medium">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />
            <p className="text-sm">{submitState.error}</p>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/90 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/15 overflow-hidden"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 sm:p-12"
            noValidate
          >
            <div className="mb-10">
              <SectionTitle>
                <User size={18} className="text-cyan-400" />
                Customer details
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className={fieldClass}
                    {...register("full_name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.full_name && (
                    <p className={errorClass}>{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Email address *</label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    className={fieldClass}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Phone number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={fieldClass}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\s-]{8,15}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className={errorClass}>{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>WhatsApp number (optional)</label>
                  <input
                    type="tel"
                    placeholder="Same as phone if left empty"
                    className={fieldClass}
                    {...register("whatsapp")}
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <CalendarDays size={18} className="text-cyan-400" />
                Trip specifications
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>Select package/activity</label>
                  <select className={`${fieldClass} cursor-pointer`} {...register("package_name")}>
                    <option value="" className="bg-slate-900 text-white">Select a package (optional)</option>
                    {packages?.map((pkg) => (
                      <option key={pkg.id} value={pkg.name} className="bg-slate-900 text-white">
                        {pkg.name} ({pkg.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Preferred date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={fieldClass}
                    {...register("preferred_date")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Adults (12+ yrs)</label>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cyan-400 shrink-0" />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      className={fieldClass}
                      {...register("adults", {
                        required: true,
                        min: { value: 1, message: "At least 1 adult required" },
                      })}
                    />
                  </div>
                  {errors.adults && (
                    <p className={errorClass}>{errors.adults.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Children (under 12 yrs)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    className={fieldClass}
                    {...register("children")}
                  />
                </div>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <HomeIcon size={18} className="text-cyan-400" />
                Add-on services (optional)
              </SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register("accommodation")}
                  />
                  <div className="flex items-center gap-2">
                    <HomeIcon size={16} className="text-cyan-400" />
                    <span className="text-xs font-heading font-bold text-white">Resort Stay</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register("transportation")}
                  />
                  <div className="flex items-center gap-2">
                    <Car size={16} className="text-cyan-400" />
                    <span className="text-xs font-heading font-bold text-white">Pickup/Drop</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register("food_package")}
                  />
                  <div className="flex items-center gap-2">
                    <Utensils size={16} className="text-cyan-400" />
                    <span className="text-xs font-heading font-bold text-white">Food Package</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <MessageSquare size={18} className="text-cyan-400" />
                Special requests / notes
              </SectionTitle>
              <textarea
                rows={3}
                placeholder="Mention any custom requirement, group size questions, or specific activity requests…"
                className={fieldClass}
                {...register("special_requests")}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+917075805883"
                className="sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-950 border border-white/15 hover:bg-slate-900 text-gray-200 py-4 px-8 rounded-full font-bold transition-all duration-300 shadow-sm cursor-pointer text-sm font-heading"
              >
                <Phone size={16} className="text-cyan-400" />
                Call instead
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 bg-amber-400 hover:bg-yellow-300 text-slate-950 py-4 px-8 rounded-full font-heading font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    Submit booking inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
