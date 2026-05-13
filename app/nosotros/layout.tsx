import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé nuestra historia y más de 25 años de trayectoria.",
  openGraph: {
    title: "Nosotros | Vagar Vacaciones",
    description: "Conocé nuestra historia y más de 25 años de trayectoria.",
    images: [{ url: "/home-nosotros.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nosotros | Vagar Vacaciones",
    description: "Conocé nuestra historia y más de 25 años de trayectoria.",
    images: ["/home-nosotros.webp"],
  },
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
