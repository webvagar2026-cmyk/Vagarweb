
import { FaqSection } from "@/components/custom/FaqSection";
import { fetchFaqs } from "@/lib/data";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Preguntas Frecuentes',
    description: 'Encuentra respuestas a las dudas más comunes sobre tu estadía en nuestros chalets en Merlo, San Luis.',
    openGraph: {
      title: 'Preguntas Frecuentes | Vagar Vacaciones',
      description: 'Encuentra respuestas a las dudas más comunes sobre tu estadía en nuestros chalets en Merlo, San Luis.',
      images: [{ url: '/home-nosotros.webp', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Preguntas Frecuentes | Vagar Vacaciones',
      description: 'Encuentra respuestas a las dudas más comunes sobre tu estadía en nuestros chalets en Merlo, San Luis.',
      images: ['/home-nosotros.webp'],
    },
};

export const revalidate = 0;

export default async function FaqPage() {
    const faqs = await fetchFaqs();

    return (
        <main className="min-h-screen  pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Preguntas Frecuentes</h1>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg text-gray-600 mb-12 text-center">
                        Aquí encontrarás respuestas a las consultas más habituales. Si no encuentras lo que buscas, no dudes en contactarnos.
                    </p>
                </div>

                {faqs.length > 0 ? (
                    <FaqSection faqs={faqs} />
                ) : (
                    <p className="text-center text-gray-300">No hay preguntas frecuentes disponibles en este momento.</p>
                )}
            </div>
        </main>
    );
}
