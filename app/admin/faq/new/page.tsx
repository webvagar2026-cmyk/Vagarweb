import { FaqForm } from '@/components/custom/FaqForm';
import { H2, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewFaqPage() {
    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <div className="mb-6">
                <Link href="/admin/faq">
                    <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:underline">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Volver a la lista
                    </Button>
                </Link>
                <H2>Crear Pregunta Frecuente</H2>
                <Muted>Agrega una nueva pregunta frecuente al sitio.</Muted>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <FaqForm />
            </div>
        </div>
    );
}
