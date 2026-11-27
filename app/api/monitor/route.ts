
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (
    !secret ||
    request.headers.get('authorization') !== `Bearer ${secret}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 503 }
    );
  }

  const result = await fetch(
    `${supabaseUrl}/rest/v1/monitor_runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseSecretKey,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        status: 'not_configured',
        message: 'Database connection verified. Market data and AI providers are not connected yet.'
      }),
      cache: 'no-store'
    }
  );

  if (!result.ok) {
    const details = await result.text();
    console.error('Supabase error:', result.status, details);

    return NextResponse.json(
      { error: 'Database write failed', upstreamStatus: result.status },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: 'not_configured',
    message: 'Supabase database connection successful.'
  });
}
