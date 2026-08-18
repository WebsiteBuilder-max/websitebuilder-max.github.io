import { useEffect, useMemo, useState } from "react";
import BackToStudio from "../components/BackToStudio.jsx";

const DISHES = [
  { name: "Kingklip", price: 285, img: "/images/kingklip.jpg", blurb: "Lemon butter, shaved fennel, blistered tomatoes. Line-caught when we can." },
  { name: "Peri-peri chicken", price: 195, img: "/images/chicken.jpg", blurb: "Whole bird for two, herb oil, bird’s eye chilli, charred lemon." },
  { name: "Malva pudding", price: 85, img: "/images/malva.jpg", blurb: "Hot custard, vanilla ice cream. The one people come back for." },
];

const MENU = [
  { name: "West Coast mussels", info: "White wine, garlic, grilled sourdough.", price: 145, tag: "Starters" },
  { name: "Snoek pâté", info: "Apricot glaze, rye, pickled red onion.", price: 95, tag: "Starters" },
  { name: "Tomato & burrata", info: "Heirloom tomatoes, basil oil, sea salt.", price: 110, tag: "Starters" },
  { name: "Calamari", info: "Flash-fried, lemon, aioli.", price: 125, tag: "Starters" },
  { name: "Kingklip", info: "Lemon butter, fennel, blistered tomato.", price: 285, tag: "Mains" },
  { name: "Peri-peri chicken", info: "Herb oil, chilli, charred lemon.", price: 195, tag: "Mains" },
  { name: "Dry-aged ribeye", info: "300g, bone marrow butter, watercress.", price: 365, tag: "Mains" },
  { name: "Handmade tagliatelle", info: "West Coast clams, chilli, parsley.", price: 175, tag: "Mains" },
  { name: "Line-fish of the day", info: "Ask — whatever the boats brought.", price: 265, tag: "Mains" },
  { name: "Malva pudding", info: "Custard and ice cream.", price: 85, tag: "Dessert" },
  { name: "Naartjie posset", info: "Shortbread, candied peel.", price: 75, tag: "Dessert" },
  { name: "Cheese board", info: "Fairview, preserves, crackers.", price: 145, tag: "Dessert" },
];

const WINES = [
  { name: "Creation Sauvignon Blanc", where: "Walker Bay", glass: 75, bottle: 320 },
  { name: "Mullineux Kloof Street Rouge", where: "Swartland", glass: 85, bottle: 380 },
  { name: "Stark-Condé Cabernet", where: "Stellenbosch", glass: 95, bottle: 420 },
  { name: "MCC Brut Nature", where: "Elgin", glass: 90, bottle: 410 },
  { name: "Paul Cluver Riesling", where: "Elgin", glass: 70, bottle: 295 },
];

const EVENTS = [
  { day: "Friday", title: "Harbour jazz", note: "A trio from 19:00. No cover. Book if you want a window." },
  { day: "Sunday", title: "Long lunch", note: "Set menu R395. Kids half. Last sitting 14:00." },
  { day: "First Monday", title: "Private room", note: "The bait-shop room for 12. Email for the date." },
];

const REVIEWS = [
  { who: "Lerato, Observatory", text: "The kingklip was the best I’ve had this year. They held the table when the train was late." },
  { who: "James, Kalk Bay", text: "Walked in with the dog. Terrace, rock shandy, no fuss." },
  { who: "Naledi, Joburg", text: "Came down for the weekend. Booked on the site. WhatsApp’d when we were parking." },
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
  return `R${n}`;
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
          <button className="brand bare" type="button" onClick={() => setPage("home")}>
            Harbour Kitchen
          </button>
          <nav className="nav-links">
            <button type="button" onClick={() => setPage("menu")}>Menu</button>
            <button type="button" onClick={() => setPage("wine")}>Wine</button>
            <button type="button" onClick={() => setPage("events")}>Tonight</button>
            <button type="button" onClick={() => setPage("visit")}>Visit</button>
            <button type="button" onClick={() => setPage("reserve")}>Reserve</button>
          </nav>
          <span className="live-pill">
            <i /> {tables} tables · {clock}
          </span>
        </div>
      </header>

      {page === "home" && (
        <>
          <section className="harbour-hero" id="top">
            <div className="wrap">
              <p className="kicker">Kalk Bay · Cape Town · {clock}</p>
              <h1 className="display">Fire, fish, harbour light.</h1>
              <p style={{ maxWidth: "40ch", marginTop: 12 }}>
                Twelve tables over the boats. We cook what the day boats brought in. No tasting menu. No fuss.
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
                <h2 className="display section-title">A small kitchen on the harbour wall.</h2>
                <p className="lede">
                  Harbour Kitchen opened in a converted bait shop. The pass still faces the water. We take fish from Kalk Bay harbour when the weather allows, and we cook it the same night.
                </p>
              </div>
              <p className="lede">
                Walk-ins if we have a spare seat. Otherwise book on this site. Kids are welcome at lunch. Dogs on the terrace. Cash, card, SnapScan.
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
              <img src="/images/harbour-hero.jpg" alt="Dining room at dusk" />
              <img src="/images/kingklip.jpg" alt="Kingklip" />
              <img src="/images/chicken.jpg" alt="Peri-peri chicken" />
              <img src="/images/malva.jpg" alt="Malva pudding" />
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
            placeholder="Search mussels, malva, kingklip…"
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
          <h2 className="display section-title">Mostly Cape. Some Swartland. One MCC.</h2>
          <p className="lede">We pour by the glass so you can stay for one and still drive over Boyes Drive.</p>
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
            Corkage R80. No spirits. Rock shandy, grape juice, and good coffee.
          </p>
        </section>
      )}

      {page === "events" && (
        <section className="wrap page-pad">
          <p className="kicker">Tonight and this week</p>
          <h2 className="display section-title">{tables} tables left. {clock} in Cape Town.</h2>
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
          <h2 className="display section-title">12 Harbour Road, Kalk Bay.</h2>
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
              <p className="lede">Above the bait shop, left of the harbour slipway. Parking on Main Road or the municipal lot. Train to Kalk Bay station — four minutes’ walk.</p>
              <p className="lede">WhatsApp 072 000 0000</p>
              <p className="lede">Private lunch for up to 12 on Mondays.</p>
              <iframe
                title="Kalk Bay map"
                className="map"
                loading="lazy"
                src="https://maps.google.com/maps?q=Kalk%20Bay%20harbour&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
        <span>Harbour Kitchen · Kalk Bay</span>
        <a href="/">Web Work Co</a>
      </footer>
    </div>
  );
}
