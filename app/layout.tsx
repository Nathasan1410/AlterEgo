import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlterEgo - AI-Powered LinkedIn Post Generator",
  description:
    "Transform your LinkedIn presence in minutes, not hours. AI-powered personal branding coach that clones your authentic writing style and crafts viral content. Powered by OPIK AI.",
  keywords: ["LinkedIn", "AI", "Content Generation", "Personal Branding", "Social Media"],
  openGraph: {
    title: "AlterEgo - AI-Powered LinkedIn Post Generator",
    description: "Transform your LinkedIn presence in minutes, not hours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
