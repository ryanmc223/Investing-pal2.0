'use client';

import { useMemo, useState } from 'react';
import { Activity, Bell, BookOpen, ChartNoAxesCombined, ChevronRight, CircleDollarSign, Compass, Search, ShieldCheck, Wallet } from 'lucide-react';

type Tab = 'Home' | 'Discover' | 'Research' | 'Portfolio';
type Asset = { symbol: string; name: string; category: string; note: string };
const seedAssets: Asset[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stock', note: 'Consumer technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Stock', note: 'Software and cloud' },
  { symbol: 'SPY', name: 'S&P 500 ETF', category: 'ETF', note: 'U.S. large-cap equities' },
  { symbol: 'BTC-USD', name: 'Bitcoin', category: 'Crypto', note: 'Digital asset' },
  { symbol: 'GLD', name: 'Gold ETF', category: 'ETF', note: 'Gold exposure' },
];
const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('Home');
  const [assets, setAssets] = useState(seedAssets);
  const [query, setQuery] = useState('');
  const [ticker, setTicker] = useState('AAPL');
  const [market, setMarket] = useState('Stocks');
  const [horizon, setHorizon] = useState('Both');
  const [report, setReport] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cash, setCash] = useState(999);
  const [positions, setPositions] = useState<{symbol:string; amount:number}[]>([]);

  const filtered = useMemo(() => assets.filter(a => (a.symbol + a.name).toLowerCase().includes(query.toLowerCase())), [assets, query]);
  const invested = positions.reduce((sum, p) => sum + p.amount, 0);

  function addAsset() {
    const symbol = query.trim().toUpperCase();
    if (!symbol || assets.some(a => a.symbol === symbol)) return;
    setAssets([{ symbol, name: symbol, category: 'Unclassified', note: 'Added to your local watchlist' }, ...assets]);
    setQuery('');
  }

  function simulatePosition() {
    const amount = Math.min(25, cash);
    if (amount <= 0) return;
    setCash(v => v - amount);
    setPositions(v => [...v, { symbol: ticker.toUpperCase(), amount }]);
  }

  async function runResearch(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setReport('');
    try {
      const response = await fetch('/api/research', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, market, horizon }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Research request failed.');
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setBusy(false); }
  }

  const nav: {label:Tab; icon:typeof Activity}[] = [
    { label:'Home', icon:ChartNoAxesCombined }, { label:'Discover', icon:Compass },
    { label:'Research', icon:Search }, { label:'Portfolio', icon:Wallet },
  ];

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><div className="brandIcon"><ChartNoAxesCombined size={22}/></div><div><strong>investing pal</strong><span>Make sense of the market</span></div></div>
      <button className="iconButton" aria-label="Notifications"><Bell size={19}/></button>
    </header>

    <section className="welcome">
      <div className="eyebrow">YOUR INVESTMENT COMPANION</div>
      <h1>Research with<br/><em>more confidence.</em></h1>
      <p>Explore markets, understand risk and practice your strategy with virtual money.</p>
      <div className="modePill"><span/> PAPER TRADING · NO REAL MONEY</div>
    </section>

    <nav className="tabs" aria-label="Main navigation">
      {nav.map(({label, icon:Icon}) => <button key={label} className={tab===label?'tab active':'tab'} onClick={()=>setTab(label)}><Icon size={17}/><span>{label}</span></button>)}
    </nav>

    {tab === 'Home' && <div className="content">
      <div className="sectionHeading"><div><span className="eyebrow">OVERVIEW</span><h2>Your practice account</h2></div><span className="tag">SIMULATED</span></div>
      <div className="balanceCard"><div className="cardLabel">TOTAL PRACTICE VALUE</div><div className="balance">{money(cash + invested)}</div><div className="balanceMeta"><span>Cash {money(cash)}</span><span>Positions {money(invested)}</span></div><div className="balanceFoot"><ShieldCheck size={15}/> Virtual balance · Starts at $999</div></div>
      <div className="statsGrid"><div className="statCard"><span>Watchlist</span><strong>{assets.length}</strong><small>Tracked assets</small></div><div className="statCard"><span>Practice positions</span><strong>{positions.length}</strong><small>Simulated only</small></div></div>
      <div className="sectionHeading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>On your radar</h2></div><button className="textButton" onClick={()=>setTab('Discover')}>View all <ChevronRight size={15}/></button></div>
      <AssetList assets={assets.slice(0,4)}/>
      <div className="callout"><BookOpen size={19}/><div><strong>Learn before you leap</strong><p>Every research report should show its sources, date, assumptions and downside risks.</p></div></div>
    </div>}

    {tab === 'Discover' && <div className="content">
      <div className="eyebrow">EXPLORE THE MARKETS</div><h2>Build your watchlist</h2><p className="muted">Track assets you're interested in researching. Prices are not connected yet.</p>
      <div className="searchBox"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search or enter a ticker"/></div>
      <button className="secondaryButton full" onClick={addAsset}>＋ Add ticker to watchlist</button>
      <AssetList assets={filtered}/>
      <p className="fineprint">Watchlist entries are stored in this browser session in this starter build. Account sync will be added with Supabase.</p>
    </div>}

    {tab === 'Research' && <div className="content">
      <div className="eyebrow">AI-ASSISTED LEARNING</div><h2>Research an investment</h2><p className="muted">Request a structured educational report. Live market data and AI credentials must be connected before reports can be generated.</p>
      <form className="formCard" onSubmit={runResearch}>
        <label>Asset ticker or name<input value={ticker} onChange={e=>setTicker(e.target.value)} required placeholder="e.g. AAPL"/></label>
        <label>Market<select value={market} onChange={e=>setMarket(e.target.value)}>{['Stocks','ETFs','Bonds','Crypto','Forex','Commodities'].map(x=><option key={x}>{x}</option>)}</select></label>
        <label>Time horizon<select value={horizon} onChange={e=>setHorizon(e.target.value)}><option>Both</option><option>Short-term</option><option>Long-term</option></select></label>
        <button className="primaryButton" disabled={busy}>{busy?'Preparing research…':'Generate research brief'}</button>
      </form>
      {error && <div className="notice error">{error}</div>}
      {report && <div className="report"><h3>Research brief</h3><pre>{report}</pre></div>}
      <div className="notice"><ShieldCheck size={18}/><span>Educational information only. No personalized financial advice or real trade execution.</span></div>
    </div>}

    {tab === 'Portfolio' && <div className="content">
      <div className="eyebrow">PAPER PORTFOLIO</div><h2>Practice without risking cash</h2>
      <div className="balanceCard"><div className="cardLabel">AVAILABLE VIRTUAL CASH</div><div className="balance">{money(cash)}</div><div className="balanceFoot">Starting balance: $999 · No brokerage connection</div></div>
      <div className="formCard"><label>Asset ticker<input value={ticker} onChange={e=>setTicker(e.target.value)} /></label><p className="muted small">Add a $25 practice allocation. This prototype records the amount only; it does not represent shares or a live market fill.</p><button className="primaryButton" onClick={simulatePosition} disabled={cash<25}>Record $25 practice allocation</button></div>
      <h3 className="subhead">Practice positions</h3>
      {positions.length===0 ? <div className="empty">No practice positions yet.</div> : positions.map((p,i)=><div className="position" key={i}><strong>{p.symbol}</strong><span>Virtual allocation</span><b>{money(p.amount)}</b></div>)}
      <p className="fineprint">This first build does not calculate market-value returns. Price-based portfolio accounting is a later milestone.</p>
    </div>}

    <footer><div className="footerMark"><CircleDollarSign size={17}/> investing pal</div><p>Educational research and simulated investing. Not investment advice. Market data is not connected in this prototype.</p><span>EARLY ACCESS BUILD · 0.1.0</span></footer>
  </main>;
}

function AssetList({assets}:{assets:Asset[]}) {
  if (!assets.length) return <div className="empty">No matching assets. Try another ticker.</div>;
  return <div className="assetList">{assets.map(a=><div className="assetRow" key={a.symbol}><div className="assetLogo">{a.symbol.slice(0,1)}</div><div className="assetInfo"><strong>{a.symbol}</strong><span>{a.name} · {a.category}</span></div><span className="assetNote">{a.note}</span></div>)}</div>;
}
