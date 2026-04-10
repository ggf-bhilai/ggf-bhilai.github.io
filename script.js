/* ============================================================
   VeggieFresh Catalogue Script (FINAL FIXED VERSION)
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  if (typeof images === "undefined") {
    alert("❌ images.js not loaded!");
    return;
  }

  const grid = document.getElementById("catalogGrid");
  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");

  const cartQtySpan = document.getElementById("cartQty");
  const cartValueEl = document.getElementById("cartValue");

  const copyBtn = document.getElementById("copyOrder");
  const whatsappBtn = document.getElementById("sendWhatsapp") || {};

  const params = new URLSearchParams(window.location.search);
  const selectedBrand = params.get("brand");

  const heading = document.getElementById("brandHeading");
  if (selectedBrand && heading) {
    heading.textContent = "Showing all products from: " + selectedBrand;
  }

  let products = [];

  function parseFilename(file) {
    let clean = file.replace(/\.(jpg|jpeg|png)$/i, "");
    let commaIndex = clean.indexOf(",");
    if (commaIndex === -1) return null;

    let brand = clean.slice(0, commaIndex).trim();
    let rest = clean.slice(commaIndex + 1).trim();

    let parts = rest.split(" - Rs.");
    let name = parts[0].trim();

    let priceCats = (parts[1] || "").split(",");
    let price = parseFloat(priceCats[0]) || 0;

    let categories = priceCats.slice(1).map(c => c.trim()).filter(Boolean);
    if (categories.length === 0) categories = ["Others"];

    return { file, brand, name, price, categories, qty: 0 };
  }

  images.forEach(file => {
    let p = parseFilename(file);
    if (p) products.push(p);
  });

  products.sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.name.localeCompare(b.name);
  });

  function buildCategoryFilter() {
    let set = new Set();
    products.forEach(p => p.categories.forEach(cat => set.add(cat)));

    categoryFilter.innerHTML =
      `<option value="all">All Categories</option>` +
      [...set].sort().map(cat =>
        `<option value="${cat}">${cat}</option>`
      ).join("");
  }

  function updateCart() {
    let totalQty = 0;
    let totalValue = 0;

    products.forEach(p => {
      totalQty += p.qty;
      totalValue += p.qty * p.price;
    });

    cartQtySpan.textContent = totalQty;
    cartValueEl.textContent = "₹ " + totalValue.toFixed(2);
  }

  function buildOrderText() {
    let selected = products.filter(p => p.qty > 0);
    if (selected.length === 0) return null;

    let text = "🛒 VeggieFresh Order List:\n\n";

    selected.forEach((p, i) => {
      text += `${i + 1}. ${p.name} (${p.brand}) x ${p.qty}\n`;
    });

    return text;
  }

  function openProductPage(product) {
    window.location.href =
      "product.html?file=" + encodeURIComponent(product.file);
  }

  function renderCatalogue() {
    let search = searchBox.value.toLowerCase();
    let catVal = categoryFilter.value;

    grid.innerHTML = "";

    products.forEach(p => {

      if (selectedBrand &&
        p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return;

      if (search &&
        !p.name.toLowerCase().includes(search) &&
        !p.brand.toLowerCase().includes(search)) return;

      if (catVal !== "all" &&
        !p.categories.includes(catVal)) return;

      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="products/${p.file}" loading="lazy">
        <h2 class="title">${p.name}</h2>
        <div class="brand">${p.brand}</div>
        <div class="price">₹ ${p.price.toFixed(2)}</div>

        <div class="qty-controls">
          <button class="minus">−</button>
          <input class="qty-input" type="number" value="${p.qty}">
          <button class="plus">+</button>

          <button class="wa-share" title="Share on WhatsApp">
            <img src="share.png">
          </button>
        </div>
      `;

      card.querySelector("img").onclick = () => openProductPage(p);
      card.querySelector(".title").onclick = () => openProductPage(p);

      card.querySelector(".minus").onclick = () => {
        if (p.qty > 0) p.qty--;
        card.querySelector(".qty-input").value = p.qty;
        updateCart();
      };

      card.querySelector(".plus").onclick = () => {
        p.qty++;
        card.querySelector(".qty-input").value = p.qty;
        updateCart();
      };

      card.querySelector(".qty-input").onchange = (e) => {
        let val = parseInt(e.target.value) || 0;
        if (val < 0) val = 0;
        p.qty = val;
        e.target.value = p.qty;
        updateCart();
      };

      grid.appendChild(card);
    });
  }

  // ===============================
  // 📦 CHECKOUT MODAL (FIXED)
  // ===============================

  const modal = document.getElementById("checkoutModal");
  const orderPreview = document.getElementById("orderPreview");

  if (whatsappBtn) {
    whatsappBtn.onclick = () => {
      let text = buildOrderText();
      if (!text) return alert("❌ No items selected");

      orderPreview.textContent = text;
      modal.style.display = "flex";
    };
  }

  document.getElementById("closeCheckout")?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.getElementById("placeOrder")?.addEventListener("click", () => {

  let name = document.getElementById("custName").value.trim();
  let mobile = document.getElementById("custMobile").value.trim();
  let address = document.getElementById("custAddress").value.trim();

  let text = buildOrderText();

  if (!name || !mobile) {
    return alert("⚠️ Please fill Name & Mobile");
  }

  // ✅ Proper Name Format
  name = name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  let finalMessage =
`🛒 New Order - VeggieFresh

👤 Name: ${name}
📞 Mobile: ${mobile}
📍 Address: ${address || "-"}

-------------------------
${text}`;

  // ✅ Correct URL
  let url =
    "https://wa.me/919074964418?text=" +
    encodeURIComponent(finalMessage);

  // ✅ OPEN WHATSAPP
  window.open(url, "_blank");
});

  // ===============================
  // 💾 AUTO SAVE
  // ===============================

const custNameEl = document.getElementById("custName");
const custMobileEl = document.getElementById("custMobile");
const custAddressEl = document.getElementById("custAddress");

if (custNameEl) {
  custNameEl.value = localStorage.getItem("name") || "";
  custMobileEl.value = localStorage.getItem("mobile") || "";
  custAddressEl.value = localStorage.getItem("address") || "";

  [custNameEl, custMobileEl, custAddressEl].forEach(el => {
    el.addEventListener("input", () => {
      localStorage.setItem("name", custNameEl.value);
      localStorage.setItem("mobile", custMobileEl.value);
      localStorage.setItem("address", custAddressEl.value);      });
    });
  }

  // ===============================
  // INIT
  // ===============================

  buildCategoryFilter();
  renderCatalogue();
  updateCart();

  searchBox.addEventListener("input", renderCatalogue);
  categoryFilter.addEventListener("change", renderCatalogue);

});
