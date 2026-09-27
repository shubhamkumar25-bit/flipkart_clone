const PRODUCTS = [
  { id: 1, name: "Apple iPhone 13", price: 65999, mrp: 79900, rating: 4.6, img: "https://m.media-amazon.com/images/I/61VuVU94RnL.jpg" },
  { id: 2, name: "boAt Rockerz Headphones", price: 1299, mrp: 2990, rating: 4.2, img: "https://m.media-amazon.com/images/I/61kWB+uzR2L.jpg" },
  { id: 3, name: "Apple MacBook Air M1", price: 72990, mrp: 99900, rating: 4.7, img: "https://m.media-amazon.com/images/I/71jG+e7roXL.jpg" },
  { id: 4, name: "Smart Watch Series 8", price: 2999, mrp: 5999, rating: 4.1, img: "https://m.media-amazon.com/images/I/61HHS0HrjpL.jpg" },
  { id: 5, name: "Logitech Gaming Mouse", price: 1899, mrp: 3495, rating: 4.4, img: "https://m.media-amazon.com/images/I/61mpMH5TzkL.jpg" },
  { id: 6, name: "Sony Wireless Headphone", price: 24999, mrp: 29990, rating: 4.5, img: "https://m.media-amazon.com/images/I/71o8Q5XJS5L.jpg" },
  { id: 7, name: "Apple MacBook Pro 14", price: 169900, mrp: 199900, rating: 4.8, img: "https://m.media-amazon.com/images/I/61aUBxqc5PL.jpg" },
  { id: 8, name: "iPhone 12 (Blue)", price: 45999, mrp: 59900, rating: 4.5, img: "https://m.media-amazon.com/images/I/71fVoqRC0wL.jpg" }
];

const CATEGORIES = [
  { name: "Grocery", img: "https://rukminim1.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png" },
  { name: "Mobiles", img: "https://rukminim1.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png" },
  { name: "Fashion", img: "https://rukminim1.flixcart.com/flap/64/64/image/0d75b34f7d8fbcb3.png" },
  { name: "Electronics", img: "https://rukminim1.flixcart.com/flap/64/64/image/69c6589653afdb9a.png" },
  { name: "Appliances", img: "https://rukminim1.flixcart.com/flap/64/64/image/0ff199d1bd27eb98.png" },
  { name: "Travel", img: "https://rukminim1.flixcart.com/flap/64/64/image/71050627a56b4693.png" }
];

const CART_KEY = "flipkart_clone_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const line = cart.find(item => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
}

function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  } else {
    const line = cart.find(item => item.id === id);
    if (line) line.qty = qty;
  }
  saveCart(cart);
}

function cartLines() {
  return getCart()
    .map(line => {
      const product = PRODUCTS.find(p => p.id === line.id);
      return product ? { ...product, qty: line.qty } : null;
    })
    .filter(Boolean);
}

function cartTotals() {
  const lines = cartLines();
  const items = lines.reduce((sum, l) => sum + l.qty, 0);
  const mrp = lines.reduce((sum, l) => sum + l.mrp * l.qty, 0);
  const price = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const delivery = price > 0 && price < 500 ? 40 : 0;
  return { items, mrp, price, discount: mrp - price, delivery, total: price + delivery };
}

function money(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count ? "inline-block" : "none";
  });
}

function renderHeader(active) {
  const header = document.querySelector(".header-inner");
  if (!header) return;
  header.innerHTML = `
    <a class="logo" href="index.html">Flipkart<span>Explore Plus</span></a>
    <form class="search" onsubmit="return searchProducts(event)">
      <input type="search" id="search-input" placeholder="Search for products, brands and more" aria-label="Search products">
      <button type="submit" aria-label="Search">Search</button>
    </form>
    <nav class="nav">
      <button class="login" type="button">Login</button>
      <a class="cart-link" href="cart.html">Cart <span class="cart-count">0</span></a>
    </nav>`;
  if (active === "home") {
    const input = document.getElementById("search-input");
    if (input) input.addEventListener("input", () => renderProducts(input.value));
  }
  updateCartCount();
}

function renderFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;
  footer.innerHTML = `
    <div><h4>About</h4><p>Contact Us</p><p>About Us</p><p>Careers</p></div>
    <div><h4>Help</h4><p>Payments</p><p>Shipping</p><p>Returns</p></div>
    <div><h4>Policy</h4><p>Privacy</p><p>Security</p><p>Terms</p></div>
    <div><h4>Social</h4><p>Facebook</p><p>Twitter</p><p>Instagram</p></div>`;
}

function searchProducts(event) {
  event.preventDefault();
  const input = document.getElementById("search-input");
  renderProducts(input ? input.value : "");
  return false;
}

function renderCategories() {
  const wrap = document.querySelector(".categories");
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(
    c => `<div class="cat"><img src="${c.img}" alt="${c.name}"><p>${c.name}</p></div>`
  ).join("");
}

function renderProducts(query = "") {
  const grid = document.querySelector(".product-grid");
  if (!grid) return;
  const text = query.trim().toLowerCase();
  const list = text ? PRODUCTS.filter(p => p.name.toLowerCase().includes(text)) : PRODUCTS;
  if (!list.length) {
    grid.innerHTML = `<p>No products found for "${query}".</p>`;
    return;
  }
  grid.innerHTML = list
    .map(p => {
      const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return `<article class="card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <h3>${p.name}</h3>
        <div><span class="rating">${p.rating} ★</span></div>
        <div><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span><span class="off">${off}% off</span></div>
        <button class="btn btn-primary" type="button" onclick="addToCart(${p.id})">Add to Cart</button>
      </article>`;
    })
    .join("");
}
