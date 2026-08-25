import { useEffect, useMemo, useState } from "react";
import { setSeo } from "../seo.js";

const PACKAGES = [
  {
    name: "Starter",
    days: "5–7 days",
    blurb: "One strong page. Who you are, what you do, and how to reach you — live on your domain.",
    items: ["One clear page, written and designed", "Looks right on a phone", "Contact, email, or WhatsApp button", "Hours and location if you need them", "Live on your domain", "1 revision round"],
    prices: { ZAR: 2700, USD: 150, EUR: 140, GBP: 120, AED: 550, AUD: 230 },
  },
  {
    name: "Business",
    days: "10–14 days",
    blurb: "A full site for a real shop or firm. Pages, contact, and bookings — so new people can find you and get in touch.",
    items: ["About 5 pages, written and designed", "Contact form and maps", "Hours, services, and about", "Bookings or appointment link", "Looks right on a phone", "2 revision rounds"],
    prices: { ZAR: 5500, USD: 500, EUR: 460, GBP: 390, AED: 1850, AUD: 760 },
  },
  {
    name: "Store",
    days: "2–3 weeks",
    blurb: "An online shop. People pick products, pay, and you get the order.",
    items: ["Up to 20 products", "Cart and checkout", "Card, PayPal, or Stripe", "Shipping notes", "Looks right on a phone", "2 revision rounds"],
    prices: { ZAR: 10900, USD: 600, EUR: 550, GBP: 470, AED: 2200, AUD: 920 },
  },
  {
    name: "Rescue",
    days: "Custom quote",
    blurb: "You already have a website. I fix it, restyle it, or rebuild it. Custom quote after I look — no set price until I’ve seen your URL.",
    items: ["Send me your live URL", "I check mobile, speed, and copy", "Keep bookings and email if they work", "New look, or a full rebuild", "Custom quote after I look"],
    quote: true,
    prices: { ZAR: 0, USD: 0, EUR: 0, GBP: 0, AED: 0, AUD: 0 },
  },
];

const CURRENCIES = [
  { id: "USD", name: "US dollar", prefix: "$" },
  { id: "EUR", name: "Euro", prefix: "€" },
  { id: "GBP", name: "British pound", prefix: "£" },
  { id: "AED", name: "UAE dirham", prefix: "AED " },
  { id: "AUD", name: "Australian dollar", prefix: "A$" },
  { id: "ZAR", name: "South African rand", prefix: "R" },
];

const FAQS = [
  {
    q: "What is Web Work Co?",
    a: "Web Work Co is me — Ryan Mostert. I build websites for businesses, one job at a time. The name is three words: Web Work Co. The website is webworkco.com. We are not webwork.co.za or other companies with a similar name. If you searched “Web Work Co” for a website studio, this is us. You write to a person, not a ticket queue.",
  },
  {
    q: "How do we work together?",
    a: "Email or WhatsApp is enough. You tell me what the site has to do, or you send the URL you already have. I send a short plan. If it feels right, I build a private preview — a link only you can open. We tweak the words, the pages, and the bookings until you’re happy. Then it goes live on your domain. You own the code. Nothing is locked in a monthly builder. If now isn’t the time, you can say no. The first note is a plan, not a contract.",
  },
  {
    q: "What if I don’t like the first version?",
    a: "That’s what the preview is for. The world never sees the first draft unless you say so. We change it together — copy, layout, bookings, colours. Starter includes one revision round. Business and Store include two. If something still feels off, say so. I would rather get it right than rush it live.",
  },
  {
    q: "Can I pay in my own currency?",
    a: "Yes. Use the currency menu at the top of the page. You can look at prices in US dollars, euros, pounds, UAE dirhams, Australian dollars, or rand. Pick the one that matches how you get paid. When you request a plan, I see the package and the currency you chose, so we don’t talk past each other.",
  },
  {
    q: "Do you have a portfolio?",
    a: "Yes. Two full sample sites you can click through like a customer: Harbour Kitchen (a restaurant with live tables and bookings) and Drift Supply (a shop with cart, checkout, and stock). They are demos — not my studio name, and not fake reviews of Web Work Co. They show the kind of work I build. Open them from the home page.",
  },
  {
    q: "I already have a domain. Can you use it?",
    a: "Yes. You keep it. I never buy a client’s domain in my name. You stay the owner. I connect it so yourname.com opens the new site. If you don’t have a domain yet, say so on the form and I’ll help you pick one. .com is usually the cleanest, but we can talk it through.",
  },
  {
    q: "Where do you work?",
    a: "Anywhere. I’m remote. We work over email or WhatsApp, across time zones. Hours here are daily 06:00–22:00. You get a private preview link on your phone, we tweak it, then we launch. You don’t need to sit in an office with me. A lot of the people I write to are running a shop floor, a clinic, or a tax practice — the site has to fit around that.",
  },
  {
    q: "Do I own the website?",
    a: "Yes. Your GitHub. Your Cloudflare. The code is yours. There is no locked monthly builder you have to keep paying just to change a sentence. If you ever want another developer to take over, you can. That’s the point.",
  },
  {
    q: "Can you build an online store?",
    a: "Yes. Products, cart, checkout, and payment — Stripe, PayPal, or card. That’s the Store package. You can click around Drift Supply to see how a shop can feel: stock, sizes, a cart, and a checkout. If you already sell on Shopify and just want the front of the shop to look better, say so. We don’t have to rip out a checkout that already works.",
  },
  {
    q: "I already have a website. Can you fix it?",
    a: "Yes. That’s Rescue. Pick Rescue on the form, paste your live URL, and tell me what’s wrong — slow, old, hard on a phone, bookings that don’t work, or it just doesn’t look like your business. I look at the real site, then I send a custom quote. There is no set price until I’ve seen it. If your bookings, email, or phone already work, we keep them. I don’t throw out what’s useful.",
  },
  {
    q: "How long does it take?",
    a: "Starter is usually 5–7 days. Business is about 10–14 days. A Store is 2–3 weeks. Rescue depends on what I find when I open your URL. Those times start once we agree the plan and I have your words, photos, or logo — or access to look at the current site. I’ll tell you if something will take longer before we start.",
  },
  {
    q: "How do I start?",
    a: "Use Request a plan on this site, or email ryan@webworkco.com, or WhatsApp. Tell me your name, where you are, and what the site has to do. If you already have a site, paste the link. I’ll reply from ryan@webworkco.com. No pressure if you only want a short note first.",
  },
];

const PLAN_INBOXES = [
  "https://formsubmit.co/ajax/ryan@webworkco.com",
  "https://formsubmit.co/ajax/Ryan.mostert58@gmail.com",
];

const JUMP = [
  ["#work", "Work"],
  ["#portfolio", "Portfolio"],
  ["#prices", "Prices"],
  ["#rescue", "Rescue"],
  ["#how", "How we work"],
  ["#start", "Start"],
];

const TIPS = [
  { file: "shop.jsx", lines: ["const open = true;", "if (phone) showWhatsApp();", "cart updates live."] },
  { file: "bookings.js", lines: ["hold table 15 min;", "seat map from the floor;", "preview before live."] },
  { file: "rescue.md", lines: ["keep the bookings;", "fix the phone page;", "quote after I look."] },
];

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
    company: "",
  });
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);
  const [clock, setClock] = useState("");
  const [onJump, setOnJump] = useState("#work");
  const [flash, setFlash] = useState(false);
  const [tip, setTip] = useState(0);

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
    const tipId = setInterval(() => setTip((n) => (n + 1) % TIPS.length), 4200);
    return () => {
      clearInterval(id);
      clearInterval(tipId);
    };
  }, []);

  useEffect(() => {
    const ids = JUMP.map(([href]) => href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setOnJump(`#${vis.target.id}`);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.12, 0.4] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem("ryan-currency", currency);
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 420);
    return () => clearTimeout(t);
  }, [currency, picked]);

  const chosen = useMemo(
    () => PACKAGES.find((p) => p.name === form.pack) || PACKAGES[1],
    [form.pack]
  );

  const startPrice = formatPrice(PACKAGES[0].prices[currency], currency);
  const shownPrice = chosen.quote ? "Custom quote" : formatPrice(chosen.prices[currency], currency);

  function update(e) {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (e.target.name === "pack") setPicked(e.target.value);
  }

  function pickPack(name) {
    setPicked(name);
    setForm((f) => ({ ...f, pack: name }));
  }

  async function postPlan(url, payload) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("bad response");
    }
    const ok = data.ok === true || data.success === true || data.success === "true" || /activat/i.test(String(data.message || ""));
    if (!res.ok && !ok) throw new Error(data.message || "send failed");
    if (!ok) throw new Error(data.message || "send failed");
    return data;
  }

  async function submit(e) {
    e.preventDefault();
    if (form.company) {
      setSent(`Sent. I’ll reply to ${form.email}.`);
      return;
    }
    setSending(true);
    setSent("Sending…");
    const price = chosen.quote ? "Custom quote" : formatPrice(chosen.prices[currency], currency);
    const payload = {
      name: form.name,
      email: form.email,
      _replyto: form.email,
      _subject: `Web Work Co plan: ${form.pack} — ${form.name}`,
      _template: "table",
      _captcha: "false",
      city: form.city,
      package: form.pack,
      currency,
      price,
      domain: form.domain,
      currentSite: form.siteUrl || "(none)",
      goal: form.goal || "(none)",
      message: form.goal || "(none)",
    };
    try {
      const results = await Promise.allSettled(PLAN_INBOXES.map((url) => postPlan(url, payload)));
      if (!results.some((r) => r.status === "fulfilled")) throw new Error("send failed");
      setSent(`Sent. I’ll reply to ${form.email}.`);
      setForm((f) => ({ ...f, name: "", email: "", goal: "", siteUrl: "" }));
    } catch {
      setSent("Could not send. Email me at ryan@webworkco.com or WhatsApp 078 621 8429");
    } finally {
      setSending(false);
    }
  }

  function goPack(name, href) {
    pickPack(name);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const liveName = form.name.trim() || "your shop";
  const liveCity = form.city.trim() || "your city";
  const activeTip = TIPS[tip];

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
        <img src="/images/city-night.jpg" alt="" />
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
            {JUMP.map(([href, label]) => (
              <a key={href} href={href} className={onJump === href ? "on" : ""}>{label}</a>
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
            <span className="nav-clock" aria-hidden="true">{clock}</span>
            <button className="menu-btn" type="button" onClick={() => setMenu((v) => !v)}>Menu</button>
          </div>
        </div>
        {menu ? (
          <div className="mobile-menu wrap">
            {JUMP.map(([href, label]) => (
              <a key={href} href={href} className={onJump === href ? "on" : ""} onClick={() => setMenu(false)}>{label}</a>
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
              <div className={`live-win ${flash ? "flash" : ""}`} aria-live="polite">
                <div className="device-bar">
                  <i /><i /><i />
                  <span>live · {activeTip.file}</span>
                  <b className="clock">{clock}</b>
                </div>
                <pre>
                  <code><em>package</em> {picked}</code>
                  <code className="price-line"><em>price</em> {shownPrice} {currency}</code>
                  {activeTip.lines.map((line) => (
                    <code key={line}>{line}</code>
                  ))}
                  <code className="ok">preview ready</code>
                </pre>
              </div>
              <div className="stat-row">
                <div><b>3–14 days</b><span>brief to live site</span></div>
                <div><b>{startPrice}</b><span>starter, your currency</span></div>
                <div><b>You own it</b><span>GitHub + Cloudflare. No locked builder.</span></div>
              </div>
            </div>
            <aside className="hero-stage" aria-label="Live sample previews">
              <a className="device-card device-main" href="/harbour-kitchen/">
                <div className="device-bar"><i /><i /><i /><span>live · harbour-kitchen</span><b className="clock">{clock}</b></div>
                <div className="device-screen">
                  <img src="/images/harbour-night.jpg" alt="" />
                  <iframe title="Harbour Kitchen live" src="/harbour-kitchen/" loading="lazy" tabIndex={-1} />
                </div>
              </a>
              <a className="device-card device-alt" href="/drift-supply/">
                <div className="device-bar"><i /><i /><i /><span>live · drift-supply</span><b className="clock">{clock}</b></div>
                <div className="device-screen">
                  <img src="/images/drift-studio.jpg" alt="" />
                  <iframe title="Drift Supply live" src="/drift-supply/" loading="lazy" tabIndex={-1} />
                </div>
              </a>
              <div className="now-playing"><i /> Live pages — click either window</div>
            </aside>
          </div>
        </section>

        <div className="studio-rest">
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {["Business sites", "Online stores", "Restaurants", "Landing pages", "Site rescue", "Mobile first", "Your domain", "You own the code", "Business sites", "Online stores", "Restaurants", "Landing pages", "Site rescue", "Mobile first", "Your domain", "You own the code"].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        <nav className="jump-bar" aria-label="On this page">
          <div className="wrap jump-row">
            {JUMP.map(([href, label]) => (
              <a key={href} href={href} className={onJump === href ? "on" : ""}>{label}</a>
            ))}
          </div>
        </nav>

        <section className="wrap" id="work">
          <div className="section-head">
            <p className="kicker">What I build</p>
            <h2 className="section-title display">From one page to a shop that takes money.</h2>
          </div>
          <div className="offer-grid">
            <button type="button" className={`card offer-card ${picked === "Starter" ? "on" : ""}`} onClick={() => goPack("Starter", "#prices")}>
              <p className="kicker">Leads</p>
              <h3 className="display">Business sites</h3>
              <p className="muted">Who you are, what you do, how to reach you. Phone first.</p>
              <ul>
                <li>Home, about, services, contact</li>
                <li>Maps, hours, chat or email</li>
                <li>Works on any phone</li>
              </ul>
              <em>Pick Starter →</em>
            </button>
            <button type="button" className={`card offer-card ${picked === "Business" ? "on" : ""}`} onClick={() => goPack("Business", "#portfolio")}>
              <p className="kicker">Bookings</p>
              <h3 className="display">Restaurants & bookings</h3>
              <p className="muted">Menus, table requests, diaries. See Harbour Kitchen.</p>
              <ul>
                <li>Menu and galleries</li>
                <li>Reserve forms</li>
                <li>Hours and location</li>
              </ul>
              <em>See Harbour Kitchen →</em>
            </button>
            <button type="button" className={`card offer-card ${picked === "Store" ? "on" : ""}`} onClick={() => goPack("Store", "#portfolio")}>
              <p className="kicker">Ecommerce</p>
              <h3 className="display">Online stores</h3>
              <p className="muted">Products, cart, checkout. Stripe, PayPal, or card. See Drift Supply.</p>
              <ul>
                <li>Product pages and sizes</li>
                <li>Cart and checkout</li>
                <li>Shipping notes</li>
              </ul>
              <em>See Drift Supply →</em>
            </button>
          </div>
          <div className="tip-row">
            {TIPS.map((item, i) => (
              <button
                type="button"
                className={`live-win tip-win ${tip === i ? "flash" : ""}`}
                key={item.file}
                onClick={() => setTip(i)}
              >
                <div className="device-bar">
                  <i /><i /><i />
                  <span>{item.file}</span>
                </div>
                <pre>
                  {item.lines.map((line) => (
                    <code key={line}>{line}</code>
                  ))}
                </pre>
              </button>
            ))}
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
                <img src="/images/harbour-night.jpg" alt="Harbour Kitchen restaurant site" />
                <span className="shot-tag">Live demo</span>
              </div>
              <div>
                <span>Restaurant</span>
                <strong>Harbour Kitchen</strong>
                <p>Live tables, seat map, cellar, private room, booking hold. A full site — not a screenshot.</p>
                <em>Open the real pages →</em>
              </div>
            </a>
            <a className="portfolio-card" href="/drift-supply/">
              <div className="shot">
                <img src="/images/drift-studio.jpg" alt="Drift Supply shop site" />
                <span className="shot-tag">Live demo</span>
              </div>
              <div>
                <span>Shop</span>
                <strong>Drift Supply</strong>
                <p>Live stock, lookbook, cart, checkout, tracking. Click around like a customer.</p>
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
                <p className={`price ${flash && picked === p.name ? "flash" : ""}`}>{p.quote ? "Custom quote" : formatPrice(p.prices[currency], currency)}</p>
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
            <p className="lede">Slow, not mobile, old, or it doesn’t take bookings — send the URL. Custom quote after I look. I keep what already works.</p>
            <a className="btn btn-gold" href="#start" onClick={() => pickPack("Rescue")}>Get a custom quote</a>
          </div>
        </section>

        <section className="wrap" id="how">
          <div className="section-head">
            <p className="kicker">How we work</p>
            <h2 className="section-title display">We’ll go at your pace. You’ll see it first.</h2>
            <p className="lede">Email or WhatsApp is enough. No jargon. No surprise lock-in. You never have to go live on a site you haven’t opened on your phone.</p>
          </div>
          <div className="domain-line">
            {[
              ["01", "You tell me the job", "What the site has to do, your photos and logo — or the URL you already have. I send a short plan. You decide."],
              ["02", "You get a private preview", "A link only you can open. We tweak the words, the pages, the bookings. Revision rounds are in the package."],
              ["03", "It goes live on your name", "yourname.com opens the new site. You own the code. GitHub + Cloudflare. No monthly builder you can’t leave."],
            ].map(([n, t, d]) => (
              <article className="about-card" key={n}>
                <span className="num">{n}</span>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </article>
            ))}
          </div>
          <div className="together">
            {[
              ["You see it before anyone else", "Nothing goes public until you’ve clicked the preview and said it feels right."],
              ["We keep what already works", "Bookings, email, phone, appointments — if they’re good, they stay. I don’t rip out what’s useful."],
              ["You can say no", "The first note is a plan, not a contract. If it isn’t the time, that’s fine."],
              ["You can always reach me", "Ryan Mostert. ryan@webworkco.com or WhatsApp. Same person who builds the site."],
            ].map(([t, d]) => (
              <article className="about-card" key={t}>
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap" id="faq">
          <div className="section-head">
            <p className="kicker">Questions</p>
            <h2 className="section-title display">Things people usually ask.</h2>
            <p className="lede">Tap a question. If yours isn’t here, email or WhatsApp — I’ll answer as me, not a script.</p>
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
              <div className={`live-win recap ${flash ? "flash" : ""}`} aria-live="polite">
                <div className="device-bar">
                  <i /><i /><i />
                  <span>plan · live</span>
                  <b className="clock">{clock}</b>
                </div>
                <pre>
                  <code><em>for</em> {liveName}</code>
                  <code><em>in</em> {liveCity}</code>
                  <code><em>package</em> {chosen.name}</code>
                  <code className="price-line"><em>price</em> {shownPrice}</code>
                  <code>{form.domain}</code>
                  {form.goal.trim() ? <code className="ok">{form.goal.trim()}</code> : <code className="ok">tell me what the site has to do</code>}
                </pre>
              </div>
              <p className="price">{shownPrice}</p>
              <p className="muted">{chosen.name}{form.city ? ` · ${form.city}` : ""}</p>
            </div>
            <form onSubmit={submit}>
              <label className="hp" aria-hidden="true">Company<input name="company" value={form.company} onChange={update} tabIndex={-1} autoComplete="off" /></label>
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
        </div>
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
