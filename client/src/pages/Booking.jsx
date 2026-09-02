import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";

import { submitBookingToSheets } from "../lib/sheets";
import { usePackages } from "../lib/data";

const fieldClass =
  "w-full min-w-0 box-border px-5 py-3.5 rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-md focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 transition-all duration-300 outline-none shadow-sm text-white text-sm";

const labelClass =
  "block text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-2 font-heading";

const errorClass =
  "mt-1.5 text-xs font-semibold text-rose-400";

const countryCodes = [
  {
    code: "+91",
    short: "IN +91",
    label: "India (+91)",
  },
  {
    code: "+1",
    short: "US +1",
    label: "USA/Canada (+1)",
  },
  {
    code: "+44",
    short: "UK +44",
    label: "UK (+44)",
  },
  {
    code: "+971",
    short: "AE +971",
    label: "UAE (+971)",
  },
  {
    code: "+65",
    short: "SG +65",
    label: "Singapore (+65)",
  },
  {
    code: "+61",
    short: "AU +61",
    label: "Australia (+61)",
  },
  {
    code: "+49",
    short: "DE +49",
    label: "Germany (+49)",
  },
  {
    code: "+33",
    short: "FR +33",
    label: "France (+33)",
  },
  {
    code: "+977",
    short: "NP +977",
    label: "Nepal (+977)",
  },
  {
    code: "+94",
    short: "LK +94",
    label: "Sri Lanka (+94)",
  },
];

const getLocalDateString = (date = new Date()) => {
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
};

/*
 * Phone number sanitization
 * Keeps digits only and limits the number to 14 digits.
 */
const sanitizeDigits = (value) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 14);

/*
 * Prevent non-numeric characters from being entered.
 */
const preventNonDigits = (e) => {
  if (e.data && /\D/.test(e.data)) {
    e.preventDefault();
  }
};

/*
 * Sanitize names.
 */
const sanitizeName = (value) =>
  value
    .replace(/[^\p{L}\p{M}\s'.-]/gu, "")
    .slice(0, 60);

/*
 * Responsive custom country selector.
 *
 * Mobile:
 *   IN +91
 *
 * Desktop:
 *   India (+91)
 */
const CountryCodeSelect = ({
  value,
  onChange,
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected =
    countryCodes.find(
      (country) => country.code === value
    ) || countryCodes[0];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[78px] sm:w-[110px] shrink-0"
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`${fieldClass} w-full h-full px-2 sm:px-3 flex items-center justify-between gap-1 cursor-pointer text-xs sm:text-sm`}
      >
        <span className="truncate">
          <span className="sm:hidden">
            {selected.short}
          </span>

          <span className="hidden sm:inline">
            {selected.label}
          </span>
        </span>

        <svg
          className={`w-3 h-3 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[210px] sm:w-[230px] max-h-60 overflow-y-auto z-[100] rounded-xl border border-white/15 bg-slate-900 shadow-2xl">
          {countryCodes.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onChange(country.code);
                setOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                country.code === value
                  ? "bg-cyan-500/15 text-cyan-300"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {country.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-heading font-black text-white mb-6 border-b border-white/15 pb-3 flex items-center gap-2">
    {children}
  </h3>
);

const Booking = () => {
  const { data: packages } = usePackages();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefillPackage =
    searchParams.get("package") || "";

  const [todayLocal] = useState(() =>
    getLocalDateString()
  );

  const [submitState, setSubmitState] = useState({
    status: "idle",
    error: null,
  });

  const [whatsappTouched, setWhatsappTouched] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",

    defaultValues: {
      full_name: "",
      email: "",

      phone_country_code: "+91",
      phone_number: "",

      whatsapp_country_code: "+91",
      whatsapp_number: "",

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

  const phoneNumber = watch("phone_number");
  const phoneCountryCode = watch(
    "phone_country_code"
  );

  const whatsappCountryCode = watch(
    "whatsapp_country_code"
  );

  /*
   * Mirror phone number into WhatsApp until
   * WhatsApp is manually changed.
   */
  useEffect(() => {
    if (whatsappTouched) return;

    setValue(
      "whatsapp_country_code",
      phoneCountryCode
    );

    setValue(
      "whatsapp_number",
      phoneNumber
    );
  }, [
    phoneNumber,
    phoneCountryCode,
    whatsappTouched,
    setValue,
  ]);

  /*
   * Pre-fill package/activity from URL.
   */
  useEffect(() => {
    if (!prefillPackage) return;

    if (packages) {
      const matched = packages.find(
        (pkg) =>
          String(pkg.id) === String(prefillPackage) ||
          pkg.name === prefillPackage
      );

      if (matched) {
        setValue("package_name", matched.name);
        return;
      }
    }

    setValue("package_name", prefillPackage);
  }, [
    prefillPackage,
    packages,
    setValue,
  ]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const onSubmit = async (data) => {
    setSubmitState({
      status: "submitting",
      error: null,
    });

    const phoneNumberClean = sanitizeDigits(
      data.phone_number
    );

    const whatsappNumberClean = sanitizeDigits(
      data.whatsapp_number
    );

    const phone =
      `${data.phone_country_code}${phoneNumberClean}`;

    const whatsapp = whatsappNumberClean
      ? `${data.whatsapp_country_code}${whatsappNumberClean}`
      : null;

    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim(),

      phone,
      whatsapp,

      package_name:
        data.package_name || null,

      preferred_date:
        data.preferred_date || null,

      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,

      accommodation:
        Boolean(data.accommodation),

      transportation:
        Boolean(data.transportation),

      food_package:
        Boolean(data.food_package),

      special_requests:
        data.special_requests?.trim() || null,
    };

    try {
      const sheetsResult =
        await submitBookingToSheets(payload);

      if (!sheetsResult?.ok) {
        setSubmitState({
          status: "error",
          error:
            "Could not submit your booking. Please try again or call us.",
        });

        return;
      }

      setSubmitState({
        status: "success",
        error: null,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Booking submission error:",
        error
      );

      setSubmitState({
        status: "error",
        error:
          "Could not submit your booking. Please try again or call us.",
      });
    }
  };

  /*
   * SUCCESS SCREEN
   */
  if (submitState.status === "success") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#021915] py-16 sm:py-20 px-4 relative overflow-hidden text-white">

        <div className="absolute top-20 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="absolute bottom-20 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-10 rounded-4xl shadow-2xl text-center max-w-md w-full border border-cyan-500/30 relative z-10 text-white"
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
            Thank you for choosing Dandeli Adventure.
            We've received your inquiry and our team
            will contact you shortly to confirm the
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

  /*
   * MAIN FORM
   */
  return (
    <div className="bg-[#021915] pt-24 sm:pt-28 pb-14 sm:pb-18 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden text-white">

      <div className="absolute top-20 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute bottom-20 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Increased from max-w-3xl */}
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-cyan-300 mb-6 sm:mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Page heading */}
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
            Fill out the form and we'll get back to you
            within 24 hours to confirm your trip.
          </p>
        </div>

        {/* Submission error */}
        {submitState.status === "error" && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500/30 text-rose-300 rounded-2xl flex items-start gap-3 shadow-sm font-medium">

            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400" />

            <p className="text-sm">
              {submitState.error}
            </p>
          </div>
        )}

        {/* Form card */}
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="bg-slate-900/90 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/15 overflow-hidden"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-5 sm:p-8 lg:p-12"
            noValidate
          >

            {/* =====================================
                CUSTOMER DETAILS
            ====================================== */}

            <div className="mb-10">

              <SectionTitle>
                <User
                  size={18}
                  className="text-cyan-400"
                />
                Customer details
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* FULL NAME */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Full name *
                  </label>

                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Rahul Sharma"
                    className={fieldClass}
                    {...register("full_name", {
                      required:
                        "Full name is required",

                      onChange: (e) => {
                        e.target.value =
                          sanitizeName(
                            e.target.value
                          );
                      },

                      minLength: {
                        value: 2,
                        message:
                          "Name must be at least 2 characters",
                      },

                      maxLength: {
                        value: 60,
                        message:
                          "Name must be under 60 characters",
                      },

                      validate: (value) => {
                        const trimmed =
                          value.trim();

                        if (!trimmed) {
                          return "Full name is required";
                        }

                        if (
                          trimmed.length < 2
                        ) {
                          return "Name must be at least 2 characters";
                        }

                        return true;
                      },
                    })}
                  />

                  {errors.full_name && (
                    <p className={errorClass}>
                      {errors.full_name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Email address *
                  </label>

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="rahul@example.com"
                    className={fieldClass}
                    {...register("email", {
                      required:
                        "Email is required",

                      maxLength: {
                        value: 254,
                        message:
                          "Email address is too long",
                      },

                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                        message:
                          "Enter a valid email address",
                      },

                      validate: (value) => {
                        if (
                          value.trim() !== value
                        ) {
                          return "Email cannot start or end with spaces";
                        }

                        return true;
                      },
                    })}
                  />

                  {errors.email && (
                    <p className={errorClass}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* =================================
                    PHONE NUMBER
                ================================== */}

                <div className="min-w-0">

                  <label className={labelClass}>
                    Phone number *
                  </label>

                  <div className="flex w-full min-w-0 gap-2">

                    <CountryCodeSelect
                      value={phoneCountryCode}
                      onChange={(code) => {
                        setValue(
                          "phone_country_code",
                          code,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        );
                      }}
                      ariaLabel="Phone country code"
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={14}
                      placeholder="98765 43210"
                      className={`${fieldClass} flex-1 min-w-0`}
                      {...register(
                        "phone_number",
                        {
                          required:
                            "Phone number is required",

                          onBeforeInput:
                            preventNonDigits,

                          onChange: (e) => {
                            e.target.value =
                              sanitizeDigits(
                                e.target.value
                              );
                          },

                          validate: (value) => {
                            const cleanValue =
                              sanitizeDigits(
                                value
                              );

                            if (!cleanValue) {
                              return "Phone number is required";
                            }

                            if (
                              cleanValue.length < 6
                            ) {
                              return "Phone number must contain at least 6 digits";
                            }

                            if (
                              cleanValue.length > 14
                            ) {
                              return "Phone number cannot exceed 14 digits";
                            }

                            return true;
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.phone_number && (
                    <p className={errorClass}>
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                {/* =================================
                    WHATSAPP NUMBER
                ================================== */}

                <div className="min-w-0">

                  <label className={labelClass}>
                    WhatsApp number (optional)
                  </label>

                  <div className="flex w-full min-w-0 gap-2">

                    <CountryCodeSelect
                      value={whatsappCountryCode}
                      onChange={(code) => {
                        setWhatsappTouched(
                          true
                        );

                        setValue(
                          "whatsapp_country_code",
                          code,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          }
                        );
                      }}
                      ariaLabel="WhatsApp country code"
                    />

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={14}
                      placeholder="Same as phone if left empty"
                      className={`${fieldClass} flex-1 min-w-0`}
                      {...register(
                        "whatsapp_number",
                        {
                          onBeforeInput:
                            preventNonDigits,

                          onChange: (e) => {
                            e.target.value =
                              sanitizeDigits(
                                e.target.value
                              );

                            setWhatsappTouched(
                              true
                            );
                          },

                          validate: (value) => {
                            if (!value) {
                              return true;
                            }

                            const cleanValue =
                              sanitizeDigits(
                                value
                              );

                            if (
                              cleanValue.length < 6
                            ) {
                              return "WhatsApp number must contain at least 6 digits";
                            }

                            if (
                              cleanValue.length > 14
                            ) {
                              return "WhatsApp number cannot exceed 14 digits";
                            }

                            return true;
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.whatsapp_number && (
                    <p className={errorClass}>
                      {
                        errors.whatsapp_number
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================
                TRIP SPECIFICATIONS
            ====================================== */}

            <div className="mb-10">

              <SectionTitle>
                <CalendarDays
                  size={18}
                  className="text-cyan-400"
                />
                Trip specifications
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* PACKAGE */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Select package/activity
                  </label>

                  <select
                    className={`${fieldClass} cursor-pointer`}
                    {...register(
                      "package_name"
                    )}
                  >
                    <option
                      value=""
                      className="bg-slate-900 text-white"
                    >
                      Select a package (optional)
                    </option>

                    {packages?.map((pkg) => (
                      <option
                        key={pkg.id}
                        value={pkg.name}
                        className="bg-slate-900 text-white"
                      >
                        {pkg.name} ({pkg.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATE */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Preferred date
                  </label>

                  <input
                    type="date"
                    min={todayLocal}
                    className={fieldClass}
                    {...register(
                      "preferred_date",
                      {
                        validate: (value) => {
                          if (!value) {
                            return true;
                          }

                          if (
                            value < todayLocal
                          ) {
                            return "Preferred date can't be in the past";
                          }

                          return true;
                        },
                      }
                    )}
                  />

                  {errors.preferred_date && (
                    <p className={errorClass}>
                      {
                        errors.preferred_date
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* ADULTS / CHILDREN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* ADULTS */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Adults (12+ yrs)
                  </label>

                  <div className="flex items-center gap-3">

                    <Users className="w-5 h-5 text-cyan-400 shrink-0" />

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={`${fieldClass} flex-1 min-w-0`}
                      {...register("adults", {
                        required:
                          "At least 1 adult is required",

                        onChange: (e) => {
                          let value =
                            e.target.value.replace(
                              /\D/g,
                              ""
                            );

                          value =
                            value.replace(
                              /^0+(?=\d)/,
                              ""
                            );

                          value =
                            value.slice(0, 2);

                          if (
                            value !== "" &&
                            Number(value) > 50
                          ) {
                            value = "50";
                          }

                          e.target.value = value;
                        },

                        setValueAs: (value) => {
                          if (value === "") {
                            return 0;
                          }

                          const digits =
                            String(value).replace(
                              /\D/g,
                              ""
                            );

                          return digits
                            ? Number(digits)
                            : 0;
                        },

                        validate: (value) => {
                          if (value === "") {
                            return "At least 1 adult is required";
                          }

                          const number =
                            Number(value);

                          if (
                            !Number.isInteger(
                              number
                            )
                          ) {
                            return "Enter a whole number";
                          }

                          if (number < 1) {
                            return "At least 1 adult is required";
                          }

                          if (number > 50) {
                            return "Maximum 50 adults per booking";
                          }

                          return true;
                        },
                      })}
                    />
                  </div>

                  {errors.adults && (
                    <p className={errorClass}>
                      {errors.adults.message}
                    </p>
                  )}
                </div>

                {/* CHILDREN */}
                <div className="min-w-0">

                  <label className={labelClass}>
                    Children (under 12 yrs)
                  </label>

                  <div className="flex items-center gap-3">

                    <Users className="w-5 h-5 text-cyan-400 shrink-0" />

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={`${fieldClass} flex-1 min-w-0`}
                      {...register(
                        "children",
                        {
                          onChange: (e) => {
                            let value =
                              e.target.value.replace(
                                /\D/g,
                                ""
                              );

                            value =
                              value.replace(
                                /^0+(?=\d)/,
                                ""
                              );

                            value =
                              value.slice(0, 2);

                            if (
                              value !== "" &&
                              Number(value) > 50
                            ) {
                              value = "50";
                            }

                            e.target.value =
                              value;
                          },

                          setValueAs: (value) => {
                            if (
                              value === ""
                            ) {
                              return 0;
                            }

                            const digits =
                              String(
                                value
                              ).replace(
                                /\D/g,
                                ""
                              );

                            return digits
                              ? Number(digits)
                              : 0;
                          },

                          validate: (value) => {
                            if (
                              value === "" ||
                              value === undefined ||
                              value === null
                            ) {
                              return true;
                            }

                            const number =
                              Number(value);

                            if (
                              !Number.isInteger(
                                number
                              )
                            ) {
                              return "Enter a whole number";
                            }

                            if (number < 0) {
                              return "Number of children cannot be negative";
                            }

                            if (number > 50) {
                              return "Maximum 50 children per booking";
                            }

                            return true;
                          },
                        }
                      )}
                    />
                  </div>

                  {errors.children && (
                    <p className={errorClass}>
                      {errors.children.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================
                ADD-ON SERVICES
            ====================================== */}

            <div className="mb-10">

              <SectionTitle>
                <HomeIcon
                  size={18}
                  className="text-cyan-400"
                />
                Add-on services (optional)
              </SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* RESORT STAY */}
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register(
                      "accommodation"
                    )}
                  />

                  <div className="flex items-center gap-2">

                    <HomeIcon
                      size={16}
                      className="text-cyan-400"
                    />

                    <span className="text-xs font-heading font-bold text-white">
                      Resort Stay
                    </span>
                  </div>
                </label>

                {/* PICKUP/DROP */}
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register(
                      "transportation"
                    )}
                  />

                  <div className="flex items-center gap-2">

                    <Car
                      size={16}
                      className="text-cyan-400"
                    />

                    <span className="text-xs font-heading font-bold text-white">
                      Pickup/Drop
                    </span>
                  </div>
                </label>

                {/* FOOD PACKAGE */}
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-white/15 bg-slate-950/60 cursor-pointer hover:border-cyan-400/40 transition-all">

                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-white/20 bg-slate-900"
                    {...register(
                      "food_package"
                    )}
                  />

                  <div className="flex items-center gap-2">

                    <Utensils
                      size={16}
                      className="text-cyan-400"
                    />

                    <span className="text-xs font-heading font-bold text-white">
                      Food Package
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* =====================================
                SPECIAL REQUESTS
            ====================================== */}

            <div className="mb-10">

              <SectionTitle>
                <MessageSquare
                  size={18}
                  className="text-cyan-400"
                />
                Special requests / notes
              </SectionTitle>

              <textarea
                rows={3}
                maxLength={500}
                placeholder="Mention any custom requirement, group size questions, or specific activity requests…"
                className={`${fieldClass} resize-y`}
                {...register(
                  "special_requests",
                  {
                    maxLength: {
                      value: 500,
                      message:
                        "Keep it under 500 characters",
                    },
                  }
                )}
              />

              {errors.special_requests && (
                <p className={errorClass}>
                  {
                    errors.special_requests
                      .message
                  }
                </p>
              )}
            </div>

            {/* =====================================
                BUTTONS
            ====================================== */}

            <div className="flex flex-col sm:flex-row gap-4">

              <a
                href="tel:+917075805883"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-slate-950 border border-white/15 hover:bg-slate-900 text-gray-200 py-4 px-8 rounded-full font-bold transition-all duration-300 shadow-sm cursor-pointer text-sm font-heading"
              >
                <Phone
                  size={16}
                  className="text-cyan-400"
                />

                Call instead
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-amber-400 hover:bg-yellow-300 text-slate-950 py-4 px-8 rounded-full font-heading font-black text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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