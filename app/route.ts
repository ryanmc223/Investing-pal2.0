import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Vercel Cron calls this endpoint with Authorization: Bearer <CRON_SECRET>.
// The endpoint deliberately does not scan or invent market information until
// licensed data providers and the server-side AI workflow have been connected.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      status: 'not_configured',
      message: 'Monitoring is not active. Configure Supabase server credentials and run the database migration first.'
    }, { status: 503 });
  }

  const result = await fetch(`${supabaseUrl}/rest/v1/monitor_runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      status: 'not_configured',
      message: 'Scheduler reached the app, but licensed market-data and AI providers are not connected. No market scan was performed.'
    }),
    cache: 'no-store'
  });

  if (!result.ok) {
    return NextResponse.json({ error: 'Could not record monitoring check.' }, { status: 502 });
  }

  return NextResponse.json({
    status: 'not_configured',
    message: 'Monitoring endpoint is reachable. No live market scan was performed.'
  });
}
