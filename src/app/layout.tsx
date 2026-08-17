import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOVAWEARS | Premium Mobile Accessories & Lifestyle",
  description:
    "Shop premium earbuds, headphones, chargers, wired hands-free and mobile accessories from NOVAWEARS. Modern products, premium style and Cash on Delivery across Pakistan.",
  openGraph: {
    title: "NOVAWEARS | Premium Mobile Accessories & Lifestyle",
    description:
      "Shop premium earbuds, headphones, chargers, wired hands-free and mobile accessories from NOVAWEARS.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVAWEARS | Premium Mobile Accessories & Lifestyle",
    description: "Modern products, premium style, Cash on Delivery across Pakistan.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="antialiased text-ink"
        style={
          {
            "--font-display": '"Avenir Next", "Segoe UI Semibold", ui-sans-serif, system-ui, sans-serif',
            "--font-body": 'ui-sans-serif, "Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
            "--font-mono": '"IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace',
            fontFamily: "var(--font-body)",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
