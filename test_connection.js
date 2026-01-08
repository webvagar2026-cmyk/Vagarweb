const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Leer .env.local manualmente para evitar dependencias extra
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remover comillas
        envVars[key] = value;
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Configuración ---');
console.log('URL:', supabaseUrl);
console.log('Service Key (first 10 chars):', supabaseServiceKey ? supabaseServiceKey.substring(0, 10) + '...' : 'UNDEFINED');

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('ERROR: Faltan variables de entorno.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    }
});

async function test() {
    console.log('\n--- Pruebas de Conexión ---');

    // 1. Prueba de Lectura (GET)
    console.log('1. Intentando leer FAQs...');
    const { data: faqs, error: readError } = await supabase
        .from('faqs')
        .select('*')
        .limit(1);

    if (readError) {
        console.error('❌ Error de lectura:', readError);
    } else {
        console.log('✅ Lectura exitosa. FAQs encontradas:', faqs.length);
    }

    // 2. Prueba de Escritura (POST)
    console.log('\n2. Intentando crear FAQ de prueba...');
    const { data: newFaq, error: writeError } = await supabase
        .from('faqs')
        .insert([{ question: '_TEST_CONN_', answer: 'Testing connection', order: 999 }])
        .select()
        .single();

    if (writeError) {
        console.error('❌ Error de escritura:', writeError);
    } else {
        console.log('✅ Escritura exitosa. ID:', newFaq.id);

        // Limpieza
        console.log('3. Limpiando FAQ de prueba...');
        await supabase.from('faqs').delete().eq('id', newFaq.id);
        console.log('✅ Limpieza completada.');
    }
}

test();
