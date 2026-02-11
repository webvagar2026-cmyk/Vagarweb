import { NextResponse } from 'next/server';
import { updateFaq, deleteFaq } from '@/lib/data';
import { Faq } from '@/lib/types';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await request.json();
        const faqId = parseInt(id);

        if (isNaN(faqId)) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const faq = await updateFaq(faqId, json as Partial<Faq>);

        if (!faq) {
            return new NextResponse('Internal Error', { status: 500 });
        }

        return NextResponse.json(faq);
    } catch (error) {
        console.error('Error in PUT /api/faq/[id]:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const faqId = parseInt(id);

        if (isNaN(faqId)) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const success = await deleteFaq(faqId);

        if (!success) {
            return new NextResponse('Internal Error', { status: 500 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error in DELETE /api/faq/[id]:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
