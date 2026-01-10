import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase configuration missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateCategories() {
    console.log('Updating experience categories...');

    // 1. Update "Zona deportiva y social" -> "Zona deportiva"
    const { error: err1, count: count1 } = await supabase
        .from('experiences')
        .update({ category: 'Zona deportiva' })
        .eq('category', 'Zona deportiva y social')
        .select('', { count: 'exact' });

    if (err1) console.error('Error updating Zona deportiva:', err1);
    else console.log(`Updated ${count1} rows to 'Zona deportiva'`);

    // 2. Update "Turismo" -> "Zona residencial"
    const { error: err2, count: count2 } = await supabase
        .from('experiences')
        .update({ category: 'Zona residencial' })
        .eq('category', 'Turismo')
        .select('', { count: 'exact' });

    if (err2) console.error('Error updating Zona residencial:', err2);
    else console.log(`Updated ${count2} rows to 'Zona residencial'`);

    // 3. Update "Zona de naturaleza" -> "Zona de montaña"
    const { error: err3, count: count3 } = await supabase
        .from('experiences')
        .update({ category: 'Zona de montaña' })
        .eq('category', 'Zona de naturaleza')
        .select('', { count: 'exact' });

    if (err3) console.error('Error updating Zona de montaña:', err3);
    else console.log(`Updated ${count3} rows to 'Zona de montaña'`);

    console.log('Done.');
}

updateCategories().catch(console.error);
