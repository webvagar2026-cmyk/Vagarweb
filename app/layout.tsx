import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutProvider from "../components/custom/LayoutProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  verification: {
    google: "OXrB6j2jdV3KaWdpsqpDYAIoJ6nzliBNt9-CMRTaTEk",
  },
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
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MZFDX8SS');`}
      </Script>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MZFDX8SS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
