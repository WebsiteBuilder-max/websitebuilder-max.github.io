import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PACKAGES = [
  {
    name: "Starter",
    price: 250,
    days: "5–7 days",
    blurb: "One sharp page. Enough to look real and get the first message.",
    items: ["Hero, about, services, contact", "Looks right on a phone", "WhatsApp or email button", "Live on your domain", "1 revision round"],
  },
  {
    name: "Business",
    price: 650,
    days: "10–14 days",
    blurb: "A full site built to get bookings, calls, and enquiries.",
    items: ["5 pages, written and designed", "Contact form + maps", "SEO basics", "Domain connect", "2 revision rounds"],
  },
  {
    name: "Store",
    price: 800,
    days: "2–3 weeks",
    blurb: "Sell products. Cart, checkout, and product pages that work on a phone.",
    items: ["Up to 20 products", "Cart + checkout", "Payment setup help", "Domain + launch", "2 revision rounds"],
  },
];

const FAQS = [
  { q: "I already bought a domain. Can you use it?", a: "Yes. You keep the domain. I connect it on Cloudflare so yourname.com opens the new site." },
  { q: "How long does a site take?", a: "Starter about a week. Business 10–14 days. Store 2–3 weeks once I have photos, prices, and a logo." },
  { q: "Do I own the website?", a: "Yes. Code in your GitHub. Site on your Cloudflare. No locked monthly builder." },
  { q: "Are the two sample sites real businesses?", a: "No. Harbour Kitchen and Drift Supply are samples I built so you can click around. Real client work replaces them." },
  { q: "What do you need from me?", a: "A logo if you have one, 6–12 photos, a few sentences about the business, and the domain name." },
];

const TICKER = ["React + Vite", "Cape Town studio", "Your domain", "Cloudflare launch", "Restaurants", "Shops", "Coaches", "Same-day replies"];

function capeTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Home() {
  const [time, setTime] = useState(capeTime);
  const [openFaq, setOpenFaq] = useState(0);
  const [picked, setPicked] = useState("Business");
  const [spot, setSpot] = useState({ x: 50, y: 20 });
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    pack: "Business",
    domain: "I already have a domain",
    goal: "",
  });
  const [sent, setSent] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTime(capeTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const chosen = useMemo(
    () => PACKAGES.find((p) => p.name === form.pack) || PACKAGES[1],
    [form.pack]
  );

  function update(e) {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (e.target.name === "pack") setPicked(e.target.value);
  }

  function pickPack(name) {
    setPicked(name);
    setForm((f) => ({ ...f, pack: name }));
  }

  function submit(e) {
    e.preventDefault();
    setSent(
      `Got it, ${form.name || "there"}. ${chosen.name} at $${chosen.price}. ${form.domain}. On Upwork, send me that same note and I’ll reply with a plan.`
    );
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
        <div className="wrap">
          <a className="brand" href="#top">
            <img src="/logo.jpg" alt="" />
            Ryan
          </a>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#services">Packages</a>
            <a href="#domain">Domain</a>
            <a href="#contact">Start</a>
          </nav>
          <span className="live-pill">
            <i /> Live · CPT <span className="clock">{time}</span>
          </span>
          <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>
            Menu
          </button>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            <a href="#work" onClick={() => setMenu(false)}>Work</a>
            <a href="#services" onClick={() => setMenu(false)}>Packages</a>
            <a href="#contact" onClick={() => setMenu(false)}>Start</a>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="hero-full">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="kicker fade-up">Cape Town · React · Vite · Cloudflare</p>
              <h1 className="display hero-title">
                Sites that feel
                <span className="line">alive.</span>
                Built to get you paid.
              </h1>
              <p className="lede fade-up delay">
                I design and ship modern business websites and shops. You bring the domain — or I help you buy one. Then yourname.com is the site.
              </p>
              <div className="actions">
                <a className="btn btn-gold" href="#contact">Get a plan</a>
                <a className="btn btn-ghost" href="#work">Open the live samples</a>
              </div>
              <div className="stat-row">
                <div><b>3–14</b><span>days to launch</span></div>
                <div><b>$250</b><span>starting price</span></div>
                <div><b>USD</b><span>you pay in dollars</span></div>
              </div>
            </div>
            <div className="hero-stage">
              <Link className="float-card one" to="/harbour-kitchen/">
                <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen" />
                <em>01 · Restaurant</em>
              </Link>
              <Link className="float-card two" to="/drift-supply/">
                <img src="/images/drift-hero.jpg" alt="Drift Supply" />
                <em>02 · Shop</em>
              </Link>
              <div className="float-card three">
                <img src="/images/kingklip.jpg" alt="" />
              </div>
              <div className="now-playing">
                <i /> Building in React + Vite
              </div>
            </div>
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
            <p className="kicker">Selected work</p>
            <h2 className="section-title display">Click in. These are real working sites — not pictures of sites.</h2>
          </div>
          <div className="work-stack">
            <Link className="work-wide" to="/harbour-kitchen/">
              <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen" />
              <div className="work-meta">
                <span>01</span>
                <div>
                  <p className="kicker">Restaurant · live sample</p>
                  <h3 className="display">Harbour Kitchen</h3>
                  <p>Menu tabs, dish photos, a table-booking flow that hands you a table number.</p>
                </div>
                <b>Open →</b>
              </div>
            </Link>
            <Link className="work-wide light" to="/drift-supply/">
              <img src="/images/drift-hero.jpg" alt="Drift Supply" />
              <div className="work-meta">
                <span>02</span>
                <div>
                  <p className="kicker">Shop · live sample</p>
                  <h3 className="display">Drift Supply</h3>
                  <p>Sizes, product view, cart, three-step checkout, order number.</p>
                </div>
                <b>Open →</b>
              </div>
            </Link>
          </div>
        </section>

        <section className="wrap bento-wrap">
          <div className="bento">
            <article className="bento-big">
              <p className="kicker">How it feels</p>
              <h3 className="display">Not a template. A small studio site that moves.</h3>
              <p className="lede">Hover the cards. Book a table. Add a jacket to the cart. This is the same React + Vite stack I use for client work.</p>
            </article>
            <article>
              <p className="kicker">Stack</p>
              <h3>React · Vite · GitHub · Cloudflare</h3>
              <p className="muted">Fast to load. Easy to hand over. You own it.</p>
            </article>
            <article>
              <p className="kicker">Hours</p>
              <h3 className="clock">{time}</h3>
              <p className="muted">Cape Town time. Live with UK / EU. US mornings.</p>
            </article>
          </div>
        </section>

        <section className="wrap" id="services">
          <div className="section-head">
            <p className="kicker">Packages</p>
            <h2 className="section-title display">Pick a size. Price stays put.</h2>
          </div>
          <div className="grid-3">
            {PACKAGES.map((p) => (
              <button
                type="button"
                className={`card pack ${picked === p.name ? "on" : ""}`}
                key={p.name}
                onClick={() => pickPack(p.name)}
              >
                <h3 className="display">{p.name}</h3>
                <p className="muted">{p.blurb}</p>
                <p className="price">${p.price}</p>
                <p className="muted">{p.days}</p>
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
            <h2 className="section-title display">You buy the name. I make the internet open it.</h2>
          </div>
          <div className="domain-line">
            {[
              ["01", "You already have a domain", "Send me studiolee.com. I point it at the new site."],
              ["02", "You don’t have one", "Buy it for about $10–15 a year. I tell you the clicks. You stay the owner."],
              ["03", "We launch", "yourname.com is the website. Not a random link."],
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
            <h2 className="section-title display">Ryan. Cape Town. Sites for people who need customers, not a 40-page deck.</h2>
          </div>
          <div className="grid-2">
            <p className="lede">
              I build for restaurants, shops, coaches, and trades. React and Vite so it feels current. Cloudflare so it stays fast. You get progress you can click, not radio silence.
            </p>
            <p className="lede">
              After launch I don’t vanish. If a button breaks, I fix it.
            </p>
          </div>
        </section>

        <section className="wrap">
          <p className="kicker">Questions</p>
          <h2 className="section-title display">Straight answers.</h2>
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <article className="faq" key={item.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {item.q}
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
              <p className="lede">This form is a demo of the brief. On Upwork, paste the same thing and I’ll write back with a plan.</p>
              <p className="price">${chosen.price}</p>
              <p className="muted">{chosen.name} · {form.domain}</p>
            </div>
            <form onSubmit={submit}>
              <label>Name<input name="name" value={form.name} onChange={update} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
              <label>Package
                <select name="pack" value={form.pack} onChange={update}>
                  {PACKAGES.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label>Domain
                <select name="domain" value={form.domain} onChange={update}>
                  <option>I already have a domain</option>
                  <option>I need help buying one</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>What should the site do?
                <textarea name="goal" value={form.goal} onChange={update} placeholder="Bookings, sales, enquiries…" />
              </label>
              <button className="btn btn-gold" type="submit">Request a plan</button>
              <p className="success">{sent}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <span>Ryan · Cape Town</span>
        <span>React + Vite · GitHub · Cloudflare</span>
      </footer>
    </div>
  );
}
