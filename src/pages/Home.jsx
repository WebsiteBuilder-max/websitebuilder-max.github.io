import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PACKAGES = [
  {
    name: "Starter",
    price: 350,
    blurb: "One sharp page. Perfect for a new business that needs to look real this week.",
    items: ["Hero, about, services, contact", "Mobile layout", "WhatsApp or email button", "Live on your domain", "1 revision round"],
  },
  {
    name: "Business",
    price: 750,
    blurb: "A 5-page site built to get enquiries, bookings, or calls.",
    items: ["Home, about, services, work, contact", "Contact form", "SEO basics + Google Maps", "Domain connect on Cloudflare", "2 revision rounds"],
  },
  {
    name: "Store",
    price: 1400,
    blurb: "Sell products. Cart, checkout, and phone-friendly product pages.",
    items: ["Up to 20 products", "Cart + checkout flow", "Payment setup help", "Domain + launch", "2 revision rounds"],
  },
];

const FAQS = [
  {
    q: "I already bought a domain. Can you use it?",
    a: "Yes. You keep the domain. I connect it to the new site on Cloudflare. If you do not have one yet, I tell you where to buy it (Namecheap, Cloudflare, or Google Domains) and we point it together.",
  },
  {
    q: "How long does a site take?",
    a: "Starter: about a week. Business: 10–14 days. Store: 2–3 weeks once I have your photos, prices, and logo.",
  },
  {
    q: "Do I own the website?",
    a: "Yes. The code lives in your GitHub. The site runs on your Cloudflare. I do not lock you into a monthly builder you cannot leave.",
  },
  {
    q: "Are Harbour Kitchen and Drift Supply real businesses?",
    a: "No. They are sample projects I designed and built so you can click around. Real client work replaces them as jobs come in.",
  },
  {
    q: "What do you need from me to start?",
    a: "A logo if you have one, 6–12 photos, the words for the site (I can help write them), and the domain login or the domain name.",
  },
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

export default function Home() {
  const [time, setTime] = useState(capeTime);
  const [openFaq, setOpenFaq] = useState(0);
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
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    setSent(
      `Got it, ${form.name || "there"}. ${chosen.name} at $${chosen.price} — ${form.domain.toLowerCase()}. I’ll reply with a 3-point plan. This form is a demo on the live site; on Upwork just message me.`
    );
  }

  return (
    <>
      <header className="studio-nav">
        <div className="wrap">
          <a className="brand" href="#top">
            <img src="/logo.jpg" alt="" />
            Ryan
          </a>
          <nav className="nav-links">
            <a href="#work">Work</a>
            <a href="#services">Packages</a>
            <a href="#domain">Your domain</a>
            <a href="#contact">Start</a>
          </nav>
          <span className="live-pill">
            <i /> Cape Town <span className="clock">{time}</span>
          </span>
        </div>
      </header>

      <main id="top">
        <section className="wrap hero">
          <div>
            <p className="kicker">Cape Town studio · USD clients</p>
            <h1 className="display">A website you can send to a customer today.</h1>
            <p className="lede">
              I design, build, and launch modern business sites and small shops.
              You bring the name — and the domain if you have one. I put it live.
            </p>
            <div className="actions">
              <a className="btn btn-gold" href="#contact">
                Get a plan
              </a>
              <a className="btn btn-ghost" href="#work">
                See live samples
              </a>
            </div>
          </div>
          <aside className="hero-panel">
            <p className="kicker">What you walk away with</p>
            <ul>
              <li>
                <strong>A live site</strong>
                Not a ZIP file. Hosted, fast, on your phone.
              </li>
              <li>
                <strong>Your domain connected</strong>
                yourname.com opens the new site.
              </li>
              <li>
                <strong>Code you own</strong>
                GitHub + Cloudflare. No locked builder.
              </li>
              <li>
                <strong>Same-day replies</strong>
                SAST — live with UK/EU, US mornings.
              </li>
            </ul>
          </aside>
        </section>

        <section className="wrap" id="work">
          <p className="kicker">Selected work</p>
          <h2 className="section-title display">Click in. These are working sites.</h2>
          <p className="lede" style={{ marginBottom: 24 }}>
            Sample projects — not real client businesses. Built to show a restaurant that takes bookings and a shop that takes a cart to checkout.
          </p>
          <div className="grid-2">
            <Link className="work-card" to="/harbour-kitchen">
              <img src="/images/harbour-hero.jpg" alt="Harbour Kitchen dining room" />
              <div>
                <p className="kicker">Restaurant · sample</p>
                <h3 className="display">Harbour Kitchen</h3>
                <p>Menu, gallery, and a live table booking flow for a Kalk Bay bistro.</p>
              </div>
            </Link>
            <Link className="work-card" to="/drift-supply">
              <img src="/images/drift-hero.jpg" alt="Drift Supply clothing" />
              <div>
                <p className="kicker">Shop · sample</p>
                <h3 className="display">Drift Supply</h3>
                <p>Sizes, product view, cart, and a 3-step checkout for a clothing label.</p>
              </div>
            </Link>
          </div>
        </section>

        <section className="wrap" id="services">
          <p className="kicker">Packages</p>
          <h2 className="section-title display">Clear prices. You pick the size.</h2>
          <p className="lede" style={{ marginBottom: 24 }}>
            Fixed quote before I start. Hosting on Cloudflare is included in the launch.
          </p>
          <div className="grid-3">
            {PACKAGES.map((p) => (
              <article className="card" key={p.name}>
                <h3 className="display">{p.name}</h3>
                <p className="muted">{p.blurb}</p>
                <p className="price">${p.price}</p>
                <ul>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap" id="domain">
          <p className="kicker">Bring your domain</p>
          <h2 className="section-title display">You buy the name. I make it open the site.</h2>
          <div className="grid-2">
            <article className="about-card">
              <h3>Already have a domain?</h3>
              <p className="lede">
                Send me the name (for example studiolee.com). I connect it on Cloudflare. When we launch, that address is the website — not a random link.
              </p>
            </article>
            <article className="about-card">
              <h3>Don’t have one yet?</h3>
              <p className="lede">
                Buy it at Cloudflare, Namecheap, or Google. It usually costs $10–15 a year. I tell you the exact clicks. You stay the owner.
              </p>
            </article>
          </div>
          <div className="grid-3" style={{ marginTop: 16 }}>
            {[
              ["1", "Brief", "Goal, photos, logo, words."],
              ["2", "Build", "You get a private preview link."],
              ["3", "Domain + launch", "yourname.com goes live."],
            ].map(([n, t, d]) => (
              <div className="step" key={n}>
                <div className="num">{n}</div>
                <div>
                  <h3>{t}</h3>
                  <p className="muted">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap">
          <p className="kicker">About</p>
          <h2 className="section-title display">Built in Cape Town. Made for overseas clients.</h2>
          <div className="grid-2">
            <p className="lede">
              I’m Ryan. I build fast, modern sites for small businesses — restaurants, shops, coaches, trades. The stack is React, Vite, GitHub, and Cloudflare: the same setup agencies use, without the agency wait or the agency invoice.
            </p>
            <p className="lede">
              I write clean code, I show you progress, and I do not disappear after launch. If a button breaks, I fix it.
            </p>
          </div>
        </section>

        <section className="wrap">
          <p className="kicker">Questions</p>
          <h2 className="section-title display">Straight answers.</h2>
          <div style={{ marginTop: 20 }}>
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
              <p className="kicker">Start a project</p>
              <h2 className="section-title display">Tell me what you need.</h2>
              <p className="lede">
                Pick a package. Say if you already have a domain. I’ll send a short plan. On Upwork, message me — this box shows how the brief feels.
              </p>
              <p className="price">${chosen.price}</p>
              <p className="muted">{chosen.name} · {form.domain}</p>
            </div>
            <form onSubmit={submit}>
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={update} required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={update} required />
              </div>
              <div>
                <label htmlFor="pack">Package</label>
                <select id="pack" name="pack" value={form.pack} onChange={update}>
                  {PACKAGES.map((p) => (
                    <option key={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="domain">Domain</label>
                <select id="domain" name="domain" value={form.domain} onChange={update}>
                  <option>I already have a domain</option>
                  <option>I need help buying one</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal">What should the site do?</label>
                <textarea id="goal" name="goal" value={form.goal} onChange={update} placeholder="Bookings, sales, enquiries…" />
              </div>
              <button className="btn btn-gold" type="submit">
                Request a plan
              </button>
              <p className="success">{sent}</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <span>Ryan · Cape Town</span>
        <span>Websites and stores · GitHub + Cloudflare</span>
      </footer>
    </>
  );
}
