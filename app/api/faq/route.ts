import { NextResponse } from 'next/server';
import { createFaq, fetchFaqs } from '@/lib/data';
import { Faq } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
    const faqs = await fetchFaqs();
    return NextResponse.json(faqs);
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const faq = await createFaq(json as Omit<Faq, 'id' | 'created_at'>);

        if (!faq) {
            return new NextResponse('Internal Error', { status: 500 });
        }

        return NextResponse.json(faq);
    } catch (error) {
        console.error('Error in POST /api/faq:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
