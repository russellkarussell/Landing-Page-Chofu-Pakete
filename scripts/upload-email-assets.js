import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const files = [
  { local: 'client/public/email-chofu-4kw.webp', remote: 'email-chofu-4kw.webp' },
  { local: 'client/public/email-chofu-6kw.webp', remote: 'email-chofu-6kw.webp' },
  { local: 'client/public/email-chofu-10kw.webp', remote: 'email-chofu-10kw.webp' },
  { local: 'client/public/email-usp-japan.png', remote: 'email-usp-japan.png' },
  { local: 'client/public/email-usp-schallpegel.png', remote: 'email-usp-schallpegel.png' },
  { local: 'client/public/email-usp-fussabdruck.png', remote: 'email-usp-fussabdruck.png' },
  { local: 'client/public/email-usp-heizleistung.png', remote: 'email-usp-heizleistung.png' },
];

async function uploadFiles() {
  for (const file of files) {
    const fileBuffer = fs.readFileSync(file.local);
    const contentType = file.local.endsWith('.webp') ? 'image/webp' : 'image/png';
    
    const { data, error } = await supabase.storage
      .from('image')
      .upload(file.remote, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${file.remote}:`, error.message);
    } else {
      console.log(`Uploaded: ${file.remote}`);
    }
  }
  
  console.log('\nPublic URLs:');
  for (const file of files) {
    console.log(`${supabaseUrl}/storage/v1/object/public/image/${file.remote}`);
  }
}

uploadFiles().catch(console.error);
