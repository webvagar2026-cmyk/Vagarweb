import { createClient } from '@supabase/supabase-js';
import { allAmenities as amenities } from '../lib/amenities-data';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Manually configure Supabase client for the script
// Manually configure Supabase client for the script
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL (SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL) and service role key (SUPABASE_SERVICE_ROLE_KEY) must be defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('Starting database seeding...');

  // 1. Insert Admin User
  console.log('Checking admin user...');
  const { data: existingUser, error: userError } = await supabase.from('users').select('id').eq('email', 'admin@vagar.com.ar').single();

  if (userError && userError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
    console.error('Error checking admin user:', userError);
  }

  if (!existingUser) {
    console.log('Inserting admin user...');
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminPasswordHash) {
      throw new Error('ADMIN_PASSWORD_HASH must be defined in environment variables.');
    }
    const { error: insertUserError } = await supabase.from('users').insert({
      id: 1, // Asignar ID manualmente para evitar problemas de secuencia
      name: 'Admin',
      email: 'admin@vagar.com.ar',
      password: adminPasswordHash,
      role: 'admin'
    });
    if (insertUserError) {
      console.error('Error inserting admin user:', insertUserError);
      return;
    }
    console.log('Admin user inserted.');
  } else {
    console.log('Admin user already exists.');
  }

  // 2. Insert/Update Amenities
  console.log('Upserting amenities...');
  const amenitiesToInsert = amenities.map(a => ({ slug: a.id, name: a.name, category: a.category, icon: a.icon }));

  // Use upsert to avoid errors if they already exist, and update them if they changed
  // Add retry logic for amenities upsert to handle potential connection timeouts
  let amenitiesError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { error } = await supabase
        .from('amenities')
        .upsert(amenitiesToInsert, { onConflict: 'slug' })
        .select();

      amenitiesError = error;
      if (!amenitiesError) break; // Success

      console.warn(`Attempt ${attempt} failed to upsert amenities. Retrying...`);
    } catch (err) {
      console.warn(`Attempt ${attempt} threw an error during amenities upsert:`, err);
      if (attempt === 3) throw err;
    }
    // Small delay before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  if (amenitiesError) {
    console.error('Error upserting amenities after retries:', amenitiesError);
    return;
  }
  console.log('Amenities upserted.');

  console.log('Database seeding completed successfully. No demo data was inserted.');
}

main().catch((err) => {
  console.error('An error occurred during the database seeding process:', err);
  process.exit(1);
});
