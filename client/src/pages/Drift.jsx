import { useEffect, useMemo, useState } from "react";
import BackToStudio from "../components/BackToStudio.jsx";
import { setSeo } from "../seo.js";

const PRODUCTS = [
  { id: "cap", name: "Harbour cap", price: 45, img: "/images/cap.jpg", blurb: "Washed navy. Sits right in the wind.", sizes: ["One size"], tag: "Hats", made: "Heavy cotton twill.", stock: 14 },
  { id: "tee", name: "Heavyweight tee", price: 58, img: "/images/tee.jpg", blurb: "Thick cotton. Off-white. Doesn’t go see-through.", sizes: ["S", "M", "L", "XL"], tag: "Wear", made: "220gsm. Pre-washed so it stays this size.", stock: 9 },
  { id: "tote", name: "Canvas tote", price: 32, img: "/images/tote.jpg", blurb: "Sand canvas. Beach, market, laptop.", sizes: ["One size"], tag: "Bags", made: "12oz canvas. Leather grip on the handles.", stock: 22 },
  { id: "jacket", name: "Navy chore jacket", price: 189, img: "/images/jacket.jpg", blurb: "Light layer for evening wind.", sizes: ["S", "M", "L"], tag: "Wear", made: "Unlined. Two chest pockets. Made to be worn open.", stock: 5 },
  { id: "belt", name: "Navy belt", price: 68, img: "/images/belt.jpg", blurb: "Brass buckle. One piece of hide.", sizes: ["85", "90", "95"], tag: "Wear", made: "Full-grain. Cut in the studio.", stock: 8 },
];

const SIZES = [
  ["S", "87–92", "71–76"],
  ["M", "93–98", "77–82"],
  ["L", "99–104", "83–88"],
  ["XL", "105–110", "89–94"],
];

const JOURNAL = [
  { title: "Why the cap has no logo", body: "It kept peeling in the salt. So we left it off. You already know who made it if you bought it here." },
  { title: "Restock when the roll is gone", body: "We don’t pretend we have 400 jackets. When the navy cloth is finished, that run is finished." },
  { title: "Collect from the studio", body: "Skip the courier if you’re nearby. Message when you’re at the door." },
];

const LOOKS = [
  { title: "Night wind", ids: ["jacket", "tee", "cap"], img: "/images/drift-studio.jpg", note: "Jacket open. Tee underneath. Cap last." },
  { title: "Day bag", ids: ["tote", "tee", "belt"], img: "/images/tote.jpg", note: "Tote, heavy tee, belt. That’s the commute." },
  { title: "Studio only", ids: ["jacket", "belt"], img: "/images/jacket.jpg", note: "Two pieces. No logo." },
];

const CITIES = ["London", "New York", "Sydney", "Berlin", "Dubai", "Toronto"];
const TRACK = ["Packed at the studio", "Courier collected", "In the air", "Out for delivery"];
const NAV = [
  ["shop", "Shop"],
  ["lookbook", "Lookbook"],
  ["story", "Story"],
  ["journal", "Journal"],
  ["guide", "Size & shipping"],
];

export default function Drift() {
  useEffect(() => {
    setSeo({
      title: "Drift Supply | Sample shop site by Web Work Co",
      description: "A live sample online store built by Web Work Co. Demo only, not a real business.",
      url: "https://webworkco.com/drift-supply/",
    });
  }, []);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("drift-cart") || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [size, setSize] = useState("M");
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [page, setPage] = useState("shop");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("featured");
  const [wish, setWish] = useState([]);
  const [search, setSearch] = useState("");
  const [code, setCode] = useState("");
  const [toast, setToast] = useState("");
  const [pay, setPay] = useState("Card");
  const [navOpen, setNavOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [feed, setFeed] = useState(["Jacket · 5 left this run", "Ships worldwide tonight"]);
  const [eyes, setEyes] = useState({ cap: 4, tee: 6, tote: 2, jacket: 8, belt: 3 });
  const [track, setTrack] = useState(0);
  const [chest, setChest] = useState(96);
  const [seen, setSeen] = useState([]);

  function go(next) {
    setPage(next);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    localStorage.setItem("drift-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      setFeed((f) => [`${p.name} · ${city}`, ...f].slice(0, 4));
      setEyes((e) => {
        const next = { ...e };
        PRODUCTS.forEach((item) => {
          next[item.id] = Math.max(1, Math.min(12, (next[item.id] || 3) + (Math.random() > 0.5 ? 1 : -1)));
        });
        return next;
      });
    }, 6500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (step !== 3 || track >= TRACK.length - 1) return undefined;
    const id = setInterval(() => setTrack((n) => Math.min(TRACK.length - 1, n + 1)), 4000);
    return () => clearInterval(id);
  }, [step, track]);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const off = code.trim().toUpperCase() === "DRIFT10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - off;
  const shipNeed = Math.max(0, 120 - total);
  const product = useMemo(() => PRODUCTS.find((p) => p.id === active), [active]);

  function left(id) {
    const base = PRODUCTS.find((p) => p.id === id)?.stock || 0;
    const held = cart.filter((i) => i.id === id).reduce((n, i) => n + i.qty, 0);
    return Math.max(0, base - held);
  }

  const shown = useMemo(() => {
    const base = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === filter);
    const q = search.trim().toLowerCase();
    let list = q ? base.filter((p) => p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q)) : [...base];
    if (sort === "price") list.sort((a, b) => a.price - b.price);
    if (sort === "stock") list.sort((a, b) => left(a.id) - left(b.id));
    return list;
  }, [filter, search, sort, cart]);

  const rec = chest < 93 ? "S" : chest < 99 ? "M" : chest < 105 ? "L" : "XL";
  const pieces = PRODUCTS.reduce((n, p) => n + left(p.id), 0);

  function ping(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function openProduct(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    setActive(id);
    setSize(p.sizes[0]);
    setSeen((s) => [id, ...s.filter((x) => x !== id)].slice(0, 4));
  }

  function add(p, chosenSize) {
    if (left(p.id) <= 0) {
      ping(`${p.name} is gone this run`);
      return;
    }
    setCart((c) => {
      const key = `${p.id}-${chosenSize}`;
      const found = c.find((i) => i.key === key);
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { key, id: p.id, name: p.name, price: p.price, size: chosenSize, qty: 1, img: p.img }];
    });
    setOpen(true);
    setActive(null);
    setStep(1);
    setOrder(null);
    ping(`Added ${p.name}`);
  }

  function setQty(key, qty) {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))));
  }

  function toggleWish(id) {
    setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
    ping(wish.includes(id) ? "Removed from saved" : "Saved");
  }

  function placeOrder(e) {
    e.preventDefault();
    setOrder(`DS-${Math.floor(18000 + Math.random() * 4000)}`);
    setCart([]);
    setStep(3);
    setTrack(0);
  }

  return (
    <div className="drift-body">
      <BackToStudio />
      <header className="site-nav drift-nav">
        <div className="wrap">
          <button className="brand bare" type="button" onClick={() => go("shop")}>Drift Supply</button>
          <nav className="nav-links">
            {NAV.map(([id, label]) => (
              <button key={id} type="button" className={page === id ? "on" : ""} onClick={() => go(id)}>{label}</button>
            ))}
          </nav>
          <div className="nav-end">
            <button className="icon-btn" type="button" onClick={() => ping(wish.length ? `Saved: ${wish.length}` : "Nothing saved yet")}>
              Saved {wish.length}
            </button>
            <button className="cart-btn" type="button" onClick={() => setOpen(true)}>Cart {count}</button>
            <button className="menu-btn" type="button" onClick={() => setNavOpen((v) => !v)}>Menu</button>
          </div>
        </div>
        {navOpen ? (
          <div className="mobile-menu wrap">
            {NAV.map(([id, label]) => (
              <button key={id} type="button" onClick={() => go(id)}>{label}</button>
            ))}
            <button type="button" onClick={() => { setOpen(true); setNavOpen(false); }}>Cart ({count})</button>
          </div>
        ) : null}
      </header>
      <div className="harbour-livebar drift-livebar" aria-hidden="true">
        <div className="ticker-track">
          {["Live stock", `${pieces} pieces left`, "Short runs", "Ships worldwide", "Demo code DRIFT10", feed[0], "Live stock", `${pieces} pieces left`].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {page === "shop" && (
        <>
          <section className="wrap drift-hero">
            <div>
              <p className="kicker">Independent label · live {clock}</p>
              <h1 className="display">Four pieces. Short runs.</h1>
              <p className="lede">
                Cap, tee, tote, jacket, belt. Cart, checkout, live stock. Add something — the count drops. Demo code DRIFT10.
              </p>
              <p className="drift-live">{pieces} pieces left this run · {count} in your cart · free ship over $120</p>
              <ul className="feed-list shop-feed">
                {feed.map((line, i) => (
                  <li key={`${line}-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="drift-hero-shot">
              <img src="/images/drift-studio.jpg" alt="Drift Supply campaign still" />
              <span className="shot-live"><i /> In the studio now</span>
            </div>
          </section>

          <section className="wrap" id="shop">
            <div className="shop-tools">
              <input className="search light" placeholder="Search jacket, tote, cap, belt…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                <option value="featured">Featured</option>
                <option value="price">Price</option>
                <option value="stock">Low stock first</option>
              </select>
            </div>
            <div className="tabs">
              {["All", "Wear", "Hats", "Bags"].map((t) => (
                <button key={t} className={filter === t ? "on" : ""} type="button" onClick={() => setFilter(t)}>{t}</button>
              ))}
            </div>
            <div className="grid-4">
              {shown.map((p) => {
                const n = left(p.id);
                return (
                  <article className="product" key={p.id}>
                    <div className="product-shot">
                      <img src={p.img} alt={p.name} />
                      <span className={`stock-pill ${n <= 5 ? "low" : ""}`}>{n === 0 ? "Sold this run" : `${n} left`}</span>
                    </div>
                    <h3>{p.name}</h3>
                    <p className="muted">{p.blurb}</p>
                    <p className="viewers">{eyes[p.id] || 2} looking now</p>
                    <div className="stock-line"><i style={{ width: `${Math.min(100, (n / p.stock) * 100)}%` }} /></div>
                    <div className="product-row">
                      <strong>${p.price}</strong>
                      <button className="icon-btn" type="button" onClick={() => toggleWish(p.id)}>
                        {wish.includes(p.id) ? "Saved" : "Save"}
                      </button>
                      <button className="icon-btn" type="button" onClick={() => openProduct(p.id)}>View</button>
                      <button
                        className="icon-btn"
                        type="button"
                        disabled={n <= 0}
                        onClick={() => add(p, p.sizes[0])}
                      >
                        {n <= 0 ? "Gone" : "Add"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {seen.length ? (
              <div style={{ marginTop: 36 }}>
                <p className="kicker">Just viewed</p>
                <div className="tabs">
                  {seen.map((id) => {
                    const p = PRODUCTS.find((x) => x.id === id);
                    return p ? (
                      <button key={id} type="button" onClick={() => openProduct(id)}>{p.name}</button>
                    ) : null;
                  })}
                </div>
              </div>
            ) : null}
          </section>
        </>
      )}

      {page === "lookbook" && (
        <section className="wrap page-pad">
          <p className="kicker">Lookbook · tap a look</p>
          <h2 className="display section-title">Shop the stills.</h2>
          <p className="lede">Three outfits from the studio. Tap a piece to add it.</p>
          <div className="look-grid">
            {LOOKS.map((look) => (
              <article className="look-card" key={look.title}>
                <img src={look.img} alt={look.title} />
                <div>
                  <p className="kicker">{look.title}</p>
                  <h3 className="display">{look.note}</h3>
                  <div className="tabs">
                    {look.ids.map((id) => {
                      const p = PRODUCTS.find((x) => x.id === id);
                      return p ? (
                        <button key={id} type="button" onClick={() => openProduct(id)}>
                          {p.name} · ${p.price}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === "story" && (
        <section className="wrap page-pad">
          <p className="kicker">Story</p>
          <h2 className="display section-title">Started with a cap that stayed on in the wind.</h2>
          <div className="grid-2">
            <p className="lede">
              Drift is two friends in a small studio. We got tired of thin tees and logos. So we made five pieces, in short runs, and we restock when the roll of cloth is gone.
            </p>
            <p className="lede">
              Ships worldwide from the studio. Collect if you’re nearby. A real shop would SMS a tracking number. Live stock on this page is the demo of that.
            </p>
          </div>
          <div className="gallery" style={{ marginTop: 28 }}>
            <img src="/images/drift-studio.jpg" alt="Studio still" />
            <img src="/images/jacket.jpg" alt="Chore jacket" />
            <img src="/images/belt.jpg" alt="Navy belt" />
            <img src="/images/cap.jpg" alt="Cap" />
          </div>
        </section>
      )}

      {page === "journal" && (
        <section className="wrap page-pad">
          <p className="kicker">Journal</p>
          <h2 className="display section-title">Notes from the studio.</h2>
          <div className="grid-3">
            {JOURNAL.map((j) => (
              <article className="about-card" key={j.title}>
                <h3>{j.title}</h3>
                <p className="muted">{j.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page === "guide" && (
        <section className="wrap page-pad">
          <p className="kicker">Size & shipping</p>
          <h2 className="display section-title">Measured in centimetres. Ships worldwide.</h2>
          <div className="grid-2">
            <article className="about-card">
              <h3>Size guide</h3>
              <div className="menu-row"><span>Size</span><strong>Chest · waist</strong></div>
              {SIZES.map(([s, c, w]) => (
                <div className={`menu-row ${rec === s ? "size-on" : ""}`} key={s}>
                  <span>{s}{rec === s ? " · you" : ""}</span>
                  <strong>{c} · {w}</strong>
                </div>
              ))}
              <label style={{ display: "block", marginTop: 16 }}>
                Your chest (cm)
                <input type="range" min="84" max="112" value={chest} onChange={(e) => setChest(Number(e.target.value))} />
              </label>
              <p className="lede">Around {chest} cm → take {rec}. Between sizes, take the bigger one. The jacket sits open.</p>
            </article>
            <article className="about-card">
              <h3>Shipping</h3>
              <p className="lede">Local metro — $8 or free over $120. Collect from the studio is free.</p>
              <p className="lede">Worldwide tracked — from $18. Returns in 14 days if the tags are on.</p>
              <p className="lede">Card, PayPal, or Apple Pay. Demo checkout does not take money. Try code DRIFT10.</p>
              <p className="drift-live" style={{ marginTop: 16 }}>
                {shipNeed === 0 ? "Free shipping unlocked in the cart." : `$${shipNeed} more for free shipping.`}
              </p>
            </article>
          </div>
        </section>
      )}

      {product ? (
        <div className="modal" onClick={() => setActive(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={product.img} alt={product.name} />
            <div>
              <p className="kicker">{product.tag} · {left(product.id)} left · {eyes[product.id]} looking</p>
              <h2 className="display">{product.name}</h2>
              <p className="lede">{product.blurb}</p>
              <p className="lede">{product.made}</p>
              <p className="price">${product.price}</p>
              <p className="muted">Size</p>
              <div className="sizes">
                {product.sizes.map((s) => (
                  <button key={s} className={size === s ? "on" : ""} type="button" onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
              {left(product.id) <= 0 ? (
                <button className="cart-btn" type="button" onClick={() => ping("Demo notify set. No email was sent.")}>
                  Notify me
                </button>
              ) : (
                <button className="cart-btn" type="button" onClick={() => add(product, size)}>
                  Add {size} · ${product.price}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <button className={`backdrop ${open ? "open" : ""}`} type="button" aria-label="Close cart" onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Cart</h2>
          <button className="icon-btn" type="button" onClick={() => setOpen(false)}>Close</button>
        </div>

        {step === 1 && (
          <>
            <div className="ship-meter" aria-hidden="true">
              <i style={{ width: `${Math.min(100, (total / 120) * 100)}%` }} />
            </div>
            <p className="muted">{shipNeed === 0 ? "Free shipping on this demo cart." : `$${shipNeed} to free shipping.`}</p>
            <div style={{ flex: 1, overflow: "auto", margin: "16px 0" }}>
              {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((i) => (
                <div className="line" key={i.key}>
                  <div>
                    <strong>{i.name}</strong>
                    <div className="muted">{i.size} · ${i.price}</div>
                  </div>
                  <div>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                    <span style={{ margin: "0 8px" }}>{i.qty}</span>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty + 1)} disabled={left(i.id) <= 0}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <label>Code
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="DRIFT10" />
            </label>
            {off ? <p className="muted">DRIFT10 took ${off} off.</p> : null}
            <p>Total ${total}</p>
            <button className="checkout" type="button" onClick={() => cart.length && setStep(2)}>Checkout</button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={placeOrder} style={{ marginTop: 16 }}>
            <p className="muted">Ships worldwide · demo, no charge</p>
            <label>Name<input required /></label>
            <label>Email<input type="email" required /></label>
            <label>City
              <select required defaultValue="London">
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>Address<input required placeholder="Street and city" /></label>
            <label>Pay with
              <select value={pay} onChange={(e) => setPay(e.target.value)}>
                <option>Card</option>
                <option>PayPal</option>
                <option>Apple Pay</option>
              </select>
            </label>
            <button className="checkout" type="submit">Place order · {pay} (demo)</button>
            <button className="icon-btn" type="button" onClick={() => setStep(1)}>Back to cart</button>
          </form>
        )}

        {step === 3 && (
          <div style={{ marginTop: 24 }}>
            <p className="kicker">Packed at the studio</p>
            <h2 className="display">Order {order}</h2>
            <p className="lede">Demo only. No card was charged. Watch the run update.</p>
            <ol className="track-steps">
              {TRACK.map((label, i) => (
                <li key={label} className={i <= track ? "on" : ""}>{label}</li>
              ))}
            </ol>
            <button className="checkout" type="button" onClick={() => { setStep(1); setOpen(false); }}>
              Keep shopping
            </button>
          </div>
        )}
      </aside>

      {toast ? <div className="toast light-toast">{toast}</div> : null}

      <footer className="wrap">
        <span>Drift Supply · {pieces} left · {clock}</span>
        <a href="/">Web Work Co</a>
      </footer>
    </div>
  );
}
