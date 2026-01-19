document.addEventListener("DOMContentLoaded", () => {

  if (typeof images === "undefined") {
    alert("images.js not loaded");
    return;
  }

  const grid = document.getElementById("catalogGrid");
  const searchInput = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");
  const cartQtySpan = document.getElementById("cartQty");
  const copyOrderBtn = document.getElementById("copyOrder");
  const whatsappBtn = document.getElementById("sendWhatsapp");

  let products = [];
  let cartQty = 0;

  /* INIT */
  images.forEach(img => {
  const clean = img.replace(/\.(png|jpg|jpeg)$/i, "");
  const parts = clean.split(",");

  const namePricePart = parts[0].trim();
  const category = parts[1] ? parts[1].trim() : "Others";

  let name = namePricePart;
  let price = 0;

  // SAFE PRICE EXTRACTION
  const priceMatch = namePricePart.match(/Rs\.?\s*([0-9]+(\.[0-9]+)?)/i);
  if (priceMatch) {
    price = Number(priceMatch[1]);
    name = namePricePart.split("-")[0].trim();
  }

  products.push({
    file: img,
    name,
    category,
    price,
    qty: 0
  });
});



  products.sort((a, b) => a.name.localeCompare(b.name));

  /* CATEGORY FILTER */
  const cats = [...new Set(products.map(p => p.category))];
  categoryFilter.innerHTML =
    `<option value="all">All</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");

  /* RENDER */
  function render() {
    const s = searchInput.value.toLowerCase();
    const c = categoryFilter.value;
    grid.innerHTML = "";

    products
      .filter(p =>
  (p.name.toLowerCase().includes(s) ||
   p.category.toLowerCase().includes(s)) &&
  (c === "all" || p.category === c)
)

      .forEach(p => {
        const d = document.createElement("div");
        d.className = "card";
        d.innerHTML = `
  <img src="products/${p.file}">
  <div class="title">${p.name}, ${p.category}</div>
  <div class="price">₹ ${p.price.toFixed(2)}</div>
  <button>-</button> <span>${p.qty}</span> <button>+</button>
`;


        d.querySelector("img").onclick = () => {
          navigator.clipboard.writeText(`${p.name}, ${p.category}`);
        };

        const btns = d.querySelectorAll("button");
        const span = d.querySelector("span");

        btns[0].onclick = () => {
  if (p.qty > 0) {
    p.qty--;
    span.textContent = p.qty;
    updateCart();
  }
};

btns[1].onclick = () => {
  p.qty++;
  span.textContent = p.qty;
  updateCart();
};


        grid.appendChild(d);
      });
  }

  searchInput.oninput = render;
  categoryFilter.onchange = render;

function buildOrderText() {
  const selected = products.filter(p => p.qty > 0);
  if (selected.length === 0) return null;

  let totalQty = 0;
  let totalValue = 0;
  let text = "Order List:\n\n";

  selected.forEach((p, i) => {
    totalQty += p.qty;
    totalValue += p.qty * p.price;

    text += `${i + 1}. ${p.name}, ${p.category} × ${p.qty}  (₹${p.price})\n`;
  });

  text += `\nTotal Quantity: ${totalQty}`;
  text += `\nTotal Value: ₹ ${totalValue.toFixed(2)}`;

  return text;
}


  copyOrderBtn.onclick = () => {
  const text = buildOrderText();
  if (!text) {
    alert("No items selected");
    return;
  }
  navigator.clipboard.writeText(text);
  alert("Order copied to clipboard");
};


  whatsappBtn.onclick = () => {
  const text = buildOrderText();
  if (!text) {
    alert("No items selected");
    return;
  }

  window.open(
    "https://wa.me/919074964418?text=" + encodeURIComponent(text),
    "_blank"
  );
};


  render();
  function updateCart() {
  let totalQty = 0;
  let totalValue = 0;

  products.forEach(p => {
    totalQty += p.qty;
    totalValue += (p.qty * p.price);
  });

  cartQtySpan.textContent = totalQty;

  const cartValueEl = document.getElementById("cartValue");
  if (cartValueEl) {
    cartValueEl.textContent = "₹ " + totalValue.toFixed(2);
  }
}


});
