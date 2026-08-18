import { useEffect, useMemo, useState } from "react";

const PACKAGES = [
  {
    name: "Starter",
    days: "5–7 days",
    blurb: "One clear page. Enough to look real and get the first message.",
    items: ["Home, about, services, contact", "Looks right on a phone", "WhatsApp button", "Live on your domain", "1 revision round"],
    prices: { ZAR: 4500, USD: 250, EUR: 230, GBP: 195, AUD: 380 },
  },
  {
    name: "Business",
    days: "10–14 days",
    blurb: "A full site built to get bookings, calls, and walk-ins.",
    items: ["5 pages, written and designed", "Contact form and maps", "Search basics", "Domain connect", "2 revision rounds"],
    prices: { ZAR: 11500, USD: 650, EUR: 600, GBP: 510, AUD: 990 },
  },
  {
    name: "Store",
    days: "2–3 weeks",
    blurb: "Sell products. Cart, checkout, and payment setup help.",
    items: ["Up to 20 products", "Cart and checkout", "Payment setup help", "Domain and launch", "2 revision rounds"],
    prices: { ZAR: 14500, USD: 800, EUR: 740, GBP: 630, AUD: 1220 },
  },
];

const CURRENCIES = [
  { id: "ZAR", name: "South African rand", prefix: "R" },
  { id: "USD", name: "US dollar", prefix: "$" },
  { id: "EUR", name: "Euro", prefix: "€" },
  { id: "GBP", name: "British pound", prefix: "£" },
  { id: "AUD", name: "Australian dollar", prefix: "A$" },
];

const FAQS = [
  { q: "Can I pay in my own currency?", a: "Yes. Use the currency menu at the top. South African clients usually pick rand. Overseas clients can pick US dollar, euro, pound, or Australian dollar." },
  { q: "Do you have a portfolio?", a: "Yes. Open the Portfolio section for two full sample sites: a restaurant (Harbour Kitchen) and a clothing shop (Drift Supply). They are demos, not my studio brand." },
  { q: "I already have a domain. Can you use it?", a: "Yes. You keep the domain. I connect it so your address opens the new site." },
  { q: "Do you work anywhere in South Africa?", a: "Yes. I am in Cape Town. I build for Cape Town, Johannesburg, Durban, Pretoria, and smaller towns. We can work on WhatsApp and email." },
  { q: "Do I own the website?", a: "Yes. Your GitHub. Your Cloudflare. No locked monthly builder." },
];

const INBOX_HOOK = "";

const TICKER = [
  "Cape Town",
  "South Africa",
  "Portfolio online",
  "WhatsApp first",
  "Restaurants",
  "Shops",
  "Trades",
  "Pay in your currency",
];

function capeTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Johannesburg",
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
  const [time, setTime] = useState(capeTime);
  const [openFaq, setOpenFaq] = useState(0);
  const [picked, setPicked] = useState("Business");
  const [currency, setCurrency] = useState("ZAR");
  const [spot, setSpot] = useState({ x: 50, y: 20 });
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    pack: "Business",
    city: "Cape Town",
    domain: "I already have a domain",
    goal: "",
  });
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(capeTime()), 1000);
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
    const price = formatPrice(chosen.prices[currency], currency);
    const payload = {
      name: form.name,
      email: form.email,
      city: form.city,
      package: form.pack,
      currency,
      price,
      domain: form.domain,
      goal: form.goal || "(none)",
    };
    try {
      if (INBOX_HOOK) {
        const res = await fetch(INBOX_HOOK, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("send failed");
      } else {
        const res = await fetch("https://formsubmit.co/ajax/ryan.mostert2006@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...payload,
            _subject: `New website plan: ${form.pack} · ${form.name}`,
            _template: "table",
            _captcha: "false",
          }),
        });
        if (!res.ok) throw new Error("send failed");
      }
      setSent(`Sent. I’ll reply to ${form.email}.`);
      setForm((f) => ({ ...f, name: "", email: "", goal: "" }));
    } catch {
      setSent("Could not send. Email me directly at ryan.mostert2006@gmail.com");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="studio"
      onMouseMove={(e) => {
        setSpot({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }}
    >
      <div
        className="spot"
        style={{ background: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, rgba(212,179,122,0.16), transparent 45%)` }}
      />
      <div className="grain" />

      <header className="studio-nav">
        <div className="wrap nav-bar">
          <a className="brand" href="#top">
            <img src="/logo.jpg" alt="" />
            Ryan
          </a>
          <nav className="nav-links">
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Packages</a>
            <a href="#domain">Domain</a>
            <a href="#contact">Start</a>
          </nav>
          <div className="nav-end">
            <label className="currency-label">
              <span>Currency</span>
              <select
                className="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Choose currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} · {c.name}
                  </option>
                ))}
              </select>
            </label>
            <span className="live-pill">
              <i /> Cape Town <span className="clock">{time}</span>
            </span>
            <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>
              Menu
            </button>
          </div>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            <a href="#portfolio" onClick={() => setMenu(false)}>Portfolio</a>
            <a href="#services" onClick={() => setMenu(false)}>Packages</a>
            <a href="#contact" onClick={() => setMenu(false)}>Start</a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-full">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker">Cape Town studio · South Africa</p>
              <h1 className="display hero-title">
                <span>Websites</span>
                <span className="line">that get you</span>
                <span>customers.</span>
              </h1>
              <p className="lede">
                I design and launch modern sites for restaurants, shops, trades, and coaches. See my portfolio, pick a package, and pay in the currency that suits you.
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
              <p className="kicker">This is the studio</p>
              <h2 className="display">Ryan · Cape Town</h2>
              <ul>
                <li>
                  <strong>Portfolio ready</strong>
                  Two full sample sites you can click through.
                </li>
                <li>
                  <strong>Pay how you want</strong>
                  Rand, dollar, euro, pound, or Australian dollar.
                </li>
                <li>
                  <strong>Your domain</strong>
                  I connect it. You keep it.
                </li>
                <li>
                  <strong>You own the code</strong>
                  GitHub + Cloudflare. No locked builder.
                </li>
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

        <section className="wrap" id="portfolio">
          <div className="section-head">
            <p className="kicker">Portfolio</p>
            <h2 className="section-title display">Live sample sites. Click in and look around.</h2>
            <p className="lede">
              These are demo businesses I built to show the work. They are not my studio name. Each one is a full site with real pages inside.
            </p>
          </div>
          <div className="portfolio-grid">
            <a className="portfolio-card" href="/harbour-kitchen/">
              <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen restaurant site" />
              <div>
                <span>Restaurant</span>
                <strong>Harbour Kitchen</strong>
                <p>Menu, wine list, hours, gallery, and table booking.</p>
                <em>Open site →</em>
              </div>
            </a>
            <a className="portfolio-card" href="/drift-supply/">
              <img src="/images/drift-hero.jpg" alt="Drift Supply shop site" />
              <div>
                <span>Shop</span>
                <strong>Drift Supply</strong>
                <p>Products, cart, size guide, shipping, and checkout.</p>
                <em>Open site →</em>
              </div>
            </a>
          </div>
        </section>

        <section className="wrap" id="services">
          <div className="section-head">
            <p className="kicker">Packages</p>
            <h2 className="section-title display">Clear prices. Choose your currency.</h2>
            <p className="lede">Showing prices in {CURRENCIES.find((c) => c.id === currency)?.name}. Change it any time in the top bar.</p>
          </div>
          <div className="grid-3 pack-grid">
            {PACKAGES.map((p) => (
              <button
                type="button"
                className={`card pack ${picked === p.name ? "on" : ""}`}
                key={p.name}
                onClick={() => pickPack(p.name)}
              >
                <h3 className="display">{p.name}</h3>
                <p className="muted pack-blurb">{p.blurb}</p>
                <p className="price">{formatPrice(p.prices[currency], currency)}</p>
                <p className="muted">{p.days} · {currency}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        <section className="wrap" id="domain">
          <div className="section-head">
            <p className="kicker">Your domain</p>
            <h2 className="section-title display">You buy the name. I make it open the site.</h2>
          </div>
          <div className="domain-line">
            {[
              ["01", "Already have a domain?", "Send me the name. I point it at the new site."],
              ["02", "Need one?", "I tell you where to register it. You stay the owner."],
              ["03", "We launch", "yourname.com or yourname.co.za is the website."],
            ].map(([n, t, d]) => (
              <article className="about-card" key={n}>
                <span className="num">{n}</span>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap">
          <div className="section-head">
            <p className="kicker">About</p>
            <h2 className="section-title display">Built in Cape Town. Made for businesses that need the phone to ring.</h2>
          </div>
          <div className="grid-2 about-copy">
            <p className="lede">
              I am Ryan. I build fast, modern sites for local and overseas clients. We talk on WhatsApp or email. You get a preview link. Then we launch on your domain.
            </p>
            <p className="lede">
              After launch I do not vanish. If a button breaks, I fix it.
            </p>
          </div>
        </section>

        <section className="wrap">
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
              <p className="lede">This goes to my inbox. I reply from ryan.mostert2006@gmail.com.</p>
              <p className="price">{formatPrice(chosen.prices[currency], currency)}</p>
              <p className="muted">{chosen.name} · {currency} · {form.city}</p>
            </div>
            <form onSubmit={submit}>
              <label>Name<input name="name" value={form.name} onChange={update} required /></label>
              <label>Email or WhatsApp<input name="email" value={form.email} onChange={update} required /></label>
              <label>City
                <select name="city" value={form.city} onChange={update}>
                  {["Cape Town", "Johannesburg", "Durban", "Pretoria", "Stellenbosch", "Other SA", "Outside South Africa"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
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
              <label>What should the site do?
                <textarea name="goal" value={form.goal} onChange={update} placeholder="Bookings, sales, WhatsApp enquiries…" />
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
        <span>Ryan · Cape Town, South Africa</span>
        <span>Prices in {currency} · SAST {time}</span>
      </footer>
    </div>
  );
}
