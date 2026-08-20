import { useEffect, useMemo, useState } from "react";
import BackToStudio from "../components/BackToStudio.jsx";
import { setSeo } from "../seo.js";

const DISHES = [
  { name: "Yellowfin", price: 38, img: "/images/kingklip.jpg", blurb: "Citrus, chilli oil, shaved fennel. Seared on the pass.", pair: "Sancerre", left: 7 },
  { name: "Charred chicken", price: 42, img: "/images/chicken.jpg", blurb: "Herb oil, bird’s eye chilli, charred lemon. Share it.", pair: "Pinot Noir", left: 4 },
  { name: "Honey tart", price: 16, img: "/images/malva.jpg", blurb: "Warm pastry, vanilla ice cream. The one people come back for.", pair: "Riesling", left: 11 },
];

const MENU = [
  { name: "Oysters", info: "Shallot vinegar, lemon. Six or twelve.", price: 28, tag: "Starters", pair: "Champagne brut" },
  { name: "Tomato & burrata", info: "Heirloom tomatoes, basil oil, sea salt.", price: 18, tag: "Starters", pair: "Sancerre" },
  { name: "Calamari", info: "Flash-fried, lemon, aioli.", price: 19, tag: "Starters", pair: "Riesling" },
  { name: "Mussels", info: "White wine, garlic, grilled sourdough.", price: 21, tag: "Starters", pair: "Sancerre" },
  { name: "Yellowfin", info: "Citrus, fennel, blistered tomato.", price: 38, tag: "Mains", pair: "Sancerre" },
  { name: "Charred chicken", info: "Herb oil, chilli, charred lemon.", price: 42, tag: "Mains", pair: "Pinot Noir" },
  { name: "Dry-aged ribeye", info: "300g, bone marrow butter, watercress.", price: 64, tag: "Mains", pair: "Cabernet" },
  { name: "Handmade tagliatelle", info: "Clams, chilli, parsley.", price: 29, tag: "Mains", pair: "Riesling" },
  { name: "Catch of the day", info: "Ask — whatever landed this morning.", price: 36, tag: "Mains", pair: "Sancerre" },
  { name: "Honey tart", info: "Vanilla ice cream.", price: 16, tag: "Dessert", pair: "Riesling" },
  { name: "Citrus posset", info: "Shortbread, candied peel.", price: 14, tag: "Dessert", pair: "Champagne brut" },
  { name: "Cheese board", info: "Three cheeses, preserves, crackers.", price: 22, tag: "Dessert", pair: "Pinot Noir" },
];

const WINES = [
  { name: "Sancerre", where: "Loire", glass: 14, bottle: 52, note: "Citrus, flint. With the fish." },
  { name: "Pinot Noir", where: "Oregon", glass: 16, bottle: 58, note: "Red fruit, light enough for chicken." },
  { name: "Cabernet", where: "Napa", glass: 18, bottle: 64, note: "For the ribeye." },
  { name: "Champagne brut", where: "France", glass: 19, bottle: 72, note: "Start here. Stay here." },
  { name: "Riesling", where: "Mosel", glass: 13, bottle: 48, note: "With tart, or the mussels." },
];

const EVENTS = [
  { day: "Friday", title: "Harbour jazz", note: "A trio from 19:00. No cover. Book if you want the glass." },
  { day: "Sunday", title: "Long lunch", note: "Set menu $58. Last sitting 14:00." },
  { day: "First Monday", title: "Private room", note: "The back room for 12. Email for the date." },
];

const REVIEWS = [
  { who: "Maya, London", text: "The fish was the best I’ve had this year. They held the table when we were late." },
  { who: "James, Lisbon", text: "Walked in with the dog. Terrace, no fuss." },
  { who: "Aisha, New York", text: "Booked on the site. Messaged when we were parking." },
];

const HOURS = [
  ["Wednesday", "17:00 – 22:00"],
  ["Thursday", "17:00 – 22:00"],
  ["Friday", "12:00 – 15:00 · 17:00 – 22:30"],
  ["Saturday", "12:00 – 15:00 · 17:00 – 22:30"],
  ["Sunday", "12:00 – 16:00"],
  ["Monday – Tuesday", "Closed"],
];

const TABLES = [
  { id: 1, seats: 2, zone: "Glass" },
  { id: 2, seats: 2, zone: "Glass" },
  { id: 3, seats: 4, zone: "Glass" },
  { id: 4, seats: 2, zone: "Glass" },
  { id: 5, seats: 4, zone: "Room" },
  { id: 6, seats: 4, zone: "Room" },
  { id: 7, seats: 2, zone: "Room" },
  { id: 8, seats: 6, zone: "Room" },
  { id: 9, seats: 2, zone: "Terrace" },
  { id: 10, seats: 4, zone: "Terrace" },
  { id: 11, seats: 2, zone: "Terrace" },
  { id: 12, seats: 12, zone: "Private" },
];

const SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

const CATCH = [
  { name: "Yellowfin", note: "Landed this morning. Seared, citrus, fennel." },
  { name: "Mussels", note: "Same-day. White wine, garlic, grilled bread." },
  { name: "Line fish", note: "Two pans left. Ask the pass." },
];

const FEED = [
  "Walk-in seated · glass",
  "2-top held 15 minutes",
  "Kitchen fired the yellowfin",
  "Party of 4 on the terrace",
  "Oregon pinot poured",
  "Table 7 sat",
  "Private room enquiry",
];

const TABS = ["All", "Starters", "Mains", "Dessert"];
const NAV = [
  ["menu", "Menu"],
  ["wine", "Wine"],
  ["tonight", "Tonight"],
  ["visit", "Visit"],
  ["private", "Private"],
  ["reserve", "Reserve"],
];

function money(n) {
  return `$${n}`;
}

function clockNow() {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
}

export default function Harbour() {
  useEffect(() => {
    setSeo({
      title: "Harbour Kitchen | Sample restaurant site by Web Work Co",
      description: "A live sample restaurant website built by Web Work Co. Demo only, not a real business.",
      url: "https://webworkco.com/harbour-kitchen/",
    });
  }, []);

  const [tab, setTab] = useState("All");
  const [page, setPage] = useState("home");
  const [booked, setBooked] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", note: "" });
  const [clock, setClock] = useState(clockNow);
  const [taken, setTaken] = useState(() => new Set([3, 5, 8, 10]));
  const [pick, setPick] = useState(null);
  const [slot, setSlot] = useState("19:00");
  const [covers, setCovers] = useState(() => Object.fromEntries(SLOTS.map((s, i) => [s, 8 - i])));
  const [catchIdx, setCatchIdx] = useState(0);
  const [feed, setFeed] = useState(["Kitchen live", "Catch: yellowfin", "Walk-ins if we have a seat"]);
  const [query, setQuery] = useState("");
  const [dish, setDish] = useState(null);
  const [toast, setToast] = useState("");
  const [favs, setFavs] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [hold, setHold] = useState(0);
  const [pour, setPour] = useState(null);
  const [privateForm, setPrivateForm] = useState({ name: "", date: "", guests: "8", note: "" });
  const [privateSent, setPrivateSent] = useState(false);

  const tablesOpen = TABLES.filter((t) => !taken.has(t.id)).length;
  const catchNow = CATCH[catchIdx % CATCH.length];

  function go(next) {
    setPage(next);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ping(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  useEffect(() => {
    const id = setInterval(() => setClock(clockNow()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hold <= 0) return undefined;
    const id = setInterval(() => setHold((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, [hold]);

  useEffect(() => {
    const id = setInterval(() => {
      setTaken((prev) => {
        const next = new Set(prev);
        const open = TABLES.filter((t) => !next.has(t.id));
        const closed = TABLES.filter((t) => next.has(t.id));
        if (open.length > 7 && closed.length) {
          next.delete(closed[Math.floor(Math.random() * closed.length)].id);
        } else if (open.length < 4 && open.length) {
          next.add(open[Math.floor(Math.random() * open.length)].id);
        } else if (Math.random() > 0.45 && open.length) {
          next.add(open[Math.floor(Math.random() * open.length)].id);
        } else if (closed.length) {
          next.delete(closed[Math.floor(Math.random() * closed.length)].id);
        }
        return next;
      });
      setFeed((f) => [FEED[Math.floor(Math.random() * FEED.length)], ...f].slice(0, 5));
      setCovers((c) => {
        const key = SLOTS[Math.floor(Math.random() * SLOTS.length)];
        const n = c[key];
        if (n <= 1) return c;
        return { ...c, [key]: n - (Math.random() > 0.6 ? 1 : 0) };
      });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCatchIdx((n) => n + 1), 9000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(() => {
    const base = tab === "All" ? MENU : MENU.filter((item) => item.tag === tab);
    const q = query.trim().toLowerCase();
    return q ? base.filter((item) => item.name.toLowerCase().includes(q) || item.info.toLowerCase().includes(q)) : base;
  }, [tab, query]);

  function submit(e) {
    e.preventDefault();
    if (covers[slot] <= 0) {
      ping("That sitting is full. Pick another time.");
      return;
    }
    const table = pick || TABLES.find((t) => !taken.has(t.id) && t.seats >= Number(form.guests))?.id || 4;
    setBooked({ ...form, table, slot });
    setTaken((prev) => new Set(prev).add(table));
    setCovers((c) => ({ ...c, [slot]: Math.max(0, c[slot] - 1) }));
    setHold(15 * 60);
    setPage("reserve");
    setPick(null);
  }

  function saveDish(name) {
    setFavs((f) => (f.includes(name) ? f.filter((x) => x !== name) : [...f, name]));
    ping(favs.includes(name) ? `Removed ${name}` : `Saved ${name} for tonight`);
  }

  function holdGlass(w) {
    setPour(w.name);
    ping(`${w.name} · glass held at the bar`);
  }

  const holdLabel = `${String(Math.floor(hold / 60)).padStart(2, "0")}:${String(hold % 60).padStart(2, "0")}`;

  return (
    <div className="harbour-body">
      <BackToStudio />
      <header className="site-nav harbour-nav">
        <div className="wrap">
          <button className="brand bare" type="button" onClick={() => go("home")}>
            Harbour Kitchen
          </button>
          <nav className="nav-links">
            {NAV.map(([id, label]) => (
              <button key={id} type="button" className={page === id ? "on" : ""} onClick={() => go(id)}>
                {label}
              </button>
            ))}
          </nav>
          <span className="live-pill">
            <i /> {tablesOpen} tables · {clock}
          </span>
          <button className="menu-btn" type="button" onClick={() => setNavOpen((v) => !v)}>Menu</button>
        </div>
        {navOpen ? (
          <div className="mobile-menu wrap">
            {NAV.map(([id, label]) => (
              <button key={id} type="button" onClick={() => go(id)}>{label}</button>
            ))}
          </div>
        ) : null}
      </header>
      <div className="harbour-livebar" aria-hidden="true">
        <div className="ticker-track">
          {[`${tablesOpen} tables open`, `Catch · ${catchNow.name}`, "Kitchen live", "Terrace · dogs welcome", `Next sitting ${slot}`, "Card · contactless", `${tablesOpen} tables open`, "Walk-ins if we have a seat"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {page === "home" && (
        <>
          <section className="harbour-hero" id="top">
            <div className="wrap">
              <p className="kicker">Waterfront · twelve tables · live {clock}</p>
              <h1 className="display">Fire, fish, harbour light.</h1>
              <p className="harbour-lead">
                Twelve tables over the water. We cook what landed today. No tasting menu. No fuss.
              </p>
              <div className="actions">
                <button className="btn btn-gold" type="button" onClick={() => go("reserve")}>Book a table</button>
                <button className="btn btn-ghost" type="button" onClick={() => go("menu")}>See the menu</button>
              </div>
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">Live board</p>
            <div className="live-board">
              <article className="live-stat">
                <span>Tables open</span>
                <b>{tablesOpen}</b>
                <em>of 12</em>
              </article>
              <article className="live-stat">
                <span>Catch now</span>
                <b>{catchNow.name}</b>
                <em>{catchNow.note}</em>
              </article>
              <article className="live-stat">
                <span>Kitchen</span>
                <b>Live</b>
                <em>Last seating 21:00</em>
              </article>
              <article className="live-stat">
                <span>Just now</span>
                <ul className="feed-list">
                  {feed.slice(0, 3).map((line, i) => (
                    <li key={`${line}-${i}`}>{line}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">The pass</p>
            <div className="grid-2">
              <div>
                <h2 className="display section-title">A small kitchen over the water.</h2>
                <p className="lede">
                  Harbour Kitchen is twelve tables and a pass that faces the harbour. Fish comes in the same day. We cook it the same night.
                </p>
                <p className="lede" style={{ marginTop: 14 }}>
                  Walk-ins if we have a spare seat. Otherwise book on this site. Kids at lunch. Dogs on the terrace. Card or contactless.
                </p>
              </div>
              <img className="pass-shot" src="/images/harbour-pass.jpg" alt="The pass plating fish" />
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">Tap a dish</p>
            <h2 className="display section-title">From the pass</h2>
            <div className="dish-grid">
              {DISHES.map((d) => (
                <article className="dish live-card" key={d.name} onClick={() => setDish(d)}>
                  <img src={d.img} alt={d.name} />
                  <div>
                    <p className="kicker">{d.left} left tonight · pairs {d.pair}</p>
                    <h3 className="display">{d.name}</h3>
                    <p className="muted">{d.blurb}</p>
                    <p className="price">{money(d.price)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">People who sat here</p>
            <div className="grid-3">
              {REVIEWS.map((r) => (
                <article className="about-card dark-card" key={r.who}>
                  <p>“{r.text}”</p>
                  <p className="muted" style={{ marginTop: 10 }}>{r.who}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">The room in pictures</p>
            <div className="gallery">
              <img src="/images/harbour-night.jpg" alt="Dining room at night" />
              <img src="/images/harbour-pass.jpg" alt="The pass" />
              <img src="/images/harbour-wine.jpg" alt="Cellar" />
              <img src="/images/chicken.jpg" alt="Charred chicken" />
            </div>
          </section>
        </>
      )}

      {page === "menu" && (
        <section className="wrap page-pad">
          <p className="kicker">Menu · live</p>
          <h2 className="display section-title">A short list. Done properly.</h2>
          <p className="lede">Tap save. We keep a list for your table. Search or filter.</p>
          <input className="search" placeholder="Search oysters, chicken, tart…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)} type="button">{t}</button>
            ))}
          </div>
          {rows.map((row) => (
            <div className="menu-row" key={row.name}>
              <div>
                <h3>{row.name}</h3>
                <p className="muted">{row.info} · pour {row.pair}</p>
              </div>
              <div className="row-end">
                <strong>{money(row.price)}</strong>
                <button className="tiny" type="button" onClick={() => saveDish(row.name)}>
                  {favs.includes(row.name) ? "Saved" : "Save"}
                </button>
                <button className="tiny" type="button" onClick={() => { go("wine"); ping(`Open cellar for ${row.pair}`); }}>
                  Wine
                </button>
              </div>
            </div>
          ))}
          {favs.length ? (
            <p className="lede" style={{ marginTop: 20 }}>
              Saved for tonight: {favs.join(", ")}.{" "}
              <button className="bare" type="button" onClick={() => go("reserve")}>Book with this list →</button>
            </p>
          ) : null}
        </section>
      )}

      {page === "wine" && (
        <section className="wrap page-pad">
          <p className="kicker">Cellar · tap a wine</p>
          <h2 className="display section-title">By the glass. One bottle if you stay.</h2>
          <p className="lede">Hold a glass at the bar — demo only. We pour so you can stay for one.</p>
          <img className="pass-shot" src="/images/harbour-wine.jpg" alt="The cellar" style={{ margin: "22px 0 28px", maxHeight: 320, objectFit: "cover", width: "100%", borderRadius: 22 }} />
          {WINES.map((w) => (
            <button
              className={`menu-row wine-hit ${pour === w.name ? "on" : ""}`}
              key={w.name}
              type="button"
              onClick={() => holdGlass(w)}
            >
              <div>
                <h3>{w.name}</h3>
                <p className="muted">{w.where} · {w.note}</p>
              </div>
              <strong>{money(w.glass)} glass · {money(w.bottle)} bottle</strong>
            </button>
          ))}
          <p className="lede" style={{ marginTop: 28 }}>
            {pour ? `${pour} is held at the bar for this demo.` : "Corkage $18. No spirits. Grape juice and good coffee."}
          </p>
        </section>
      )}

      {page === "tonight" && (
        <section className="wrap page-pad">
          <p className="kicker">Tonight and this week</p>
          <h2 className="display section-title">{tablesOpen} tables left · catch is {catchNow.name}.</h2>
          <p className="lede">{catchNow.note} Last seating 21:00. The board updates as tables go.</p>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {EVENTS.map((ev) => (
              <article className="about-card dark-card" key={ev.title}>
                <p className="kicker">{ev.day}</p>
                <h3>{ev.title}</h3>
                <p className="muted">{ev.note}</p>
                <button className="btn btn-gold" type="button" style={{ marginTop: 16 }} onClick={() => go("reserve")}>Book</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === "visit" && (
        <section className="wrap page-pad">
          <p className="kicker">Visit</p>
          <h2 className="display section-title">12 Harbour Road, the waterfront.</h2>
          <div className="grid-2">
            <article className="about-card dark-card">
              <h3>Hours</h3>
              {HOURS.map(([d, h]) => (
                <div className="menu-row" key={d}>
                  <span>{d}</span>
                  <strong>{h}</strong>
                </div>
              ))}
            </article>
            <article className="about-card dark-card">
              <h3>Find us</h3>
              <p className="lede">Glass wall over the marina. Parking on the street or the public lot. Four minutes from the station.</p>
              <p className="lede">WhatsApp 072 000 0000 · demo number</p>
              <p className="lede">Private lunch for up to 12 on Mondays.</p>
              <iframe
                title="Waterfront map"
                className="map"
                loading="lazy"
                src="https://maps.google.com/maps?q=waterfront%20harbour&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </article>
          </div>
        </section>
      )}

      {page === "private" && (
        <section className="wrap page-pad">
          <p className="kicker">Private room · table 12</p>
          <h2 className="display section-title">The back room. Twelve seats. One long table.</h2>
          {privateSent ? (
            <div className="confirm">
              <p className="kicker">Noted</p>
              <h2 className="display">We’ll hold the date for {privateForm.name}.</h2>
              <p className="lede">Demo only — no real email went out. A real site would confirm the room.</p>
              <button className="btn btn-gold" type="button" onClick={() => setPrivateSent(false)}>Send another</button>
            </div>
          ) : (
            <div className="reserve-box">
              <div>
                <p className="lede">Closed to the room. Set menu or the a la carte. Monday lunches, or after 21:00 Friday if the jazz is done.</p>
                <p className="lede" style={{ marginTop: 12 }}>Table 12 is {taken.has(12) ? "held tonight" : "open to enquire"}.</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPrivateSent(true);
                  setTaken((prev) => new Set(prev).add(12));
                }}
              >
                <label>Name<input required value={privateForm.name} onChange={(e) => setPrivateForm({ ...privateForm, name: e.target.value })} /></label>
                <label>Date<input type="date" required value={privateForm.date} onChange={(e) => setPrivateForm({ ...privateForm, date: e.target.value })} /></label>
                <label>Guests
                  <select value={privateForm.guests} onChange={(e) => setPrivateForm({ ...privateForm, guests: e.target.value })}>
                    {[8, 10, 12].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <label>Note<textarea value={privateForm.note} onChange={(e) => setPrivateForm({ ...privateForm, note: e.target.value })} placeholder="Birthday, set menu, no shellfish" /></label>
                <button className="btn btn-gold" type="submit">Enquire</button>
              </form>
            </div>
          )}
        </section>
      )}

      {page === "reserve" && (
        <section className="wrap page-pad">
          {booked ? (
            <div className="confirm">
              <p className="kicker">You’re in · hold {holdLabel}</p>
              <h2 className="display">Table {booked.table} is held for {booked.name}.</h2>
              <p className="lede">
                {booked.guests} guests · {booked.slot}. We’ll WhatsApp {booked.phone}. We keep the table 15 minutes. This is a demo — no real booking was sent.
              </p>
              {hold > 0 ? <p className="hold-clock">{holdLabel}</p> : <p className="lede">Hold ended on this demo. Book again if you want the clock.</p>}
              {favs.length ? <p className="lede">Kitchen note: {favs.join(", ")}.</p> : null}
              <button className="btn btn-gold" type="button" onClick={() => { setBooked(null); setHold(0); }}>Book another</button>
            </div>
          ) : (
            <div className="reserve-box">
              <div>
                <p className="kicker">Reserve · {tablesOpen} open</p>
                <h2 className="display">Pick a table. Pick a sitting.</h2>
                <p className="lede">Tap a free table. Grey ones are sat. We keep yours 15 minutes.</p>
                <div className="table-map" role="list">
                  {TABLES.map((t) => {
                    const busy = taken.has(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="listitem"
                        disabled={busy}
                        className={`table-seat ${busy ? "taken" : "open"} ${pick === t.id ? "pick" : ""}`}
                        onClick={() => {
                          setPick(t.id);
                          setForm((f) => ({ ...f, guests: String(Math.min(8, t.seats)) }));
                        }}
                      >
                        <b>{t.id}</b>
                        <span>{t.zone}</span>
                        <em>{busy ? "Sat" : `${t.seats} seats`}</em>
                      </button>
                    );
                  })}
                </div>
              </div>
              <form onSubmit={submit}>
                <p className="kicker">Sitting</p>
                <div className="slot-row">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`slot ${slot === s ? "on" : ""} ${covers[s] <= 0 ? "full" : ""}`}
                      disabled={covers[s] <= 0}
                      onClick={() => setSlot(s)}
                    >
                      {s} · {covers[s]} left
                    </button>
                  ))}
                </div>
                <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>WhatsApp<input required placeholder="+44 …" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label>Guests
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                    {[2, 3, 4, 5, 6, 8].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <label>Note<textarea placeholder="Window table, birthday, no shellfish" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="btn btn-gold" type="submit">
                  Hold {pick ? `table ${pick}` : "a table"} · {slot}
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {dish ? (
        <div className="modal" onClick={() => setDish(null)}>
          <div className="modal-card dark-modal" onClick={(e) => e.stopPropagation()}>
            <img src={dish.img} alt={dish.name} />
            <div>
              <p className="kicker">From the pass · {dish.left} left</p>
              <h2 className="display">{dish.name}</h2>
              <p className="lede">{dish.blurb}</p>
              <p className="lede">Pour {dish.pair} with this.</p>
              <p className="price">{money(dish.price)}</p>
              <button className="btn btn-gold" type="button" onClick={() => { saveDish(dish.name); setDish(null); go("reserve"); }}>
                Book a table for this
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}

      <footer className="wrap">
        <span>Harbour Kitchen · {tablesOpen} tables · {clock}</span>
        <a href="/">Web Work Co</a>
      </footer>
    </div>
  );
}
