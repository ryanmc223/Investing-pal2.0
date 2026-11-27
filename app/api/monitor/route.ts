import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the Vercel Cron authorization
  const secret = process.env.CRON_SECRET?.trim();
  const authorization =
    request.headers.get('authorization')?.trim();

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Load Supabase configuration
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      { error: 'Supabase configuration missing' },
      { status: 503 }
    );
  }

  // Test the database connection
  try {
    const result = await fetch(
      `${supabaseUrl}/rest/v1/monitor_runs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseSecretKey,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          status: 'not_configured',
          message: 'Database connection test successful',
        }),
        cache: 'no-store',
      }
    );

    if (!result.ok) {
      const errorText = await result.text();

      console.error('Supabase request failed:', {
        status: result.status,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: 'Supabase request failed',
          upstreamStatus: result.status,
        },
        { status: 502 }
      );
    }

    const data = await result.json();

    return NextResponse.json({
      success: true,
      message: 'Supabase database connection successful',
      data,
    });
  } catch (error) {
    console.error('Monitor error:', error);

    return NextResponse.json(
      { error: 'Database connection test failed' },
      { status: 500 }
    );
  }
}
