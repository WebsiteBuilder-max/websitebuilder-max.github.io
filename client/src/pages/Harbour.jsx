import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const DISHES = [
  { name: "Kingklip", price: 28, tag: "Mains", img: "/images/kingklip.jpg", blurb: "Lemon butter, shaved fennel, blistered tomatoes." },
  { name: "Peri-peri chicken", price: 24, tag: "Mains", img: "/images/chicken.jpg", blurb: "Whole bird, herb oil, bird’s eye chilli, charred lemon." },
  { name: "Malva pudding", price: 9, tag: "Dessert", img: "/images/malva.jpg", blurb: "Hot custard, vanilla ice cream." },
];

const MENU = [
  { name: "West Coast mussels", info: "White wine, garlic, grilled bread.", price: 16, tag: "Starters" },
  { name: "Snoek pâté", info: "Apricot, rye, pickled onion.", price: 12, tag: "Starters" },
  { name: "Kingklip", info: "Lemon butter, fennel, tomato.", price: 28, tag: "Mains" },
  { name: "Peri-peri chicken", info: "Herb oil, chilli, charred lemon.", price: 24, tag: "Mains" },
  { name: "Dry-aged ribeye", info: "Bone marrow butter, watercress.", price: 36, tag: "Mains" },
  { name: "Malva pudding", info: "Custard and ice cream.", price: 9, tag: "Dessert" },
  { name: "Citrus posset", info: "Naartjie, shortbread.", price: 8, tag: "Dessert" },
];

const TABS = ["All", "Starters", "Mains", "Dessert"];

export default function Harbour() {
  const [tab, setTab] = useState("All");
  const [booked, setBooked] = useState(null);
  const [form, setForm] = useState({
    name: "",
    guests: "2",
    when: "",
    note: "",
  });

  const rows = useMemo(
    () => (tab === "All" ? MENU : MENU.filter((item) => item.tag === tab)),
    [tab]
  );

  function submit(e) {
    e.preventDefault();
    const table = 4 + Math.floor(Math.random() * 8);
    setBooked({ ...form, table });
  }

  return (
    <div className="harbour-body">
      <header className="site-nav harbour-nav">
        <div className="wrap">
          <a className="brand" href="#top">Harbour Kitchen</a>
          <nav className="nav-links">
            <a href="#menu">Menu</a>
            <a href="#reserve">Reserve</a>
            <Link to="/">Ryan portfolio</Link>
          </nav>
          <span className="live-pill"><i /> 4 tables left tonight</span>
        </div>
      </header>

      <section className="harbour-hero" id="top">
        <div className="wrap">
          <p className="kicker">Sample restaurant · Kalk Bay</p>
          <h1 className="display">Fire, fish, harbour light.</h1>
          <p style={{ maxWidth: "38ch", marginTop: 12 }}>
            A small room over the boats. We cook what came in that morning.
          </p>
          <a className="btn btn-gold" href="#reserve" style={{ marginTop: 22 }}>
            Book a table
          </a>
        </div>
      </section>

      <section className="wrap">
        <p className="kicker">Tonight</p>
        <h2 className="display section-title">From the pass</h2>
        <div className="dish-grid">
          {DISHES.map((d) => (
            <article className="dish" key={d.name}>
              <img src={d.img} alt={d.name} />
              <div>
                <h3 className="display">{d.name}</h3>
                <p className="muted">{d.blurb}</p>
                <p className="price">${d.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap" id="menu">
        <p className="kicker">Menu</p>
        <h2 className="display section-title">A short list, done properly.</h2>
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
            <strong>${row.price}</strong>
          </div>
        ))}
      </section>

      <section className="wrap" id="reserve">
        {booked ? (
          <div className="confirm">
            <p className="kicker">You’re in</p>
            <h2 className="display">Table {booked.table} is held for {booked.name}.</h2>
            <p className="lede">
              {booked.guests} guests · {booked.when || "tonight"}. This is a demo — no email was sent to a real restaurant.
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
                Open Wednesday–Sunday, 17:00–22:00. 12 Harbour Road, Kalk Bay. The form feels real. It does not email anyone.
              </p>
            </div>
            <form onSubmit={submit}>
              <div>
                <label htmlFor="hname">Name</label>
                <input id="hname" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="guests">Guests</label>
                <select id="guests" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="when">Date and time</label>
                <input id="when" type="datetime-local" required value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} />
              </div>
              <div>
                <label htmlFor="note">Note</label>
                <textarea id="note" placeholder="Window table, birthday, allergies" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
              <button className="btn btn-gold" type="submit">Request table</button>
            </form>
          </div>
        )}
      </section>

      <footer className="wrap">
        <span>Harbour Kitchen · sample</span>
        <Link to="/">Back to Ryan</Link>
      </footer>
    </div>
  );
}
