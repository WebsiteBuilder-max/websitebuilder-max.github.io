const PRODUCTS = [
  { id: "cap", name: "Harbour cap", price: 38, img: "images/cap.jpg" },
  { id: "tee", name: "Heavyweight tee", price: 42, img: "images/tee.jpg" },
  { id: "tote", name: "Canvas tote", price: 28, img: "images/tote.jpg" },
  { id: "jacket", name: "Navy chore jacket", price: 120, img: "images/jacket.jpg" },
];

const grid = document.getElementById("grid");
const countEl = document.getElementById("cart-count");
const listEl = document.getElementById("cart-list");
const totalEl = document.getElementById("cart-total");
const msgEl = document.getElementById("cart-msg");
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");

let cart = JSON.parse(localStorage.getItem("drift-cart") || "[]");

function save() {
  localStorage.setItem("drift-cart", JSON.stringify(cart));
  renderCart();
}

function add(id) {
  const line = cart.find((item) => item.id === id);
  if (line) line.qty += 1;
  else cart.push({ id, qty: 1 });
  save();
  openCart();
}

function setQty(id, qty) {
  if (qty <= 0) cart = cart.filter((item) => item.id !== id);
  else cart.find((item) => item.id === id).qty = qty;
  save();
}

function openCart() {
  drawer.classList.add("open");
  backdrop.classList.add("open");
}

function closeCart() {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
}

function renderProducts() {
  grid.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>Made for wind and salt air.</p>
      <div class="row">
        <strong>$${p.price}</strong>
        <button class="add" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`
  ).join("");
}

function renderCart() {
  const detailed = cart.map((line) => {
    const product = PRODUCTS.find((p) => p.id === line.id);
    return { ...product, qty: line.qty };
  });
  const total = detailed.reduce((sum, item) => sum + item.price * item.qty, 0);
  countEl.textContent = detailed.reduce((sum, item) => sum + item.qty, 0);
  totalEl.textContent = total.toFixed(0);
  listEl.innerHTML = detailed.length
    ? detailed
        .map(
          (item) => `
      <div class="line">
        <div>
          <strong>${item.name}</strong>
          <div>$${item.price} × ${item.qty}</div>
        </div>
        <div class="qty">
          <button data-qty="${item.id}:${item.qty - 1}">−</button>
          <span>${item.qty}</span>
          <button data-qty="${item.id}:${item.qty + 1}">+</button>
        </div>
      </div>`
        )
        .join("")
    : "<p>Your cart is empty.</p>";
}

grid.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (id) add(id);
});

listEl.addEventListener("click", (e) => {
  const raw = e.target.dataset.qty;
  if (!raw) return;
  const [id, qty] = raw.split(":");
  setQty(id, Number(qty));
});

document.getElementById("open-cart").addEventListener("click", openCart);
backdrop.addEventListener("click", closeCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    msgEl.textContent = "Add something first.";
    return;
  }
  cart = [];
  save();
  msgEl.textContent = "Order placed. Demo only — no payment was taken.";
});

renderProducts();
renderCart();
