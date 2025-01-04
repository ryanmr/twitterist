import { z } from "zod";

// Define the schema
export const ConversionRequestSchema = z.object({
  url: z
    .string()
    .url()
    .refine((url) => url.includes("x.com"), {
      message: "URL must be an x.com link.",
    }),
  referrerMode: z.enum(["keep", "randomize", "remove"]),
});

export type ConversionRequest = z.infer<typeof ConversionRequestSchema>;

// Conversion logic
export function convert(req: ConversionRequest) {
  const { url, referrerMode } = req;

  const parsedUrl = new URL(url);

  // Convert hostname to twitter.com
  parsedUrl.hostname = "twitter.com";

  // Handle referrerMode
  if (referrerMode === "randomize") {
    const randomValue = Math.floor(100 + Math.random() * 900); // Random number 100-999
    parsedUrl.search = `?s=${randomValue}`;
  } else if (referrerMode === "remove") {
    parsedUrl.search = ""; // Remove all query params
  }

  return parsedUrl.href;
}
