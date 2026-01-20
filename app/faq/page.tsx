
import { FaqSection } from "@/components/custom/FaqSection";
import { fetchFaqs } from "@/lib/data";

export const metadata = {
    title: 'Preguntas Frecuentes | Vagar',
    description: 'Encuentra respuestas a las dudas más comunes sobre tu estadía en nuestros chalets en Merlo, San Luis.',
};

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
