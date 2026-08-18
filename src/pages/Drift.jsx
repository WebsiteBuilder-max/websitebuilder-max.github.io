import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PRODUCTS = [
  { id: "cap", name: "Harbour cap", price: 38, img: "/images/cap.jpg", blurb: "Washed navy. Sits right in wind.", sizes: ["One size"] },
  { id: "tee", name: "Heavyweight tee", price: 42, img: "/images/tee.jpg", blurb: "Thick cotton. Off-white.", sizes: ["S", "M", "L", "XL"] },
  { id: "tote", name: "Canvas tote", price: 28, img: "/images/tote.jpg", blurb: "Sand canvas. Daily bag.", sizes: ["One size"] },
  { id: "jacket", name: "Navy chore jacket", price: 120, img: "/images/jacket.jpg", blurb: "Light layer for evening wind.", sizes: ["S", "M", "L"] },
];

export default function Drift() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [size, setSize] = useState("M");
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((n, i) => n + i.price * i.qty, 0);
  const product = useMemo(() => PRODUCTS.find((p) => p.id === active), [active]);

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
  }

  function setQty(key, qty) {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))));
  }

  function placeOrder(e) {
    e.preventDefault();
    setOrder(`DS-${Math.floor(18000 + Math.random() * 4000)}`);
    setCart([]);
    setStep(3);
  }

  return (
    <div className="drift-body">
      <header className="site-nav drift-nav">
        <div className="wrap">
          <a className="brand" href="#shop">Drift Supply</a>
          <nav className="nav-links">
            <a href="#shop">Shop</a>
            <Link to="/">Ryan portfolio</Link>
          </nav>
          <button className="cart-btn" type="button" onClick={() => setOpen(true)}>
            Cart {count}
          </button>
        </div>
      </header>

      <section className="wrap drift-hero">
        <div>
          <p className="kicker">Sample shop · Cape Town</p>
          <h1 className="display">Quiet clothes for salt air.</h1>
          <p className="lede">
            Four products, sizes, a real cart, and a checkout that feels finished. Demo only — no payment is taken.
          </p>
        </div>
        <img src="/images/drift-hero.jpg" alt="Drift Supply flat lay" />
      </section>

      <section className="wrap" id="shop">
        <p className="kicker">Shop</p>
        <div className="grid-4">
          {PRODUCTS.map((p) => (
            <article className="product" key={p.id}>
              <img src={p.img} alt={p.name} />
              <h3>{p.name}</h3>
              <p className="muted">{p.blurb}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <strong>${p.price}</strong>
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

      {product ? (
        <div className="modal" onClick={() => setActive(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={product.img} alt={product.name} />
            <div>
              <p className="kicker">Look closer</p>
              <h2 className="display">{product.name}</h2>
              <p className="lede">{product.blurb}</p>
              <p className="price">${product.price}</p>
              <p className="muted">Size</p>
              <div className="sizes">
                {product.sizes.map((s) => (
                  <button key={s} className={size === s ? "on" : ""} type="button" onClick={() => setSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <button className="cart-btn" type="button" onClick={() => add(product, size)}>
                Add {size} to cart
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
                    <div className="muted">{i.size} · ${i.price}</div>
                  </div>
                  <div>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                    <span style={{ margin: "0 8px" }}>{i.qty}</span>
                    <button className="qty-btn" type="button" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <p>Total ${total}</p>
            <button className="checkout" type="button" onClick={() => cart.length && setStep(2)}>
              Checkout
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={placeOrder} style={{ marginTop: 16 }}>
            <p className="muted">Step 2 of 3 · details</p>
            <label>Name<input required /></label>
            <label>Email<input type="email" required /></label>
            <label>City<input required placeholder="Cape Town" /></label>
            <button className="checkout" type="submit">Place order (demo)</button>
            <button className="icon-btn" type="button" onClick={() => setStep(1)}>Back to cart</button>
          </form>
        )}

        {step === 3 && (
          <div style={{ marginTop: 24 }}>
            <p className="kicker">Packed</p>
            <h2 className="display">Order {order}</h2>
            <p className="lede">Demo only. No card was charged. This is the confirmation a real shop would show.</p>
            <button className="checkout" type="button" onClick={() => { setStep(1); setOpen(false); }}>
              Keep shopping
            </button>
          </div>
        )}
      </aside>

      <footer className="wrap">
        <span>Drift Supply · sample shop</span>
        <Link to="/">Back to Ryan</Link>
      </footer>
    </div>
  );
}
