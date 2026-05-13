import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "../components/custom/LayoutProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Vagar Vacaciones",
    template: "%s | Vagar Vacaciones",
  },
  description: "Alquileres en Merlo, San Luis. Descubrí chalets exclusivos en Chumamaya Country Club.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Vagar Vacaciones",
    title: "Vagar Vacaciones",
    description: "Alquileres en Merlo, San Luis. Descubrí chalets exclusivos en Chumamaya Country Club.",
    images: [
      {
        url: "/home-nosotros.webp",
        width: 1200,
        height: 630,
        alt: "Vagar Vacaciones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vagar Vacaciones",
    description: "Alquileres en Merlo, San Luis. Descubrí chalets exclusivos en Chumamaya Country Club.",
    images: ["/home-nosotros.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
