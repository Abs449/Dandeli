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
  "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none";
const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
const errorClass = "mt-1 text-sm text-red-600";

const SectionTitle = ({ children }) => (
  <h3 className="text-xl font-heading font-bold text-gray-900 mb-6 border-b pb-2 flex items-center gap-2">
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
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      whatsapp: "",
      package_name: prefillPackage,
      preferred_date: "",
      adults: 2,
      children: 0,
      accommodation: false,
      transportation: false,
      food_package: false,
      special_requests: "",
    },
  });

  // Keep package_name in sync with URL param (e.g. user navigates with new ?package=)
  useEffect(() => {
    reset((prev) => ({ ...prev, package_name: prefillPackage }));
  }, [prefillPackage, reset]);

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
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-20 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
            Booking received!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for choosing Dandeli Adventure. We've received your
            inquiry and our team will contact you shortly to confirm the
            details.
          </p>
          <Link
            to="/"
            className="block w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-river uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3">
            Plan your trip
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4">
            Book Your <span className="text-accent">Adventure</span>
          </h1>
          <p className="text-lg text-gray-600">
            Fill out the form and we'll get back to you within 24 hours to
            confirm your trip.
          </p>
        </div>

        {submitState.status === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>{submitState.error}</p>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 sm:p-12"
            noValidate
          >
            <div className="mb-10">
              <SectionTitle>
                <User size={18} className="text-secondary" />
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
                <CalendarDays size={18} className="text-secondary" />
                Booking information
              </SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="package_name">
                    Select package
                  </label>
                  <select
                    id="package_name"
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
                      className={fieldClass}
                      {...register("children", { min: 0 })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <Users size={18} className="text-secondary" />
                Add-ons
              </SectionTitle>
              <div className="space-y-3">
                {[
                  {
                    name: "accommodation",
                    label: "Accommodation required",
                    Icon: HomeIcon,
                  },
                  {
                    name: "transportation",
                    label: "Transportation (pickup / drop-off)",
                    Icon: Car,
                  },
                  {
                    name: "food_package",
                    label: "Include food package",
                    Icon: Utensils,
                  },
                ].map(({ name, label, Icon }) => (
                  <label
                    key={name}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
                      {...register(name)}
                    />
                    <Icon size={18} className="text-gray-500" />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <SectionTitle>
                <MessageSquare size={18} className="text-secondary" />
                Anything else?
              </SectionTitle>
              <textarea
                rows={4}
                placeholder="Allergies, special requirements, questions…"
                className={`${fieldClass} resize-none`}
                {...register("special_requests")}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:+917075805883`}
                className="sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-white border border-secondary text-secondary py-4 rounded-xl font-bold hover:bg-secondary hover:text-white transition-colors"
              >
                <Phone size={18} />
                Call instead
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Mail size={18} />
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
