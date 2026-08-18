import { useEffect, useMemo, useState } from "react";

const PACKAGES = [
  {
    name: "Starter",
    days: "5–7 days",
    blurb: "One clear page. Enough to look real and get the first message.",
    items: ["Home, about, services, contact", "Looks right on a phone", "Contact or chat button", "Live on your domain", "1 revision round"],
    prices: { ZAR: 4500, USD: 250, EUR: 230, GBP: 195, AUD: 380 },
  },
  {
    name: "Business",
    days: "10–14 days",
    blurb: "A full site built to get bookings, calls, and enquiries.",
    items: ["5 pages, written and designed", "Contact form and maps", "Search basics", "Domain connect", "2 revision rounds"],
    prices: { ZAR: 11500, USD: 650, EUR: 600, GBP: 510, AUD: 990 },
  },
  {
    name: "Store",
    days: "2–3 weeks",
    blurb: "Ecommerce: products, cart, checkout, and payment.",
    items: ["Up to 20 products", "Cart and checkout", "Stripe, PayPal, or card", "Shipping notes", "2 revision rounds"],
    prices: { ZAR: 14500, USD: 800, EUR: 740, GBP: 630, AUD: 1220 },
  },
  {
    name: "Rescue",
    days: "Special quote",
    blurb: "You already have a website. I fix it, restyle it, or rebuild what loses you customers.",
    items: ["I look at your live URL", "Mobile, speed, and copy", "New look or a rebuild", "Quote after I see the site"],
    quote: true,
    prices: { ZAR: 0, USD: 0, EUR: 0, GBP: 0, AUD: 0 },
  },
];

const CURRENCIES = [
  { id: "USD", name: "US dollar", prefix: "$" },
  { id: "EUR", name: "Euro", prefix: "€" },
  { id: "GBP", name: "British pound", prefix: "£" },
  { id: "AUD", name: "Australian dollar", prefix: "A$" },
  { id: "ZAR", name: "South African rand", prefix: "R" },
];

const FAQS = [
  { q: "Can I pay in my own currency?", a: "Yes. Use the currency menu. Dollar, euro, pound, Australian dollar, or rand." },
  { q: "Do you have a portfolio?", a: "Yes. Two full sample sites: Harbour Kitchen (restaurant) and Drift Supply (shop). Demos, not my studio name." },
  { q: "I already have a domain. Can you use it?", a: "Yes. You keep it. I connect it so yourname.com opens the new site." },
  { q: "Where do you work?", a: "Anywhere. We work over email or chat. You get a preview link, then we launch." },
  { q: "Do I own the website?", a: "Yes. Your GitHub. Your Cloudflare. No locked monthly builder." },
  { q: "Can you build an online store?", a: "Yes. Products, cart, checkout, Stripe, PayPal, or card. See Drift Supply." },
  { q: "I already have a website. Can you fix it?", a: "Yes. Pick Rescue, paste your URL, say what’s wrong. I quote after I look." },
];

const INBOX_HOOK = "https://script.google.com/macros/s/AKfycbyeuCdZI5KA0yYs0YpFubGjnQgKuxTNYGbog3HuniTP2Ulj_BT0MW6zxyl7s-IUAoDm/exec";

const TICKER = ["New sites", "Online stores", "Rescue rebuilds", "Your domain", "Worldwide", "Portfolio live", "Pay in your currency"];

function clockNow() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function formatPrice(amount, currency) {
  const item = CURRENCIES.find((c) => c.id === currency) || CURRENCIES[0];
  const n = amount.toLocaleString(currency === "ZAR" ? "en-ZA" : "en-US");
  return `${item.prefix}${n}`;
}

export default function Home() {
  const [time, setTime] = useState(clockNow);
  const [openFaq, setOpenFaq] = useState(0);
  const [picked, setPicked] = useState("Business");
  const [currency, setCurrency] = useState("USD");
  const [spot, setSpot] = useState({ x: 50, y: 20 });
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    pack: "Business",
    city: "",
    domain: "I already have a domain",
    siteUrl: "",
    goal: "",
  });
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(clockNow()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("ryan-currency");
    if (saved && CURRENCIES.some((c) => c.id === saved)) setCurrency(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ryan-currency", currency);
  }, [currency]);

  const chosen = useMemo(
    () => PACKAGES.find((p) => p.name === form.pack) || PACKAGES[1],
    [form.pack]
  );

  const startPrice = formatPrice(PACKAGES[0].prices[currency], currency);
  const shownPrice = chosen.quote ? "Special quote" : formatPrice(chosen.prices[currency], currency);

  function update(e) {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (e.target.name === "pack") setPicked(e.target.value);
  }

  function pickPack(name) {
    setPicked(name);
    setForm((f) => ({ ...f, pack: name }));
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setSent("Sending…");
    const price = chosen.quote ? "Special quote" : formatPrice(chosen.prices[currency], currency);
    const payload = {
      name: form.name,
      email: form.email,
      city: form.city,
      package: form.pack,
      currency,
      price,
      domain: form.domain,
      currentSite: form.siteUrl || "(none)",
      goal: form.goal || "(none)",
    };
    try {
      if (INBOX_HOOK) {
        try {
          const res = await fetch(INBOX_HOOK, { method: "POST", body: JSON.stringify(payload) });
          if (!res.ok) throw new Error("send failed");
        } catch {
          await fetch(INBOX_HOOK, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
        }
      }
      setSent(`Sent. I’ll reply to ${form.email}.`);
      setForm((f) => ({ ...f, name: "", email: "", goal: "", siteUrl: "" }));
    } catch {
      setSent("Could not send. Email me at ryan.mostert2006@gmail.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="studio tight"
      onMouseMove={(e) => {
        setSpot({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }}
    >
      <div className="live-bg pop" aria-hidden="true">
        <img src="/images/cape-dusk.jpg" alt="" />
      </div>
      <div
        className="spot"
        style={{ background: `radial-gradient(700px circle at ${spot.x}% ${spot.y}%, rgba(224,190,122,0.22), transparent 42%)` }}
      />
      <div className="grain" />

      <header className="studio-nav">
        <div className="wrap nav-bar">
          <a className="brand" href="#top">
            <img src="/logo.jpg" alt="" />
            Web Work Co
          </a>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Prices</a>
            <a href="#rescue">Rescue</a>
            <a href="#contact">Start</a>
          </nav>
          <div className="nav-end">
            <label className="currency-label">
              <span>Currency</span>
              <select className="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label="Choose currency">
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
            </label>
            <span className="live-pill"><i /> Online <span className="clock">{time}</span></span>
            <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>Menu</button>
          </div>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            <a href="#work" onClick={() => setMenu(false)}>Work</a>
            <a href="#portfolio" onClick={() => setMenu(false)}>Portfolio</a>
            <a href="#contact" onClick={() => setMenu(false)}>Start</a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-full">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker">Web Work Co · websites worldwide</p>
              <h1 className="display hero-title">
                <span>Websites</span>
                <span className="line">that get you</span>
                <span>customers.</span>
              </h1>
              <p className="lede">
                New sites. Online stores. Or I take the site you already have and make it work — faster, clearer, ready to take the next client.
              </p>
              <div className="actions">
                <a className="btn btn-gold" href="#portfolio">See portfolio</a>
                <a className="btn btn-ghost" href="#contact">Get a plan</a>
              </div>
              <div className="stat-row">
                <div><b>3–14</b><span>days to launch</span></div>
                <div><b>{startPrice}</b><span>starting price</span></div>
                <div><b>5</b><span>currencies</span></div>
              </div>
            </div>
            <aside className="sa-panel">
              <p className="kicker">The studio</p>
              <h2 className="display">Web Work Co</h2>
              <ul>
                <li><strong>Portfolio ready</strong>Two full sample sites you can click through.</li>
                <li><strong>Pay how you want</strong>USD, euro, pound, AUD, or rand.</li>
                <li><strong>Your domain</strong>I connect it. You keep it.</li>
                <li><strong>You own the code</strong>GitHub + Cloudflare. No locked builder.</li>
              </ul>
              <div className="now-playing"><i /> Open for new work</div>
            </aside>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        <section className="wrap" id="work">
          <div className="section-head">
            <p className="kicker">What I build</p>
            <h2 className="section-title display">From one page to a shop that takes money.</h2>
          </div>
          <div className="offer-grid">
            <article className="card offer-card">
              <p className="kicker">Leads</p>
              <h3 className="display">Business sites</h3>
              <p className="muted">Who you are, what you do, how to reach you. Built for a phone first.</p>
              <ul>
                <li>Home, about, services, contact</li>
                <li>Maps, hours, chat or email</li>
                <li>Works on any phone</li>
              </ul>
            </article>
            <article className="card offer-card">
              <p className="kicker">Bookings</p>
              <h3 className="display">Restaurants & bookings</h3>
              <p className="muted">Menus, table requests, salon or coach diaries. See Harbour Kitchen.</p>
              <ul>
                <li>Menu and galleries</li>
                <li>Reserve forms</li>
                <li>Hours and location</li>
              </ul>
            </article>
            <article className="card offer-card">
              <p className="kicker">Ecommerce</p>
              <h3 className="display">Online stores</h3>
              <p className="muted">Products, cart, checkout, shipping. Stripe, PayPal, or card. See Drift Supply.</p>
              <ul>
                <li>Product pages and sizes</li>
                <li>Cart and checkout</li>
                <li>Shipping notes</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="wrap" id="portfolio">
          <div className="section-head">
            <p className="kicker">Portfolio</p>
            <h2 className="section-title display">Live samples. Click in.</h2>
            <p className="lede">Demo businesses — not my studio name. Full sites with real pages inside.</p>
          </div>
          <div className="portfolio-grid">
            <a className="portfolio-card" href="/harbour-kitchen/">
              <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen restaurant site" />
              <div>
                <span>Restaurant</span>
                <strong>Harbour Kitchen</strong>
                <p>Menu, wine, hours, gallery, booking.</p>
                <em>Open site →</em>
              </div>
            </a>
            <a className="portfolio-card" href="/drift-supply/">
              <img src="/images/drift-hero.jpg" alt="Drift Supply shop site" />
              <div>
                <span>Shop</span>
                <strong>Drift Supply</strong>
                <p>Products, cart, sizes, checkout.</p>
                <em>Open site →</em>
              </div>
            </a>
          </div>
        </section>

        <section className="wrap" id="services">
          <div className="section-head">
            <p className="kicker">Packages</p>
            <h2 className="section-title display">Clear prices. Your currency.</h2>
          </div>
          <div className="grid-4 pack-grid">
            {PACKAGES.map((p) => (
              <button type="button" className={`card pack ${picked === p.name ? "on" : ""}`} key={p.name} onClick={() => pickPack(p.name)}>
                <h3 className="display">{p.name}</h3>
                <p className="muted pack-blurb">{p.blurb}</p>
                <p className="price">{p.quote ? "Quote" : formatPrice(p.prices[currency], currency)}</p>
                <p className="muted">{p.days}{p.quote ? "" : ` · ${currency}`}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        <section className="wrap" id="rescue">
          <div className="rescue-band">
            <p className="kicker">Already have a site?</p>
            <h2 className="section-title display">I can fix it. Or make it better.</h2>
            <p className="lede">Slow, not mobile, old, or it doesn’t take payments — send the URL. Special quote after I look.</p>
            <a className="btn btn-gold" href="#contact" onClick={() => pickPack("Rescue")}>Get a rescue quote</a>
          </div>
        </section>

        <section className="wrap compact" id="how">
          <div className="domain-line">
            {[
              ["01", "You send the brief", "Goal, photos, logo — or your current URL."],
              ["02", "I build a preview", "You click a private link and we tweak it."],
              ["03", "Your domain goes live", "yourname.com opens the new site. You own the code."],
            ].map(([n, t, d]) => (
              <article className="about-card" key={n}>
                <span className="num">{n}</span>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap compact">
          <div className="section-head">
            <p className="kicker">Questions</p>
            <h2 className="section-title display">Straight answers.</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <article className="faq" key={item.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{item.q}</span>
                  <span>{openFaq === i ? "–" : "+"}</span>
                </button>
                {openFaq === i ? <p>{item.a}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="wrap" id="contact">
          <div className="quote">
            <div>
              <p className="kicker">Start</p>
              <h2 className="section-title display">Tell me what the site has to do.</h2>
              <p className="lede">Goes to Web Work Co. I reply from ryan.mostert2006@gmail.com.</p>
              <p className="price">{shownPrice}</p>
              <p className="muted">{chosen.name}{form.city ? ` · ${form.city}` : ""}</p>
            </div>
            <form onSubmit={submit}>
              <label>Name<input name="name" value={form.name} onChange={update} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
              <label>City / country<input name="city" value={form.city} onChange={update} placeholder="London, NYC, Sydney…" /></label>
              <label>Package
                <select name="pack" value={form.pack} onChange={update}>
                  {PACKAGES.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label>Currency
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.id} · {c.name}</option>
                  ))}
                </select>
              </label>
              <label>Domain
                <select name="domain" value={form.domain} onChange={update}>
                  <option>I already have a domain</option>
                  <option>I need a domain</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              {form.pack === "Rescue" ? (
                <label>Your current website
                  <input name="siteUrl" value={form.siteUrl} onChange={update} placeholder="https://yoursite.com" />
                </label>
              ) : null}
              <label>What should the site do?
                <textarea name="goal" value={form.goal} onChange={update} placeholder="Bookings, sales, or fix my current site…" />
              </label>
              <button className="btn btn-gold" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Request a plan"}
              </button>
              <p className="success">{sent}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <span>Web Work Co</span>
        <span>Prices in {currency}</span>
      </footer>
    </div>
  );
}
