import { Metadata } from 'next';
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: "Page not found | Spotify"
};

export default function NotFound() {
  notFound()
}
