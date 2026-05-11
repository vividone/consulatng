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
    defaultValues: { service: "", expatriates: "" },
  });

  const onSubmit = async (values: FormValues) => {
    // In production: POST to /api/contact or external form service
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Contact form submission:", values);
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
          <Label htmlFor="companyName">Company Name *</Label>
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
          <Input id="phone" type="tel" placeholder="+234 ..." {...register("phone")} />
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
          <Label htmlFor="expatriates">Number of Expatriates *</Label>
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
