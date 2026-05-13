import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé nuestra historia y más de 25 años de trayectoria.",
  openGraph: {
    images: [{ url: "/home-nosotros.webp", width: 1200, height: 630 }],
  },
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
