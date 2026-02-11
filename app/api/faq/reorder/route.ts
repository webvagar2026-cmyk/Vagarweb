import { NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items } = body;

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Update each item's order
        // Since supabase-js doesn't have a bulk update for different values in one query easily (upsert requires all columns usually or specific handling),
        // and we are updating just 'order', we can iterate. 
        // Ideally we'd use a stored procedure or a single query if possible, but for small lists (FAQs) iteration is acceptable.
        // Or we can use `upsert` if we send id and order.

        const updates = items.map((item: { id: number; order: number }) => ({
            id: item.id,
            order: item.order,
            // We need to fetch the existing question/answer or assume we can patch just order if we put partial data?
            // Supabase `upsert` replaces the row unless we merge.
            // `update` is better.
        }));

        // Promise.all for parallel updates.
        await Promise.all(
            updates.map((item) =>
                supabase.from('faqs').update({ order: item.order }).eq('id', item.id)
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering FAQs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
