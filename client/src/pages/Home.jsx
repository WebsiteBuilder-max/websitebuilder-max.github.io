import { useEffect, useMemo, useState } from "react";

const PACKAGES = [
  {
    name: "Starter",
    zar: 4500,
    usd: 250,
    days: "5–7 days",
    blurb: "One sharp page. Enough to look real and get the first WhatsApp.",
    items: ["Hero, about, services, contact", "Works on a phone", "WhatsApp button", "Live on your .co.za", "1 revision round"],
  },
  {
    name: "Business",
    zar: 11500,
    usd: 650,
    days: "10–14 days",
    blurb: "A full site built to get bookings, calls, and walk-ins.",
    items: ["5 pages, written and designed", "Contact form + maps", "Google and SEO basics", "Domain connect", "2 revision rounds"],
  },
  {
    name: "Store",
    zar: 14500,
    usd: 800,
    days: "2–3 weeks",
    blurb: "Sell products. Cart, checkout, PayFast or SnapScan help.",
    items: ["Up to 20 products", "Cart + checkout", "Payment setup help", "Domain + launch", "2 revision rounds"],
  },
];

const FAQS = [
  { q: "I already have a .co.za or .com. Can you use it?", a: "Yes. You keep the domain. I connect it so yourname.co.za opens the new site." },
  { q: "Do you work anywhere in South Africa?", a: "Yes. I’m in Cape Town. I build for businesses in CPT, Joburg, Durban, Pretoria, and smaller towns. We work on WhatsApp and email." },
  { q: "Rand or dollars?", a: "South African clients pay in rand. Overseas clients (Upwork) can pay in USD. Same work." },
  { q: "Do I own the website?", a: "Yes. Your GitHub, your Cloudflare. No locked monthly builder." },
  { q: "What are Harbour Kitchen and Drift Supply?", a: "Separate sample sites only. They are not part of this studio brand. They show what a restaurant site and a shop site can feel like." },
];

const TICKER = [
  "Cape Town",
  "South Africa",
  "WhatsApp first",
  ".co.za domains",
  "Restaurants",
  "Shops",
  "Trades",
  "Joburg to Durban",
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

function money(zar) {
  return `R${zar.toLocaleString("en-ZA")}`;
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
    city: "Cape Town",
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
      `Sharp, ${form.name || "there"}. ${chosen.name} at ${money(chosen.zar)} · ${form.city}. WhatsApp or email me that same note and I’ll send a plan.`
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
            <a href="#services">Packages</a>
            <a href="#domain">Domain</a>
            <a href="#samples">Samples</a>
            <a href="#contact">Start</a>
          </nav>
          <span className="live-pill">
            <i /> Cape Town <span className="clock">{time}</span>
          </span>
          <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>
            Menu
          </button>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            <a href="#services" onClick={() => setMenu(false)}>Packages</a>
            <a href="#samples" onClick={() => setMenu(false)}>Samples</a>
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
                Websites for
                <span className="line">SA businesses</span>
                that need customers.
              </h1>
              <p className="lede">
                I design and launch modern sites for restaurants, shops, trades, and coaches — from Cape Town to Joburg and everywhere in between. You bring the domain. I put it live.
              </p>
              <div className="actions">
                <a className="btn btn-gold" href="#contact">Get a plan</a>
                <a className="btn btn-ghost" href="#services">See packages</a>
              </div>
              <div className="stat-row">
                <div><b>3–14</b><span>days to launch</span></div>
                <div><b>R4,500</b><span>starting price</span></div>
                <div><b>SAST</b><span>Cape Town time</span></div>
              </div>
            </div>
            <aside className="sa-panel">
              <p className="kicker">This is the studio</p>
              <h2 className="display">Ryan · Cape Town</h2>
              <ul>
                <li><strong>WhatsApp first</strong> Same-day replies, local hours.</li>
                <li><strong>Your .co.za</strong> I connect the domain. You keep it.</li>
                <li><strong>Pay in rand</strong> SA clients invoice in ZAR. Overseas in USD.</li>
                <li><strong>You own the code</strong> GitHub + Cloudflare. No locked builder.</li>
              </ul>
              <div className="now-playing"><i /> Open for new SA work</div>
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

        <section className="wrap" id="services">
          <div className="section-head wide">
            <p className="kicker">Packages</p>
            <h2 className="section-title display">Clear prices in rand.</h2>
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
                <p className="price">{money(p.zar)}</p>
                <p className="muted">{p.days} · or ${p.usd} USD</p>
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
          <div className="section-head wide">
            <p className="kicker">Your domain</p>
            <h2 className="section-title display">You buy the name. I make it open the site.</h2>
          </div>
          <div className="domain-line">
            {[
              ["01", "Already have a domain?", "Send me the name. I point it at the new site."],
              ["02", "Need a .co.za?", "Register it on Afrihost, xneelo, or Cloudflare. About R100–R200 a year. You stay the owner."],
              ["03", "We launch", "yourname.co.za is the website. Not a random link."],
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
          <div className="section-head wide">
            <p className="kicker">About</p>
            <h2 className="section-title display">Built in Cape Town. For South African businesses that need the phone to ring.</h2>
          </div>
          <div className="grid-2">
            <p className="lede">
              I’m Ryan. I build fast, modern sites for local businesses — not 40-page agency decks. We can talk on WhatsApp. You see a preview link. Then we launch on your domain.
            </p>
            <p className="lede">
              After launch I don’t vanish. If a button breaks, I fix it.
            </p>
          </div>
        </section>

        <section className="wrap samples-only" id="samples">
          <div className="section-head wide">
            <p className="kicker">Separate sample sites</p>
            <h2 className="section-title display">Two demo businesses. Not part of this studio.</h2>
            <p className="lede">
              These are make-believe shops I built so you can click around a restaurant site and a clothing shop. They have their own look. They are not my brand.
            </p>
          </div>
          <div className="sample-links">
            <a className="sample-link" href="/harbour-kitchen/">
              <span>Restaurant demo</span>
              <strong>Harbour Kitchen</strong>
              <em>Open the full site →</em>
            </a>
            <a className="sample-link" href="/drift-supply/">
              <span>Shop demo</span>
              <strong>Drift Supply</strong>
              <em>Open the full site →</em>
            </a>
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
              <p className="lede">WhatsApp or email is fine. This box is just the brief.</p>
              <p className="price">{money(chosen.zar)}</p>
              <p className="muted">{chosen.name} · {form.city} · {form.domain}</p>
            </div>
            <form onSubmit={submit}>
              <label>Name<input name="name" value={form.name} onChange={update} required /></label>
              <label>Email or WhatsApp<input name="email" value={form.email} onChange={update} required /></label>
              <label>City
                <select name="city" value={form.city} onChange={update}>
                  {["Cape Town", "Johannesburg", "Durban", "Pretoria", "Stellenbosch", "Other SA"].map((c) => (
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
              <label>Domain
                <select name="domain" value={form.domain} onChange={update}>
                  <option>I already have a domain</option>
                  <option>I need a .co.za</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>What should the site do?
                <textarea name="goal" value={form.goal} onChange={update} placeholder="Bookings, sales, WhatsApp enquiries…" />
              </label>
              <button className="btn btn-gold" type="submit">Request a plan</button>
              <p className="success">{sent}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <span>Ryan · Cape Town, South Africa</span>
        <span>SAST {time}</span>
      </footer>
    </div>
  );
}
