import type { Metadata } from "next";
import localFont from "next/font/local";
import '../globals.css'
import Navbar from "@/components/navbar";
import Container from "@/components/container";
import Player from "@/components/song/player";
import { SongProvider } from "@/contexts/song-context";
import { getSession } from "@/actions/auth";
import Sidebar from "@/components/sidebar";

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
  title: "Spotify",
  description: "Web player for music",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()

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
            <main className="lg:grid grid-cols-4 gap-2 min-h-screen mb-4">
              <Sidebar />
              <div className="col-span-3 bg-neutral-900 rounded-lg p-4">
                {children}
              </div>
            </main>
          </Container>
          {session.active && <Player />}
        </SongProvider>
      </body>
    </html>
  );
}
