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
import { submitBooking } from "../lib/data";
import { submitBookingToSheets } from "../lib/sheets";
import { usePackages } from "../lib/data";

const fieldClass =
  "w-full px-5 py-3.5 rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 outline-none shadow-sm text-gray-900 text-sm";
const labelClass = "block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2";
const errorClass = "mt-1.5 text-xs font-semibold text-red-600";

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-heading font-black text-gray-900 mb-6 border-b border-neutral-200/50 pb-3 flex items-center gap-2">
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
    reset,
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
    if (packages && prefillPackage) {
      const matched = packages.find(
        (pkg) => String(pkg.id) === String(prefillPackage) || pkg.name === prefillPackage
      );
      if (matched) {
        setValue("package_name", matched.name);
      }
    }
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

    // Supabase is the source of truth.
    const dbResult = await submitBooking(payload);
    if (!dbResult.ok) {
      setSubmitState({
        status: "error",
        error:
          dbResult.reason === "not-configured"
            ? "Submissions are temporarily unavailable. Please call us directly."
            : "Could not save your booking. Please try again or call us.",
      });
      return;
    }

    // Sheets is best-effort — never blocks the success screen.
    submitBookingToSheets(payload).catch(() => {});

    setSubmitState({ status: "success", error: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitState.status === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#e0f2fe] via-[#f5efe6] to-[#decbb7] py-20 px-4 relative overflow-hidden">
        {/* Decorative blurry backgrounds */}
        <div className="absolute top-20 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/95 backdrop-blur-md p-10 rounded-4xl shadow-xl text-center max-w-md w-full border border-neutral-200/50 relative z-10 text-gray-900"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
              <CheckCircle className="w-14 h-14 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-3xl font-heading font-black text-gray-900 mb-4 tracking-tight">
            Booking Received!
          </h2>
          <p className="text-gray-655 mb-8 leading-relaxed font-body text-sm sm:text-base">
            Thank you for choosing Dandeli Adventure. We've received your
            inquiry and our team will contact you shortly to confirm the
            details.
          </p>
          <Link
            to="/"
            className="block w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-full font-heading font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-primary/20 hover:-translate-y-0.5"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#e0f2fe] via-[#f5efe6] to-[#decbb7] py-20 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden text-gray-900">
      {/* Decorative blurry backgrounds */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-bold mb-3">
            Plan your trip
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 mb-4 tracking-tight">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-river">Adventure</span>
          </h1>
          <p className="text-lg text-gray-655 font-body">
            Fill out the form and we'll get back to you within 24 hours to confirm your trip.
          </p>
        </div>

        {submitState.status === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-750 rounded-2xl flex items-start gap-3 shadow-sm font-medium">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm">{submitState.error}</p>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-md rounded-4xl shadow-xl border border-neutral-200/50 overflow-hidden"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 sm:p-12"
            noValidate
          >
            <div className="mb-10">
              <SectionTitle>
                <User size={18} className="text-primary" />
                Customer details
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} htmlFor="full_name">
                    Full name *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("full_name", {
                      required: "Please enter your name",
                      minLength: { value: 2, message: "Too short" },
                    })}
                  />
                  {errors.full_name && (
                    <p className={errorClass}>{errors.full_name.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="email">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">
                    Phone number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("phone", {
                      required: "Please enter your phone number",
                      pattern: {
                        value: /^[+\d\s()-]{8,20}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className={errorClass}>{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass} htmlFor="whatsapp">
                    WhatsApp number (optional)
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Same as phone number"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("whatsapp", {
                      pattern: {
                        value: /^[+\d\s()-]{8,20}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                  {errors.whatsapp && (
                    <p className={errorClass}>{errors.whatsapp.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <CalendarDays size={18} className="text-primary" />
                Booking information
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="package_name">
                    Select package
                  </label>
                  <select
                    id="package_name"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("package_name")}
                  >
                    <option value="">— Choose a package —</option>
                    {packages?.map((pkg) => (
                      <option key={pkg.id} value={pkg.name}>
                        {pkg.name} ({pkg.price}/person)
                      </option>
                    ))}
                    <option value="custom">Custom experience</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="preferred_date">
                    Preferred date
                  </label>
                  <input
                    id="preferred_date"
                    type="date"
                    disabled={isSubmitting}
                    className={fieldClass}
                    {...register("preferred_date")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} htmlFor="adults">
                      Adults *
                    </label>
                    <input
                      id="adults"
                      type="number"
                      min="1"
                      disabled={isSubmitting}
                      className={fieldClass}
                      {...register("adults", {
                        required: true,
                        min: { value: 1, message: "At least 1 adult" },
                      })}
                    />
                    {errors.adults && (
                      <p className={errorClass}>{errors.adults.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="children">
                      Children
                    </label>
                    <input
                      id="children"
                      type="number"
                      min="0"
                      disabled={isSubmitting}
                      className={fieldClass}
                      {...register("children", { min: 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <Users size={18} className="text-primary" />
                Add-ons
              </SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "accommodation",
                    label: "Accommodation",
                    Icon: HomeIcon,
                  },
                  {
                    name: "transportation",
                    label: "Transportation",
                    Icon: Car,
                  },
                  {
                    name: "food_package",
                    label: "All meals package",
                    Icon: Utensils,
                  },
                ].map(({ name, label, Icon }) => (
                  <label
                    key={name}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-neutral-200/60 bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white hover:border-primary/20 transition-all duration-300 select-none shadow-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-300"
                      {...register(name)}
                    />
                    <Icon className="w-4 h-4 text-river shrink-0" />
                    <span className="text-xs font-bold text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <MessageSquare size={18} className="text-primary" />
                Anything else?
              </SectionTitle>
              <textarea
                rows={4}
                placeholder="Allergies, special requirements, questions…"
                disabled={isSubmitting}
                className={`${fieldClass} resize-none`}
                {...register("special_requests")}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:+917075805883`}
                className="sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:border-secondary/30 text-gray-750 py-4 px-8 rounded-full font-bold transition-all duration-300 hover:bg-neutral-50 shadow-sm hover:shadow cursor-pointer text-sm"
              >
                <Phone size={16} className="text-river" />
                Call instead
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-full font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:-translate-y-0.5 shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
