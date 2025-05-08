// app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next';

export async function GET(req: NextRequest) {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse('Forbidden', { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Webhook received:', JSON.stringify(body, null, 2));

  // Aquí puedes enviar a n8n, guardar en BD, etc.

  return new NextResponse('EVENT_RECEIVED', { status: 200 });
}