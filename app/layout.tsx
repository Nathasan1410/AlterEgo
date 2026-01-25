import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlterEgo - Your Professional AI Twin",
  description: "Clone your writing style and ghostwrite viral LinkedIn posts with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
