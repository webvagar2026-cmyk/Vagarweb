import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponete en contacto con nosotros para planificar tu próxima estadía.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
