require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase URL or Key is missing from .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);

    try {
        // Try to select count from creators table
        const { count, error } = await supabase
            .from('creators')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed:', error.message);
            if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
                console.log('Note: This might be an RLS issue. The table exists but is not publicly readable.');
            } else if (error.code === '42P01') {
                console.log('Error: Table "creators" does not exist.');
            }
        } else {
            console.log('Connection successful! Table "creators" exists. Row count:', count);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
