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

    // Try to select from creators table
    const { data, error } = await supabase
        .from('creators')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
        if (error.code === 'PGRST301') {
            console.log('Note: This might be an RLS issue if the table exists but is not public.');
        }
    } else {
        console.log('Connection successful! count:', data);
    }
}

testConnection();
