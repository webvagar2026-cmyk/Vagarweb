import { fetchFaqs } from '@/lib/data';
import { columns } from './columns';
import { DataTable } from './data-table';
import { H2, Muted } from '@/components/ui/typography';

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
    const faqs = await fetchFaqs();

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <H2>Preguntas Frecuentes</H2>
                    <Muted>Gestiona las preguntas frecuentes que aparecen en el sitio.</Muted>
                </div>
            </div>
            <DataTable columns={columns} data={faqs} />
        </div>
    );
}
