import type { Metadata } from "next";
import localFont from "next/font/local";
import '../globals.css'
import Navbar from "@/components/navbar";
import Container from "@/components/container";
import Player from "@/components/song/player";
import { SongProvider } from "@/contexts/song-context";

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

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
          bg-neutral-950 text-white
        `}
      >
        <SongProvider>
          <Container>
            <Navbar />
            <main className="grid grid-cols-4 gap-2 min-h-dvh mb-4">
              <div className="bg-neutral-900 rounded-lg p-4">
                <h2 className="text-neutral-300 font-semibold">Your library</h2>
              </div>
              <div className="col-span-3 bg-neutral-900 rounded-lg p-4">
                {children}
              </div>
            </main>
          </Container>
          <Player />
        </SongProvider>
      </body>
    </html>
  );
}
