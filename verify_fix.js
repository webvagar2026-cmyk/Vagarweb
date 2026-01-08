const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
    try {
        const content = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf8');
        const vars = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) vars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
        });
        return vars;
    } catch (e) {
        return {};
    }
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(url, key, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    }
});

async function main() {
    console.log("TEST 1: Fetch Amenities (Public/Common table)...");
    const { data: amenities, error: amError } = await supabase.from('amenities').select('*').limit(1);
    if (amError) {
        console.error("AMENITIES FAILED:", amError.message);
    } else {
        console.log("AMENITIES SUCCESS. Count:", amenities.length);
    }

    console.log("TEST 2: Fetch FAQs...");
    const { data: faqs, error: fError } = await supabase.from('faqs').select('*').limit(1);

    if (fError) {
        console.error("FAQS FAILED:", fError.message);
        if (fError.code === '42501') {
            console.log("Diagnosis: 42501 Permission Denied on FAQs.");
        }
    } else {
        console.log("FAQS SUCCESS. Count:", faqs.length);
    }
}

main();
