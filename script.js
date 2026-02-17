/* ============================================================
   VeggieFresh Catalogue Script (FINAL CLEAN VERSION)
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ==============================
     1. SAFETY CHECK
  ============================== */
  if (typeof images === "undefined") {
    alert("❌ images.js not loaded!");
    return;
  }

  /* ==============================
     2. DOM ELEMENTS
  ============================== */
  const grid = document.getElementById("catalogGrid");
  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");

  const cartQtySpan = document.getElementById("cartQty");
  const cartValueEl = document.getElementById("cartValue");

  const copyBtn = document.getElementById("copyOrder");
  const whatsappBtn = document.getElementById("sendWhatsapp");

  /* ==============================
     3. BRAND FILTER PARAM
     catalogue.html?brand=Amul
  ============================== */
  const params = new URLSearchParams(window.location.search);
  const selectedBrand = params.get("brand");

  // Heading Show (Safe)
  const heading = document.getElementById("brandHeading");
  if (selectedBrand && heading) {
    heading.textContent =
      "Showing all products from: " + selectedBrand;
  }

  /* ==============================
     4. PRODUCTS ARRAY
  ============================== */
  let products = [];

  /* ==============================
     5. PARSE PRODUCT FROM FILENAME
     Amul, Butter 100gm - Rs. 60, Dairy.jpg
  ============================== */
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

    let categories = priceCats
      .slice(1)
      .map(c => c.trim())
      .filter(Boolean);

    if (categories.length === 0) categories = ["Others"];

    return {
      file,
      brand,
      name,
      price,
      categories,
      qty: 0
    };
  }

  /* ==============================
     6. BUILD PRODUCT LIST
  ============================== */
  images.forEach(file => {
    let p = parseFilename(file);
    if (p) products.push(p);
  });

  products.sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.name.localeCompare(b.name);
  });

  /* ==============================
     7. CATEGORY FILTER BUILD
  ============================== */
  function buildCategoryFilter() {

    let set = new Set();

    products.forEach(p => {
      p.categories.forEach(cat => set.add(cat));
    });

    categoryFilter.innerHTML =
      `<option value="all">All Categories</option>` +
      [...set].sort().map(cat =>
        `<option value="${cat}">${cat}</option>`
      ).join("");
  }

  /* ==============================
     8. UPDATE CART
  ============================== */
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

  /* ==============================
     9. ORDER TEXT
  ============================== */
  function buildOrderText() {

    let selected = products.filter(p => p.qty > 0);
    if (selected.length === 0) return null;

    let text = "🛒 VeggieFresh Order List:\n\n";

    selected.forEach((p, i) => {
      text += `${i + 1}. ${p.name} (${p.brand}) x ${p.qty}\n`;
    });

    return text;
  }

  /* ==============================
     10. PRODUCT PAGE OPEN
  ============================== */
  function openProductPage(product) {
    window.location.href =
      "product.html?file=" +
      encodeURIComponent(product.file);
  }

  /* ==============================
     11. RENDER CATALOGUE
  ============================== */
  function renderCatalogue() {

    let search = searchBox.value.toLowerCase();
    let catVal = categoryFilter.value;

    grid.innerHTML = "";

    products.forEach(p => {

      // Brand Filter
      if (selectedBrand &&
        p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return;

      // Search Filter
      if (search &&
        !p.name.toLowerCase().includes(search) &&
        !p.brand.toLowerCase().includes(search)) return;

      // Category Filter
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

          <!-- WhatsApp Share Button -->
          <button class="wa-share" title="Share on WhatsApp">
            <img src="share.png" alt="WhatsApp">
          </button>
        </div>
      `;

      /* OPEN PRODUCT PAGE */
      card.querySelector("img").onclick = () => openProductPage(p);
      card.querySelector(".title").onclick = () => openProductPage(p);

      /* WHATSAPP SHARE */
      let waShareBtn = card.querySelector(".wa-share");

      waShareBtn.onclick = (e) => {
        e.stopPropagation();

        let productUrl =
          "https://veggiefresh.in/product.html?file=" +
          encodeURIComponent(p.file);

        let message =
          `Order "${p.brand} ${p.name}" from Geetanjali Good Foods\n\n` +
          `View Product: ${productUrl}`;

        window.open(
          "https://wa.me/?text=" + encodeURIComponent(message),
          "_blank"
        );
      };

      /* QTY CONTROLS */
      let minus = card.querySelector(".minus");
      let plus = card.querySelector(".plus");
      let qtyInput = card.querySelector(".qty-input");

      minus.onclick = () => {
        if (p.qty > 0) p.qty--;
        qtyInput.value = p.qty;
        updateCart();
      };

      plus.onclick = () => {
        p.qty++;
        qtyInput.value = p.qty;
        updateCart();
      };

      qtyInput.onchange = () => {
        let val = parseInt(qtyInput.value) || 0;
        if (val < 0) val = 0;
        p.qty = val;
        qtyInput.value = p.qty;
        updateCart();
      };

      grid.appendChild(card);
    });
  }

  /* ==============================
     12. BUTTON ACTIONS
  ============================== */
  copyBtn.onclick = () => {
    let text = buildOrderText();
    if (!text) return alert("❌ No items selected");

    navigator.clipboard.writeText(text);
    alert("✅ Order Copied!");
  };

  whatsappBtn.onclick = () => {
    let text = buildOrderText();
    if (!text) return alert("❌ No items selected");

    window.open(
      "https://wa.me/919074964418?text=" +
      encodeURIComponent(text),
      "_blank"
    );
  };

  /* ==============================
     13. INIT
  ============================== */
  buildCategoryFilter();
  renderCatalogue();
  updateCart();

  searchBox.addEventListener("input", renderCatalogue);
  categoryFilter.addEventListener("change", renderCatalogue);

});
