import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "Please use 100 characters or fewer."),
  email: z.string().trim().max(254, "Please use a shorter email address.").email("Please enter a valid email address."),
  company: z.string().trim().max(150, "Please use 150 characters or fewer.").default(""),
  message: z.string().trim().min(20, "Please tell us a little more (at least 20 characters).").max(5000, "Please use 5,000 characters or fewer."),
  service: z.string().trim().max(100).default(""),
  website: z.string().max(200).default(""),
});
export type Enquiry = z.infer<typeof enquirySchema>;
export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

export function enquiryErrors(error: z.ZodError): FieldErrors {
  return Object.fromEntries(error.issues.map(issue => [String(issue.path[0]), issue.message]));
}
