import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { site } from "@/content/site";
import { body, display, mono } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg font-body text-fg">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
