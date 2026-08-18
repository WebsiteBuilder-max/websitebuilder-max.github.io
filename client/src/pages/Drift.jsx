import { useEffect, useMemo, useState } from "react";
import BackToStudio from "../components/BackToStudio.jsx";

const PRODUCTS = [
  { id: "cap", name: "Harbour cap", price: 450, img: "/images/cap.jpg", blurb: "Washed navy. Sits right in south-easter.", sizes: ["One size"], tag: "Hats", made: "Cut in Woodstock. Cotton twill.", stock: 14 },
  { id: "tee", name: "Heavyweight tee", price: 580, img: "/images/tee.jpg", blurb: "Thick cotton. Off-white. Doesn’t go see-through.", sizes: ["S", "M", "L", "XL"], tag: "Wear", made: "220gsm. Pre-washed so it stays this size.", stock: 9 },
  { id: "tote", name: "Canvas tote", price: 320, img: "/images/tote.jpg", blurb: "Sand canvas. Beach, market, laptop.", sizes: ["One size"], tag: "Bags", made: "12oz canvas. Leather grip on the handles.", stock: 22 },
  { id: "jacket", name: "Navy chore jacket", price: 1890, img: "/images/jacket.jpg", blurb: "Light layer for evening wind off the bay.", sizes: ["S", "M", "L"], tag: "Wear", made: "Unlined. Two chest pockets. Made to be worn open.", stock: 5 },
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
  { title: "Collect on Albert Road", body: "If you’re in Cape Town, skip the courier. WhatsApp when you’re at the door." },
];

export default function Drift() {
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
  const [wish, setWish] = useState([]);
  const [search, setSearch] = useState("");
  const [code, setCode] = useState("");
  const [toast, setToast] = useState("");
  const [pay, setPay] = useState("PayFast");

  useEffect(() => {
    localStorage.setItem("drift-cart", JSON.stringify(cart));
  }, [cart]);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const off = code.trim().toUpperCase() === "DRIFT10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - off;
  const product = useMemo(() => PRODUCTS.find((p) => p.id === active), [active]);
  const shown = useMemo(() => {
    const base = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === filter);
    const q = search.trim().toLowerCase();
    return q ? base.filter((p) => p.name.toLowerCase().includes(q) || p.blurb.toLowerCase().includes(q)) : base;
  }, [filter, search]);

  function ping(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function add(p, chosenSize) {
    setCart((c) => {
      const key = `${p.id}-${chosenSize}`;
      const found = c.find((i) => i.key === key);
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { key, id: p.id, name: p.name, price: p.price, size: chosenSize, qty: 1 }];
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
  }

  function placeOrder(e) {
    e.preventDefault();
    setOrder(`DS-${Math.floor(18000 + Math.random() * 4000)}`);
    setCart([]);
    setStep(3);
  }

  return (
    <div className="drift-body">
      <BackToStudio />
      <header className="site-nav drift-nav">
        <div className="wrap">
          <button className="brand bare" type="button" onClick={() => setPage("shop")}>Drift Supply</button>
          <nav className="nav-links">
            <button type="button" onClick={() => setPage("shop")}>Shop</button>
            <button type="button" onClick={() => setPage("story")}>Story</button>
            <button type="button" onClick={() => setPage("journal")}>Journal</button>
            <button type="button" onClick={() => setPage("guide")}>Size & shipping</button>
          </nav>
          <button className="cart-btn" type="button" onClick={() => setOpen(true)}>
            Cart {count}
          </button>
        </div>
      </header>

      {page === "shop" && (
        <>
          <section className="wrap drift-hero">
            <div>
              <p className="kicker">Woodstock · Cape Town</p>
              <h1 className="display">Quiet clothes for salt air.</h1>
              <p className="lede">
                A small Cape label. Cap, heavy tee, tote, chore jacket. Cart, checkout, wishlist, and a demo code: DRIFT10.
              </p>
            </div>
            <img src="/images/drift-hero.jpg" alt="Drift Supply flat lay" />
          </section>

          <section className="wrap" id="shop">
            <input className="search light" placeholder="Search jacket, tote, cap…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="tabs">
              {["All", "Wear", "Hats", "Bags"].map((t) => (
                <button key={t} className={filter === t ? "on" : ""} type="button" onClick={() => setFilter(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid-4">
              {shown.map((p) => (
                <article className="product" key={p.id}>
                  <img src={p.img} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p className="muted">{p.blurb}</p>
                  <p className="muted">{p.stock} left this run</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 8 }}>
                    <strong>R{p.price}</strong>
                    <button className="icon-btn" type="button" onClick={() => toggleWish(p.id)}>
                      {wish.includes(p.id) ? "Saved" : "Save"}
                    </button>
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={() => {
                        setActive(p.id);
                        setSize(p.sizes[0]);
                      }}
                    >
                      View
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {page === "story" && (
        <section className="wrap page-pad">
          <p className="kicker">Story</p>
          <h2 className="display section-title">Started with a cap that didn’t blow off on Chapman’s Peak.</h2>
          <div className="grid-2">
            <p className="lede">
              Drift is two friends in a Woodstock studio. We got tired of thin tees and logos. So we made four pieces, in short runs, and we restock when the roll of cloth is gone.
            </p>
            <p className="lede">
              Everything ships from Cape Town. Collect on Albert Road. Joburg and Durban usually take two days with The Courier Guy.
            </p>
          </div>
          <div className="gallery" style={{ marginTop: 28 }}>
            <img src="/images/drift-hero.jpg" alt="Studio flat lay" />
            <img src="/images/jacket.jpg" alt="Chore jacket" />
            <img src="/images/tee.jpg" alt="Tee" />
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
          <h2 className="display section-title">Measured in centimetres. Shipped from Cape Town.</h2>
          <div className="grid-2">
            <article className="about-card">
              <h3>Size guide</h3>
              <div className="menu-row"><span>Size</span><strong>Chest · waist</strong></div>
              {SIZES.map(([s, c, w]) => (
                <div className="menu-row" key={s}>
                  <span>{s}</span>
                  <strong>{c} · {w}</strong>
                </div>
              ))}
              <p className="muted" style={{ marginTop: 12 }}>Between sizes? Take the bigger one. The jacket sits open.</p>
            </article>
            <article className="about-card">
              <h3>Shipping (SA)</h3>
              <p className="lede">Cape Town metro — R70 or free over R1,000. Collect in Woodstock is free.</p>
              <p className="lede">Joburg, Pretoria, Durban, PE — R95. Rest of SA — R120.</p>
              <p className="lede">No international on this sample. Returns in 14 days if the tags are on.</p>
              <p className="lede">PayFast, SnapScan, card, or EFT. Demo checkout does not take money. Try code DRIFT10.</p>
            </article>
          </div>
        </section>
      )}

      {product ? (
        <div className="modal" onClick={() => setActive(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={product.img} alt={product.name} />
            <div>
              <p className="kicker">{product.tag} · {product.stock} left</p>
              <h2 className="display">{product.name}</h2>
              <p className="lede">{product.blurb}</p>
              <p className="lede">{product.made}</p>
              <p className="price">R{product.price}</p>
              <p className="muted">Size</p>
              <div className="sizes">
                {product.sizes.map((s) => (
                  <button key={s} className={size === s ? "on" : ""} type="button" onClick={() => setSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="cart-btn" type="button" onClick={() => add(product, size)}>
                Add {size} · R{product.price}
              </button>
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
            <div style={{ flex: 1, overflow: "auto", margin: "16px 0" }}>
              {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((i) => (
                <div className="line" key={i.key}>
                  <div>
                    <strong>{i.name}</strong>
                    <div className="muted">{i.size} · R{i.price}</div>
                  </div>
                  <div>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                    <span style={{ margin: "0 8px" }}>{i.qty}</span>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <label>Code
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="DRIFT10" />
            </label>
            {off ? <p className="muted">DRIFT10 took R{off} off.</p> : null}
            <p>Total R{total}</p>
            <button className="checkout" type="button" onClick={() => cart.length && setStep(2)}>Checkout</button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={placeOrder} style={{ marginTop: 16 }}>
            <p className="muted">Delivery in South Africa</p>
            <label>Name<input required /></label>
            <label>Email<input type="email" required /></label>
            <label>City
              <select required defaultValue="Cape Town">
                {["Cape Town", "Johannesburg", "Pretoria", "Durban", "Stellenbosch", "Gqeberha"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>Address<input required placeholder="Street and suburb" /></label>
            <label>Pay with
              <select value={pay} onChange={(e) => setPay(e.target.value)}>
                <option>PayFast</option>
                <option>SnapScan</option>
                <option>Card</option>
                <option>EFT</option>
              </select>
            </label>
            <button className="checkout" type="submit">Place order · {pay} (demo)</button>
            <button className="icon-btn" type="button" onClick={() => setStep(1)}>Back to cart</button>
          </form>
        )}

        {step === 3 && (
          <div style={{ marginTop: 24 }}>
            <p className="kicker">Packed in Woodstock</p>
            <h2 className="display">Order {order}</h2>
            <p className="lede">Demo only. No card was charged. A real shop would SMS a tracking number.</p>
            <button className="checkout" type="button" onClick={() => { setStep(1); setOpen(false); }}>
              Keep shopping
            </button>
          </div>
        )}
      </aside>

      {toast ? <div className="toast light-toast">{toast}</div> : null}

      <footer className="wrap">
        <span>Drift Supply · Woodstock</span>
        <a href="/">Web Work Co</a>
      </footer>
    </div>
  );
}
