import type { Metadata } from "next";
import localFont from "next/font/local";
import '../globals.css'
import Container from "@/components/container";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          from-neutral-950 bg-gradient-to-t to-neutral-800 text-white grid min-h-dvh
        `}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
