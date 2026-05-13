import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponete en contacto con nosotros para planificar tu próxima estadía.",
  openGraph: {
    title: "Contacto | Vagar Vacaciones",
    description: "Ponete en contacto con nosotros para planificar tu próxima estadía.",
    images: [{ url: '/home-nosotros.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contacto | Vagar Vacaciones",
    description: "Ponete en contacto con nosotros para planificar tu próxima estadía.",
    images: ['/home-nosotros.webp'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
