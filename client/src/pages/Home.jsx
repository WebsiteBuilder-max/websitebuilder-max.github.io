import { useEffect, useMemo, useState } from "react";
import { setSeo } from "../seo.js";

const PACKAGES = [
  {
    name: "Starter",
    days: "5–7 days",
    blurb: "One clear page. Enough to look real and get the first message.",
    items: ["Home, about, services, contact", "Looks right on a phone", "Contact or chat button", "Live on your domain", "1 revision round"],
    prices: { ZAR: 2700, USD: 150, EUR: 140, GBP: 120, AUD: 230 },
  },
  {
    name: "Business",
    days: "10–14 days",
    blurb: "A full site built to get bookings, calls, and enquiries.",
    items: ["5 pages, written and designed", "Contact form and maps", "Search basics", "Domain connect", "2 revision rounds"],
    prices: { ZAR: 8900, USD: 500, EUR: 460, GBP: 390, AUD: 760 },
  },
  {
    name: "Store",
    days: "2–3 weeks",
    blurb: "Ecommerce: products, cart, checkout, and payment.",
    items: ["Up to 20 products", "Cart and checkout", "Stripe, PayPal, or card", "Shipping notes", "2 revision rounds"],
    prices: { ZAR: 10900, USD: 600, EUR: 550, GBP: 470, AUD: 920 },
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
  { q: "What is Web Work Co?", a: "Web Work Co is a remote website studio run by Ryan Mostert. The name is three words: Web Work Co. The website is webworkco.com. We are not webwork.co.za or other companies with a similar name." },
  { q: "Can I pay in my own currency?", a: "Yes. Use the currency menu. Dollar, euro, pound, Australian dollar, or rand." },
  { q: "Do you have a portfolio?", a: "Yes. Two full sample sites: Harbour Kitchen (restaurant) and Drift Supply (shop). Demos, not my studio name." },
  { q: "I already have a domain. Can you use it?", a: "Yes. You keep it. I connect it so yourname.com opens the new site." },
  { q: "Where do you work?", a: "Anywhere. We work over email or chat. You get a preview link, then we launch." },
  { q: "Do I own the website?", a: "Yes. Your GitHub. Your Cloudflare. No locked monthly builder." },
  { q: "Can you build an online store?", a: "Yes. Products, cart, checkout, Stripe, PayPal, or card. See Drift Supply." },
  { q: "I already have a website. Can you fix it?", a: "Yes. Pick Rescue, paste your URL, say what’s wrong. I quote after I look." },
];

const INBOX_HOOK = "https://script.google.com/macros/s/AKfycbyeuCdZI5KA0yYs0YpFubGjnQgKuxTNYGbog3HuniTP2Ulj_BT0MW6zxyl7s-IUAoDm/exec";

function formatPrice(amount, currency) {
  const item = CURRENCIES.find((c) => c.id === currency) || CURRENCIES[0];
  const n = amount.toLocaleString(currency === "ZAR" ? "en-ZA" : "en-US");
  return `${item.prefix}${n}`;
}

export default function Home() {
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
  const [clock, setClock] = useState("");

  useEffect(() => {
    setSeo({
      title: "Web Work Co | Business websites and online stores",
      description: "Web Work Co builds business websites and online stores worldwide. New sites, shops, or a rescue of a site you already have. Starter sites from $150.",
      url: "https://webworkco.com/",
    });
    const saved = localStorage.getItem("ryan-currency");
    if (saved && CURRENCIES.some((c) => c.id === saved)) setCurrency(saved);
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
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
      setSent("Could not send. Email me at ryan@webworkco.com");
    } finally {
      setSending(false);
    }
  }

  const jump = [
    ["#work", "Work"],
    ["#portfolio", "Portfolio"],
    ["#prices", "Prices"],
    ["#rescue", "Rescue"],
    ["#start", "Start"],
  ];

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
      <div className="live-bg pop" aria-hidden="true">
        <img src="/images/cape-dusk.jpg" alt="" />
      </div>
      <div
        className="spot"
        style={{ background: `radial-gradient(700px circle at ${spot.x}% ${spot.y}%, rgba(224,190,122,0.22), transparent 42%)` }}
      />
      <div className="grain" />

      <a className="skip" href="#top">Skip to content</a>
      <header className="studio-nav">
        <div className="wrap nav-bar">
          <a className="brand" href="#top">
            <img src="/logo.png" alt="Web Work Co" />
            Web Work Co
          </a>
          <nav className="nav-links">
            {jump.map(([href, label]) => (
              <a key={href} href={href}>{label}</a>
            ))}
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
            <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>Menu</button>
          </div>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            {jump.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>
            ))}
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-full">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker hero-live"><i /> Live · worldwide</p>
              <h1 className="display hero-title">
                <span>Web Work Co</span>
                <span className="line">Sites that look expensive. Prices that don’t.</span>
              </h1>
              <p className="lede">
                Custom business websites and online stores. Built to look like a real brand on a phone — then launched on your domain. Starter from {startPrice}. Most live in 3 to 14 days.
              </p>
              <div className="actions">
                <a className="btn btn-gold" href="#portfolio">Click the live samples</a>
                <a className="btn btn-ghost" href="#start">Request a plan</a>
              </div>
              <div className="stat-row">
                <div><b>3–14 days</b><span>brief to live site</span></div>
                <div><b>{startPrice}</b><span>starter, your currency</span></div>
                <div><b>You own it</b><span>GitHub + Cloudflare. No locked builder.</span></div>
              </div>
            </div>
            <aside className="hero-stage" aria-label="Live sample previews">
              <a className="device-card device-main" href="/harbour-kitchen/">
                <div className="device-bar"><i /><i /><i /><span>live · harbour-kitchen</span></div>
                <div className="device-screen">
                  <img src="/images/harbour-hero.jpg" alt="" />
                  <iframe title="Harbour Kitchen live" src="/harbour-kitchen/" loading="lazy" tabIndex={-1} />
                </div>
              </a>
              <a className="device-card device-alt" href="/drift-supply/">
                <div className="device-bar"><i /><i /><i /><span>live · drift-supply</span></div>
                <div className="device-screen">
                  <img src="/images/drift-hero.jpg" alt="" />
                  <iframe title="Drift Supply live" src="/drift-supply/" loading="lazy" tabIndex={-1} />
                </div>
              </a>
              <div className="now-playing"><i /> Live pages — click either window</div>
            </aside>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {["Business sites", "Online stores", "Restaurants", "Landing pages", "Site rescue", "Mobile first", "Your domain", "You own the code", "Business sites", "Online stores", "Restaurants", "Landing pages", "Site rescue", "Mobile first", "Your domain", "You own the code"].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        <nav className="jump-bar" aria-label="On this page">
          <div className="wrap jump-row">
            {jump.map(([href, label]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>
        </nav>

        <section className="wrap" id="work">
          <div className="section-head">
            <p className="kicker">What I build</p>
            <h2 className="section-title display">From one page to a shop that takes money.</h2>
          </div>
          <div className="offer-grid">
            <article className="card offer-card">
              <p className="kicker">Leads</p>
              <h3 className="display">Business sites</h3>
              <p className="muted">Who you are, what you do, how to reach you. Phone first.</p>
              <ul>
                <li>Home, about, services, contact</li>
                <li>Maps, hours, chat or email</li>
                <li>Works on any phone</li>
              </ul>
            </article>
            <article className="card offer-card">
              <p className="kicker">Bookings</p>
              <h3 className="display">Restaurants & bookings</h3>
              <p className="muted">Menus, table requests, diaries. See Harbour Kitchen.</p>
              <ul>
                <li>Menu and galleries</li>
                <li>Reserve forms</li>
                <li>Hours and location</li>
              </ul>
            </article>
            <article className="card offer-card">
              <p className="kicker">Ecommerce</p>
              <h3 className="display">Online stores</h3>
              <p className="muted">Products, cart, checkout. Stripe, PayPal, or card. See Drift Supply.</p>
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
              <div className="shot">
                <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen restaurant site" />
                <span className="shot-tag">Live demo</span>
              </div>
              <div>
                <span>Restaurant</span>
                <strong>Harbour Kitchen</strong>
                <p>Menu, wine, hours, gallery, booking. A full site — not a screenshot.</p>
                <em>Open the real pages →</em>
              </div>
            </a>
            <a className="portfolio-card" href="/drift-supply/">
              <div className="shot">
                <img src="/images/drift-hero.jpg" alt="Drift Supply shop site" />
                <span className="shot-tag">Live demo</span>
              </div>
              <div>
                <span>Shop</span>
                <strong>Drift Supply</strong>
                <p>Products, sizes, cart, checkout. Click around like a customer.</p>
                <em>Open the real pages →</em>
              </div>
            </a>
          </div>
        </section>

        <section className="wrap" id="prices">
          <div className="section-head">
            <p className="kicker">Packages</p>
            <h2 className="section-title display">Clear prices. Your currency.</h2>
          </div>
          <div className="grid-4 pack-grid">
            {PACKAGES.map((p) => (
              <button type="button" className={`card pack ${picked === p.name ? "on" : ""}`} key={p.name} onClick={() => pickPack(p.name)}>
                {p.name === "Business" ? <span className="pack-flag">Most booked</span> : null}
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
            <a className="btn btn-gold" href="#start" onClick={() => pickPack("Rescue")}>Get a rescue quote</a>
          </div>
        </section>

        <section className="wrap" id="how">
          <div className="section-head">
            <p className="kicker">How it works</p>
            <h2 className="section-title display">Three steps. Then it’s live.</h2>
          </div>
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

        <section className="wrap" id="faq">
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

        <section className="wrap" id="start">
          <div className="quote">
            <div>
              <p className="kicker">Start</p>
              <h2 className="section-title display">Tell me what the site has to do.</h2>
              <p className="lede">Goes to Web Work Co. I reply from ryan@webworkco.com.</p>
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

      <footer className="wrap site-foot">
        <div>
          <strong>Web Work Co</strong>
          <p>Ryan Mostert · ryan@webworkco.com</p>
          <p>WhatsApp 078 621 8429 · Open daily 06:00–22:00</p>
        </div>
        <nav className="foot-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:ryan@webworkco.com">Email</a>
          <a href="https://wa.me/27786218429">WhatsApp</a>
        </nav>
      </footer>
      <a className="wa-float" href="https://wa.me/27786218429">WhatsApp</a>
    </div>
  );
}
