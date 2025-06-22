import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// 🛡️ Carga de variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 🧠 Cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: Request) {
  const heads = headers();

  // 🧾 Encabezados de Clerk para verificación
  const svixId = heads.get('svix-id') ?? '';
  const svixTimestamp = heads.get('svix-timestamp') ?? '';
  const svixSignature = heads.get('svix-signature') ?? '';

  // 🧰 Verificador de Clerk
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    const payload = await req.text();
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;

    console.log('📦 Clerk webhook recibido:', evt.type);
  } catch (err) {
    console.error('❌ Error al verificar webhook:', err);
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 });
  }

  const eventType = evt.type;

  // ✅ Solo manejar el evento user.created
  if (eventType === 'user.created' && evt.data.object === 'user') {
    const user = evt.data;

    if (user.email_addresses?.[0]?.email_address) {
      const { error } = await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email_addresses[0].email_address,
          first_name: user.first_name,
          last_name: user.last_name,
          image_url: user.image_url || null,
        },
      ]);

      if (error) {
        console.error('❌ Error al insertar en Supabase:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ Usuario insertado en Supabase');
    } else {
      console.warn('⚠️ Usuario sin email, no insertado');
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}