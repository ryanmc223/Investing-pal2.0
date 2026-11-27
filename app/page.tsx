'use client';

import { useMemo, useState } from 'react';
import {
  Activity, Bell, BookOpen, BrainCircuit, CalendarDays, ChartNoAxesCombined,
  ChevronRight, CircleAlert, Compass, FileSearch, Landmark, LineChart,
  Newspaper, Radar, Search, ShieldCheck, SlidersHorizontal, Sparkles,
  TrendingDown, TrendingUp, WalletCards, X
} from 'lucide-react';

type Tab = 'Watchtower' | 'Markets' | 'Research' | 'Alerts';
type Market = 'All' | 'Stocks & ETFs' | 'Options' | 'Crypto' | 'Commodities' | 'Forex' | 'Bonds' | 'Futures';

const markets: { name: Exclude<Market, 'All'>; detail: string; symbol: string }[] = [
  { name: 'Stocks & ETFs', detail: 'Companies and funds', symbol: 'AAPL · SPY' },
  { name: 'Options', detail: 'Contracts and risk education', symbol: 'Options chains' },
  { name: 'Crypto', detail: 'Digital assets', symbol: 'BTC · ETH' },
  { name: 'Commodities', detail: 'Metals and energy', symbol: 'Gold · Oil' },
  { name: 'Forex', detail: 'Currency pairs', symbol: 'EUR/USD' },
  { name: 'Bonds', detail: 'Treasuries and fixed income', symbol: 'Treasury yields' },
  { name: 'Futures', detail: 'Futures market research', symbol: 'Index · Energy' },
];

const watchItems = [
  { ticker: 'AAPL', name: 'Apple Inc.', market: 'Stocks & ETFs' as Market, reason: 'Earnings and product cycle', status: 'Needs review', tone: 'amber' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', market: 'Stocks & ETFs' as Market, reason: 'Cloud growth and valuation', status: 'On watch', tone: 'green' },
  { ticker: 'SPY', name: 'S&P 500 ETF', market: 'Stocks & ETFs' as Market, reason: 'Broad U.S. equity exposure', status: 'On watch', tone: 'green' },
  { ticker: 'BTC', name: 'Bitcoin', market: 'Crypto' as Market, reason: 'Volatility and market structure', status: 'Higher volatility', tone: 'amber' },
  { ticker: 'GLD', name: 'Gold ETF', market: 'Commodities' as Market, reason: 'Gold market exposure', status: 'On watch', tone: 'green' },
];

const alerts = [
  { title: 'Research review suggested', text: 'A tracked company has an upcoming earnings event. Review its latest filings and expectations.', time: 'Example alert · Today', kind: 'Review' },
  { title: 'Risk factor to monitor', text: 'A change in market conditions could affect an asset thesis. Check the source and context before drawing conclusions.', time: 'Example alert · Yesterday', kind: 'Risk' },
  { title: 'Daily market briefing', text: 'Your briefing will summarize material developments across the markets you follow.', time: 'Preview · Daily', kind: 'Briefing' },
];

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('Watchtower');
  const [market, setMarket] = useState<Market>('All');
  const [query, setQuery] = useState('');
  const [ticker, setTicker] = useState('AAPL');
  const [horizon, setHorizon] = useState('Short and long term');
  const [report, setReport] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [daily, setDaily] = useState(true);
  const [important, setImportant] = useState(true);
  const [watchlistAlerts, setWatchlistAlerts] = useState(true);

  const filtered = useMemo(() => watchItems.filter(item =>
    (market === 'All' || item.market === market) &&
    (item.ticker + item.name).toLowerCase().includes(query.toLowerCase())
  ), [market, query]);

  async function runResearch(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setReport('');
    try {
      const response = await fetch('/api/research', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, market: 'Research', horizon }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI research is not connected yet.');
      setReport(data.report || 'Research report received.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research service is not connected yet.');
    } finally { setBusy(false); }
  }

  const nav = [
    { label: 'Watchtower' as Tab, icon: Radar },
    { label: 'Markets' as Tab, icon: Compass },
    { label: 'Research' as Tab, icon: FileSearch },
    { label: 'Alerts' as Tab, icon: Bell },
  ];

  return <main className="shell">
    <header className="topbar">
      <div className="brand"><div className="brandIcon"><ChartNoAxesCombined size={22}/></div><div><strong>investing pal</strong><span>Your AI market research partner</span></div></div>
      <button className="iconButton" aria-label="Open alerts" onClick={() => setTab('Alerts')}><Bell size={19}/></button>
    </header>

    <section className="welcome">
      <div className="eyebrow">AI MARKET INTELLIGENCE</div>
      <h1>See the market<br/><em>with more clarity.</em></h1>
      <p>Research opportunities, understand risk, and keep up with developments across seven markets.</p>
      <div className="modePill"><span/> RESEARCH ONLY · NO TRADING</div>
    </section>

    <nav className="tabs" aria-label="Main navigation">
      {nav.map(({label, icon:Icon}) => <button key={label} className={tab===label?'tab active':'tab'} onClick={()=>setTab(label)}><Icon size={17}/><span>{label}</span></button>)}
    </nav>

    {tab === 'Watchtower' && <div className="content">
      <div className="sectionHeading"><div><span className="eyebrow">YOUR MARKET RADAR</span><h2>AI Watchtower</h2></div><span className="tag">PREVIEW</span></div>
      <div className="watchtowerCard">
        <div className="watchtowerTop"><div className="radarIcon"><Radar size={22}/></div><span className="liveLabel"><i/> MONITORING PREVIEW</span></div>
        <h3>Your research, all in one place.</h3>
        <p>Watchtower is being prepared to monitor selected assets, news, and research signals on a schedule.</p>
        <div className="watchtowerStats"><div><strong>7</strong><span>Markets planned</span></div><div><strong>{watchItems.length}</strong><span>Sample watchlist</span></div><div><strong>0</strong><span>Live feeds connected</span></div></div>
      </div>
      <div className="statsGrid">
        <div className="statCard"><span>Research alerts</span><strong>2</strong><small>Example items</small></div>
        <div className="statCard"><span>Daily briefing</span><strong>{daily ? 'On' : 'Off'}</strong><small>Preference preview</small></div>
      </div>
      <div className="sectionHeading"><div><span className="eyebrow">NEEDS ATTENTION</span><h2>Research queue</h2></div><button className="textButton" onClick={()=>setTab('Alerts')}>View alerts <ChevronRight size={15}/></button></div>
      {alerts.slice(0,2).map((a,i)=><div className="alertCard" key={a.title}><div className="alertIcon">{i===0?<CalendarDays size={17}/>:<CircleAlert size={17}/>}</div><div><strong>{a.title}</strong><p>{a.text}</p><small>{a.time}</small></div></div>)}
      <div className="callout"><ShieldCheck size={19}/><div><strong>Evidence before conclusions</strong><p>Every future AI report should show sources, timestamps, assumptions, uncertainty, and downside risks.</p></div></div>
    </div>}

    {tab === 'Markets' && <div className="content">
      <div className="eyebrow">SEVEN MARKET CATEGORIES</div><h2>Explore markets</h2><p className="muted">Choose a market to explore research topics. Live market feeds are not connected yet.</p>
      <div className="marketGrid">{markets.map((m,i)=><button className="marketTile" key={m.name} onClick={()=>{setMarket(m.name);setTab('Watchtower')}}><span className="marketTileIcon">{[<ChartNoAxesCombined size={19}/>,<Activity size={19}/>,<Sparkles size={19}/>,<LineChart size={19}/>,<TrendingUp size={19}/>,<Landmark size={19}/>,<WalletCards size={19}/>][i]}</span><strong>{m.name}</strong><small>{m.detail}</small><em>{m.symbol}</em></button>)}</div>
      <div className="notice"><BookOpen size={18}/><span>Options and futures content will emphasize contract mechanics, leverage risks, and education. No trade execution is offered.</span></div>
    </div>}

    {tab === 'Research' && <div className="content">
      <div className="eyebrow">AI-ASSISTED RESEARCH</div><h2>Ask the analyst</h2><p className="muted">Request an educational research brief. The AI and licensed market-data services are not connected in this preview.</p>
      <form className="formCard" onSubmit={runResearch}>
        <label>Asset, company, or topic<input value={ticker} onChange={e=>setTicker(e.target.value)} required placeholder="e.g. AAPL or gold"/></label>
        <label>Research horizon<select value={horizon} onChange={e=>setHorizon(e.target.value)}><option>Short and long term</option><option>Short term</option><option>Long term</option></select></label>
        <button className="primaryButton" disabled={busy}>{busy?'Preparing request…':'Request research brief'}</button>
      </form>
      {error && <div className="notice error"><CircleAlert size={17}/><span>{error}</span></div>}
      {report && <div className="report"><h3>Research brief</h3><pre>{report}</pre></div>}
      <div className="researchChecklist"><strong>A complete report will include</strong><span><ShieldCheck size={15}/> Bull, base, and bear scenarios</span><span><ShieldCheck size={15}/> Evidence, source links, and data timestamps</span><span><ShieldCheck size={15}/> Risks and thesis invalidation factors</span><span><ShieldCheck size={15}/> Confidence limits and missing information</span></div>
    </div>}

    {tab === 'Alerts' && <div className="content">
      <div className="eyebrow">NOTIFICATION CENTER</div><h2>Alerts & briefings</h2><p className="muted">Choose the updates you want Investing Pal to prepare. Actual background monitoring and push delivery are not active yet.</p>
      <div className="settingsCard">
        <Toggle title="Important research alerts" detail="Material company, market, or risk developments." value={important} onChange={setImportant}/>
        <Toggle title="Watchlist updates" detail="News and events related to tracked assets." value={watchlistAlerts} onChange={setWatchlistAlerts}/>
        <Toggle title="Daily market briefing" detail="A morning digest across your selected markets." value={daily} onChange={setDaily}/>
      </div>
      <div className="sectionHeading"><div><span className="eyebrow">RECENT EXAMPLES</span><h2>Alert preview</h2></div></div>
      {alerts.map((a,i)=><div className="alertCard" key={a.title}><div className="alertIcon">{i===0?<Newspaper size={17}/>:i===1?<CircleAlert size={17}/>:<CalendarDays size={17}/>}</div><div><strong>{a.title}</strong><p>{a.text}</p><small>{a.time} · {a.kind}</small></div></div>)}
      <div className="notice"><Bell size={18}/><span>To receive push notifications later, users will need to install the web app on their device and grant notification permission.</span></div>
    </div>}

    <footer><div className="footerMark"><BrainCircuit size={17}/> investing pal</div><p>Educational market research only. Not a brokerage. No trade execution. This preview uses sample content; live data, AI analysis, background monitoring, and push notifications are not connected yet.</p><span>EARLY ACCESS BUILD · 0.2.0</span></footer>
  </main>;
}

function Toggle({title,detail,value,onChange}:{title:string;detail:string;value:boolean;onChange:(v:boolean)=>void}) {
  return <div className="toggleRow"><div><strong>{title}</strong><p>{detail}</p></div><button type="button" className={value?'switch on':'switch'} aria-pressed={value} onClick={()=>onChange(!value)}><i/></button></div>;
}
