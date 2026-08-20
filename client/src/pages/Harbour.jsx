import { useEffect, useMemo, useState } from "react";
import BackToStudio from "../components/BackToStudio.jsx";
import { setSeo } from "../seo.js";

const DISHES = [
  { name: "Yellowfin", price: 38, img: "/images/kingklip.jpg", blurb: "Citrus, chilli oil, shaved fennel. Seared on the pass." },
  { name: "Charred chicken", price: 42, img: "/images/chicken.jpg", blurb: "Herb oil, bird’s eye chilli, charred lemon. Share it." },
  { name: "Honey tart", price: 16, img: "/images/malva.jpg", blurb: "Warm pastry, vanilla ice cream. The one people come back for." },
];

const MENU = [
  { name: "Oysters", info: "Shallot vinegar, lemon. Six or twelve.", price: 28, tag: "Starters" },
  { name: "Tomato & burrata", info: "Heirloom tomatoes, basil oil, sea salt.", price: 18, tag: "Starters" },
  { name: "Calamari", info: "Flash-fried, lemon, aioli.", price: 19, tag: "Starters" },
  { name: "Mussels", info: "White wine, garlic, grilled sourdough.", price: 21, tag: "Starters" },
  { name: "Yellowfin", info: "Citrus, fennel, blistered tomato.", price: 38, tag: "Mains" },
  { name: "Charred chicken", info: "Herb oil, chilli, charred lemon.", price: 42, tag: "Mains" },
  { name: "Dry-aged ribeye", info: "300g, bone marrow butter, watercress.", price: 64, tag: "Mains" },
  { name: "Handmade tagliatelle", info: "Clams, chilli, parsley.", price: 29, tag: "Mains" },
  { name: "Catch of the day", info: "Ask — whatever landed this morning.", price: 36, tag: "Mains" },
  { name: "Honey tart", info: "Vanilla ice cream.", price: 16, tag: "Dessert" },
  { name: "Citrus posset", info: "Shortbread, candied peel.", price: 14, tag: "Dessert" },
  { name: "Cheese board", info: "Three cheeses, preserves, crackers.", price: 22, tag: "Dessert" },
];

const WINES = [
  { name: "Sancerre", where: "Loire", glass: 14, bottle: 52 },
  { name: "Pinot Noir", where: "Oregon", glass: 16, bottle: 58 },
  { name: "Cabernet", where: "Napa", glass: 18, bottle: 64 },
  { name: "Champagne brut", where: "France", glass: 19, bottle: 72 },
  { name: "Riesling", where: "Mosel", glass: 13, bottle: 48 },
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

const TABS = ["All", "Starters", "Mains", "Dessert"];

function rand(n) {
  return `$${n}`;
}

function capeClock() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Johannesburg",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
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
  const [form, setForm] = useState({ name: "", phone: "", guests: "2", when: "", note: "" });
  const [clock, setClock] = useState(capeClock);
  const [tables, setTables] = useState(4);
  const [query, setQuery] = useState("");
  const [dish, setDish] = useState(null);
  const [toast, setToast] = useState("");
  const [favs, setFavs] = useState([]);
  const [navOpen, setNavOpen] = useState(false);

  function go(next) {
    setPage(next);
    setNavOpen(false);
  }

  useEffect(() => {
    const id = setInterval(() => setClock(capeClock()), 1000);
    return () => clearInterval(id);
  }, []);

  const rows = useMemo(() => {
    const base = tab === "All" ? MENU : MENU.filter((item) => item.tag === tab);
    const q = query.trim().toLowerCase();
    return q ? base.filter((item) => item.name.toLowerCase().includes(q) || item.info.toLowerCase().includes(q)) : base;
  }, [tab, query]);

  function submit(e) {
    e.preventDefault();
    const table = 3 + Math.floor(Math.random() * 9);
    setBooked({ ...form, table });
    setTables((n) => Math.max(1, n - 1));
    setPage("reserve");
  }

  function saveDish(name) {
    setFavs((f) => (f.includes(name) ? f.filter((x) => x !== name) : [...f, name]));
    setToast(favs.includes(name) ? `Removed ${name}` : `Saved ${name} for tonight`);
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <div className="harbour-body">
      <BackToStudio />
      <header className="site-nav harbour-nav">
        <div className="wrap">
          <button className="brand bare" type="button" onClick={() => go("home")}>
            Harbour Kitchen
          </button>
          <nav className="nav-links">
            <button type="button" onClick={() => go("menu")}>Menu</button>
            <button type="button" onClick={() => go("wine")}>Wine</button>
            <button type="button" onClick={() => go("events")}>Tonight</button>
            <button type="button" onClick={() => go("visit")}>Visit</button>
            <button type="button" onClick={() => go("reserve")}>Reserve</button>
          </nav>
          <span className="live-pill">
            <i /> {tables} tables open
          </span>
          <button className="menu-btn" type="button" onClick={() => setNavOpen((v) => !v)}>Menu</button>
        </div>
        {navOpen ? (
          <div className="mobile-menu wrap">
            <button type="button" onClick={() => go("menu")}>Menu</button>
            <button type="button" onClick={() => go("wine")}>Wine</button>
            <button type="button" onClick={() => go("events")}>Tonight</button>
            <button type="button" onClick={() => go("visit")}>Visit</button>
            <button type="button" onClick={() => go("reserve")}>Reserve</button>
          </div>
        ) : null}
      </header>
      <div className="harbour-livebar" aria-hidden="true">
        <div className="ticker-track">
          {[`${tables} tables open`, "Kitchen live tonight", "Terrace · dogs welcome", "Waterfront kitchen", "Card · contactless", `${tables} tables open`, "Walk-ins if we have a seat"].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {page === "home" && (
        <>
          <section className="harbour-hero" id="top">
            <div className="wrap">
              <p className="kicker">Waterfront · twelve tables · live</p>
              <h1 className="display">Fire, fish, harbour light.</h1>
              <p className="harbour-lead">
                Twelve tables over the water. We cook what landed today. No tasting menu. No fuss.
              </p>
              <div className="actions">
                <button className="btn btn-gold" type="button" onClick={() => setPage("reserve")}>
                  Book a table
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => setPage("menu")}>
                  See the menu
                </button>
              </div>
            </div>
          </section>

          <section className="wrap">
            <p className="kicker">The room</p>
            <div className="grid-2">
              <div>
                <h2 className="display section-title">A small kitchen over the water.</h2>
                <p className="lede">
                  Harbour Kitchen is twelve tables and a pass that faces the harbour. Fish comes in the same day. We cook it the same night.
                </p>
              </div>
              <p className="lede">
                Walk-ins if we have a spare seat. Otherwise book on this site. Kids are welcome at lunch. Dogs on the terrace. Card or contactless.
              </p>
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
                    <h3 className="display">{d.name}</h3>
                    <p className="muted">{d.blurb}</p>
                    <p className="price">{rand(d.price)}</p>
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
              <img src="/images/kingklip.jpg" alt="Yellowfin" />
              <img src="/images/chicken.jpg" alt="Charred chicken" />
              <img src="/images/malva.jpg" alt="Honey tart" />
            </div>
          </section>
        </>
      )}

      {page === "menu" && (
        <section className="wrap page-pad">
          <p className="kicker">Menu</p>
          <h2 className="display section-title">A short list. Done properly.</h2>
          <input
            className="search"
            placeholder="Search oysters, chicken, tart…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="tabs">
            {TABS.map((t) => (
              <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)} type="button">
                {t}
              </button>
            ))}
          </div>
          {rows.map((row) => (
            <div className="menu-row" key={row.name}>
              <div>
                <h3>{row.name}</h3>
                <p className="muted">{row.info}</p>
              </div>
              <div className="row-end">
                <strong>{rand(row.price)}</strong>
                <button className="tiny" type="button" onClick={() => saveDish(row.name)}>
                  {favs.includes(row.name) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
          {favs.length ? <p className="lede" style={{ marginTop: 20 }}>Saved for tonight: {favs.join(", ")}</p> : null}
        </section>
      )}

      {page === "wine" && (
        <section className="wrap page-pad">
          <p className="kicker">Cellar</p>
          <h2 className="display section-title">By the glass. One bottle if you stay.</h2>
          <p className="lede">We pour by the glass so you can stay for one.</p>
          {WINES.map((w) => (
            <div className="menu-row" key={w.name}>
              <div>
                <h3>{w.name}</h3>
                <p className="muted">{w.where}</p>
              </div>
              <strong>{rand(w.glass)} glass · {rand(w.bottle)} bottle</strong>
            </div>
          ))}
          <p className="lede" style={{ marginTop: 28 }}>
            Corkage $18. No spirits. Grape juice and good coffee.
          </p>
        </section>
      )}

      {page === "events" && (
        <section className="wrap page-pad">
          <p className="kicker">Tonight and this week</p>
          <h2 className="display section-title">{tables} tables left tonight.</h2>
          <div className="grid-3">
            {EVENTS.map((ev) => (
              <article className="about-card dark-card" key={ev.title}>
                <p className="kicker">{ev.day}</p>
                <h3>{ev.title}</h3>
                <p className="muted">{ev.note}</p>
                <button className="btn btn-gold" type="button" style={{ marginTop: 16 }} onClick={() => setPage("reserve")}>
                  Book
                </button>
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
              <p className="lede">WhatsApp 072 000 0000</p>
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

      {page === "reserve" && (
        <section className="wrap page-pad">
          {booked ? (
            <div className="confirm">
              <p className="kicker">You’re in</p>
              <h2 className="display">Table {booked.table} is held for {booked.name}.</h2>
              <p className="lede">
                {booked.guests} guests · {booked.when || "tonight"}. We’ll WhatsApp {booked.phone}. This is a demo — no real booking was sent.
              </p>
              <button className="btn btn-gold" type="button" onClick={() => setBooked(null)}>
                Book another
              </button>
            </div>
          ) : (
            <div className="reserve-box">
              <div>
                <p className="kicker">Reserve</p>
                <h2 className="display">Hold a table.</h2>
                <p className="lede">
                  {tables} tables still open. We keep yours 15 minutes. Tell us about birthdays, allergies, or a window seat.
                </p>
              </div>
              <form onSubmit={submit}>
                <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>WhatsApp<input required placeholder="072 …" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label>Guests
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                    {[2, 3, 4, 5, 6, 8].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </label>
                <label>Date and time<input type="datetime-local" required value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} /></label>
                <label>Note<textarea placeholder="Window table, birthday, no shellfish" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
                <button className="btn btn-gold" type="submit">Request table</button>
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
              <p className="kicker">From the pass</p>
              <h2 className="display">{dish.name}</h2>
              <p className="lede">{dish.blurb}</p>
              <p className="price">{rand(dish.price)}</p>
              <button className="btn btn-gold" type="button" onClick={() => { saveDish(dish.name); setDish(null); setPage("reserve"); }}>
                Book a table for this
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? <div className="toast">{toast}</div> : null}

      <footer className="wrap">
        <span>Harbour Kitchen · waterfront</span>
        <a href="/">Web Work Co</a>
      </footer>
    </div>
  );
}
