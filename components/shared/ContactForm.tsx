"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneCountry: z.string().default("NG"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  expatriates: z.string().min(1, "Please select a range"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SERVICES = [
  "Business Permit",
  "Expatriate Quota",
  "e-CERPAC",
  "e-Visas",
  "Monthly Returns",
  "General Enquiry",
];

const RANGES = ["1–5", "6–20", "21–50", "50+"];

/**
 * International dialling-code options for the phone field.
 * Nigeria sits at the top (default); the rest follow a roughly
 * alphabetical order. Covers the realistic client audience —
 * Africa, Europe, North America, Asia-Pacific, Middle East.
 */
const DIAL_CODES: { code: string; name: string; flag: string; dial: string }[] = [
  { code: "NG", name: "Nigeria",        flag: "🇳🇬", dial: "+234" },
  { code: "AR", name: "Argentina",      flag: "🇦🇷", dial: "+54" },
  { code: "AU", name: "Australia",      flag: "🇦🇺", dial: "+61" },
  { code: "BE", name: "Belgium",        flag: "🇧🇪", dial: "+32" },
  { code: "BR", name: "Brazil",         flag: "🇧🇷", dial: "+55" },
  { code: "CA", name: "Canada",         flag: "🇨🇦", dial: "+1" },
  { code: "CN", name: "China",          flag: "🇨🇳", dial: "+86" },
  { code: "EG", name: "Egypt",          flag: "🇪🇬", dial: "+20" },
  { code: "FR", name: "France",         flag: "🇫🇷", dial: "+33" },
  { code: "DE", name: "Germany",        flag: "🇩🇪", dial: "+49" },
  { code: "GH", name: "Ghana",          flag: "🇬🇭", dial: "+233" },
  { code: "IN", name: "India",          flag: "🇮🇳", dial: "+91" },
  { code: "IE", name: "Ireland",        flag: "🇮🇪", dial: "+353" },
  { code: "IT", name: "Italy",          flag: "🇮🇹", dial: "+39" },
  { code: "JP", name: "Japan",          flag: "🇯🇵", dial: "+81" },
  { code: "KE", name: "Kenya",          flag: "🇰🇪", dial: "+254" },
  { code: "MX", name: "Mexico",         flag: "🇲🇽", dial: "+52" },
  { code: "NL", name: "Netherlands",    flag: "🇳🇱", dial: "+31" },
  { code: "PT", name: "Portugal",       flag: "🇵🇹", dial: "+351" },
  { code: "QA", name: "Qatar",          flag: "🇶🇦", dial: "+974" },
  { code: "SA", name: "Saudi Arabia",   flag: "🇸🇦", dial: "+966" },
  { code: "SG", name: "Singapore",      flag: "🇸🇬", dial: "+65" },
  { code: "ZA", name: "South Africa",   flag: "🇿🇦", dial: "+27" },
  { code: "KR", name: "South Korea",    flag: "🇰🇷", dial: "+82" },
  { code: "ES", name: "Spain",          flag: "🇪🇸", dial: "+34" },
  { code: "SE", name: "Sweden",         flag: "🇸🇪", dial: "+46" },
  { code: "CH", name: "Switzerland",    flag: "🇨🇭", dial: "+41" },
  { code: "AE", name: "UAE",            flag: "🇦🇪", dial: "+971" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "US", name: "United States",  flag: "🇺🇸", dial: "+1" },
];

const findDialCode = (countryCode: string) =>
  DIAL_CODES.find((c) => c.code === countryCode)?.dial ?? "+234";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { service: "", expatriates: "", phoneCountry: "NG" },
  });

  const onSubmit = async (values: FormValues) => {
    // In production: POST to /api/contact or external form service.
    // Combine the country dial code with the local number for a normalised
    // E.164-ish phone string that downstream systems can consume directly.
    const dial = findDialCode(values.phoneCountry);
    const fullPhone = values.phone ? `${dial} ${values.phone.trim()}` : "";
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Contact form submission:", { ...values, fullPhone });
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h3 className="mt-4 font-display text-xl font-bold text-grey-900">
          Thank you — message received.
        </h3>
        <p className="mt-2 text-grey-700">
          A member of our team will get back to you within 24 hours.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="secondary" className="mt-6">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-grey-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" placeholder="Jane Doe" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Acme Inc." {...register("companyName")} />
          {errors.companyName && (
            <p className="text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@company.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <Select
              value={watch("phoneCountry")}
              onValueChange={(v) =>
                setValue("phoneCountry", v, { shouldValidate: false })
              }
            >
              <SelectTrigger
                aria-label="Country dialling code"
                className="w-28 shrink-0 whitespace-nowrap sm:w-32"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72 min-w-[9rem]">
                {DIAL_CODES.map((c) => (
                  <SelectItem
                    key={c.code}
                    value={c.code}
                    className="whitespace-nowrap"
                  >
                    <span className="mr-2" aria-hidden>
                      {c.flag}
                    </span>
                    <span className="font-medium">{c.dial}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="802 123 4567"
              className="flex-1"
              {...register("phone")}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service">Service of Interest *</Label>
          <Select
            value={watch("service")}
            onValueChange={(v) => setValue("service", v, { shouldValidate: true })}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-sm text-red-600">{errors.service.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expatriates">Number of Persons in your delegation/crew *</Label>
          <Select
            value={watch("expatriates")}
            onValueChange={(v) => setValue("expatriates", v, { shouldValidate: true })}
          >
            <SelectTrigger id="expatriates">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.expatriates && (
            <p className="text-sm text-red-600">{errors.expatriates.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message / Additional Details</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell us about your immigration needs..."
          {...register("message")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : (
          <>
            Submit Enquiry <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
