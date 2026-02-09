/* ============================================================
   VeggieFresh Catalogue Script (Clean Final Version)
   ------------------------------------------------------------
   WORKFLOW:
   products/
     Brand Name, Product Name - Rs. Price, Category1, Category2.jpg

   FEATURES:
   ✅ Auto product parsing from filename
   ✅ Brand-wise sorting + scroll support
   ✅ Category filter (multi-category safe)
   ✅ Quantity + Floating Cart auto update
   ✅ Copy Order + WhatsApp Order working
   ✅ Google Merchant Product Schema JSON-LD
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     1. SAFETY CHECK – images.js loaded?
  ============================================================ */
  if (typeof images === "undefined") {
    alert("❌ images.js not loaded");
    return;
  }

  /* ============================================================
     2. DOM ELEMENTS
  ============================================================ */
  const grid = document.getElementById("catalogGrid");
  const searchBox = document.getElementById("searchBox");
  const categoryFilter = document.getElementById("categoryFilter");

  const cartQtySpan = document.getElementById("cartQty");
  const cartValueEl = document.getElementById("cartValue");

  const copyBtn = document.getElementById("copyOrder");
  const whatsappBtn = document.getElementById("sendWhatsapp");

  /* ============================================================
     3. PRODUCT ARRAY
  ============================================================ */
  let products = [];

  /* ============================================================
     4. FUNCTION: Parse Filename → Product Object
     Brand = everything before first comma
  ============================================================ */
  function parseFilename(file) {

    let clean = file.replace(/\.(jpg|jpeg|png)$/i, "");

    // Find first comma → Brand separator
    let commaIndex = clean.indexOf(",");
    if (commaIndex === -1) return null;

    let brand = clean.slice(0, commaIndex).trim();
    let rest = clean.slice(commaIndex + 1).trim();

    // Split Product and Price part
    let parts = rest.split(" - Rs.");

    let name = parts[0].trim();
    let pricePart = parts[1] || "";

    // Price + Categories
    let priceCats = pricePart.split(",");
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

  /* ============================================================
     5. BUILD PRODUCTS LIST
  ============================================================ */
  images.forEach(file => {
    let product = parseFilename(file);
    if (product) products.push(product);
  });

  /* Sort Brand + Name */
  products.sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.name.localeCompare(b.name);
  });

  /* ============================================================
     6. BUILD CATEGORY FILTER
  ============================================================ */
  function buildCategoryFilter() {

    let categorySet = new Set();

    products.forEach(p => {
      p.categories.forEach(cat => categorySet.add(cat));
    });

    categoryFilter.innerHTML =
      `<option value="all">All Categories</option>` +
      [...categorySet].sort().map(cat =>
        `<option value="${cat}">${cat}</option>`
      ).join("");
  }


/* ==========================================
   FUNCTION: Open Product Page
   जब user product पर click करे
========================================== */
function openProductPage(product) {

  // File name URL-safe बनाना
  var url =
    "product.html?file=" +
    encodeURIComponent(product.file);

  window.location.href = url;
}
imgEl.onclick = function () {
  openProductPage(p);
};

titleEl.onclick = function () {
  openProductPage(p);
};

  /* ============================================================
     7. UPDATE FLOATING CART
  ============================================================ */
  function updateCart() {

    let totalQty = 0;
    let totalValue = 0;

    products.forEach(p => {
      totalQty += p.qty;
      totalValue += p.qty * p.price;
    });

    cartQtySpan.textContent = totalQty;
    cartValueEl.textContent = "Rs. " + totalValue.toFixed(2);
  }

  /* ============================================================
     8. BUILD ORDER TEXT
  ============================================================ */
  function buildOrderText() {

    let selected = products.filter(p => p.qty > 0);
    if (selected.length === 0) return null;

    let text = "🛒 Order List:\n\n";

    selected.forEach((p, i) => {
      text += `${i + 1}. ${p.name} (${p.brand}) x ${p.qty}\n`;
    });

    return text;
  }

  /* ============================================================
     9. PRODUCT SCHEMA JSON-LD (Google Merchant)
  ============================================================ */
  function injectSchema() {

    let old = document.getElementById("schema-products");
    if (old) old.remove();

    let schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": []
    };

    products.forEach((p, i) => {

      schema.itemListElement.push({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "brand": { "@type": "Brand", "name": p.brand },
          "category": p.categories.join(", "),
          "image": "https://veggiefresh.in/products/" + encodeURIComponent(p.file),
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": p.price,
            "availability": "https://schema.org/InStock"
          }
        }
      });

    });

    let script = document.createElement("script");
    script.id = "schema-products";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
  }

  /* ============================================================
     10. RENDER PRODUCTS GRID
  ============================================================ */
  function renderCatalogue() {

    let search = searchBox.value.toLowerCase();
    let catVal = categoryFilter.value;

    grid.innerHTML = "";

    products.forEach(p => {

      // Search filter
      if (
        search &&
        !p.name.toLowerCase().includes(search) &&
        !p.brand.toLowerCase().includes(search)
      ) return;

      // Category filter
      if (
        catVal !== "all" &&
        !p.categories.includes(catVal)
      ) return;

      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="products/${p.file}"
             alt="${p.name} | ${p.brand}"
             loading="lazy">

        <h2 class="title">${p.name}</h2>
        <div class="brand">${p.brand}</div>

        <div class="price">Rs. ${p.price.toFixed(2)}</div>

        <div class="qty-controls">
          <button class="minus">−</button>
          <input class="qty-input" value="${p.qty}" />
          <button class="plus">+</button>
        </div>
      `;

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
        p.qty = val;
        updateCart();
      };

      grid.appendChild(card);
    });

    injectSchema();
  }

  /* ============================================================
     11. BUTTON ACTIONS
  ============================================================ */
  copyBtn.onclick = () => {
    let text = buildOrderText();
    if (!text) return alert("No items selected");
    navigator.clipboard.writeText(text);
    alert("✅ Order Copied!");
  };

  whatsappBtn.onclick = () => {
    let text = buildOrderText();
    if (!text) return alert("No items selected");

    window.open(
      "https://wa.me/919074964418?text=" + encodeURIComponent(text),
      "_blank"
    );
  };

  /* ============================================================
     12. INIT
  ============================================================ */
  buildCategoryFilter();
  renderCatalogue();
  updateCart();

  searchBox.addEventListener("input", renderCatalogue);
  categoryFilter.addEventListener("change", renderCatalogue);

});
