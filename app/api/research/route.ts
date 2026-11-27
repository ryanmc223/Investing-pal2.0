import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const ticker = typeof body?.ticker === 'string' ? body.ticker.trim().slice(0, 20) : '';
  const market = typeof body?.market === 'string' ? body.market.slice(0, 30) : 'Stocks';
  const horizon = typeof body?.horizon === 'string' ? body.horizon.slice(0, 30) : 'Both';

  if (!ticker) return NextResponse.json({ error: 'Enter an asset ticker or name.' }, { status: 400 });

  // Deliberately fail closed: no fabricated quotes or AI conclusions.
  // Next milestone: connect a licensed market-data source, validate its
  // timestamp/coverage, then pass sourced data to the server-side AI service.
  if (!process.env.OPENAI_API_KEY || !process.env.MARKET_DATA_API_KEY) {
    return NextResponse.json({
      error: 'Research is not connected yet. Add server-side OPENAI_API_KEY and MARKET_DATA_API_KEY values after choosing providers. This app will not invent prices or financial facts.'
    }, { status: 503 });
  }

  return NextResponse.json({
    error: 'Provider integration is not implemented yet. Configure a licensed market-data provider and its supported endpoints before enabling research.'
  }, { status: 501 });
}
