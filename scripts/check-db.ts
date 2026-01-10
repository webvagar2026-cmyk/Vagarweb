
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    const { data: amenities, error } = await supabase.from('amenities').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('Error fetching amenities:', error);
    } else {
        // console.log(`Amenities count: ${amenities}`); // data is null for head:true
    }

    const { count, error: countError } = await supabase.from('amenities').select('*', { count: 'exact', head: true });
    if (countError) console.error(countError);
    console.log(`Amenities count: ${count}`);

    // Check Admin User
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('email', 'admin@vagar.com.ar').single();
    if (userError) {
        console.error('Error fetching admin user:', userError);
    } else {
        console.log(`Admin user found: ${user?.email} (ID: ${user?.id})`);
    }
}

check();
