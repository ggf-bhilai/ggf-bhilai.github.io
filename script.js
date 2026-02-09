/* ============================================================
   VeggieFresh Catalogue Script (FINAL CLEAN VERSION)
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     1. SAFETY CHECK
  ============================================================ */
  if (typeof images === "undefined") {
    alert("❌ images.js not loaded!");
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
     3. BRAND FILTER FROM INDEX PAGE
     catalogue.html?brand=Amul
  ============================================================ */
  const params = new URLSearchParams(window.location.search);
  const selectedBrand = params.get("brand");

  /* ============================================================
     4. PRODUCTS ARRAY
  ============================================================ */
  let products = [];

  /* ============================================================
     5. PARSE FILENAME → PRODUCT OBJECT
     Example:
     Amul, Butter 100gm - Rs. 60.00, Dairy Products.jpg
  ============================================================ */
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

  /* ============================================================
     6. BUILD PRODUCTS LIST FROM images.js
  ============================================================ */
  images.forEach(file => {
    let p = parseFilename(file);
    if (p) products.push(p);
  });

  /* Sort brand + product name */
  products.sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.name.localeCompare(b.name);
  });

  /* ============================================================
     7. BUILD CATEGORY DROPDOWN
  ============================================================ */
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

  /* ============================================================
     8. UPDATE FLOATING CART
  ============================================================ */
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

  /* ============================================================
     9. BUILD ORDER TEXT
  ============================================================ */
  function buildOrderText() {

    let selected = products.filter(p => p.qty > 0);
    if (selected.length === 0) return null;

    let text = "🛒 VeggieFresh Order List:\n\n";

    selected.forEach((p, i) => {
      text += `${i + 1}. ${p.name} (${p.brand}) x ${p.qty}\n`;
    });

    return text;
  }

  /* ============================================================
     10. GOOGLE MERCHANT JSON-LD SCHEMA
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
          "brand": {
            "@type": "Brand",
            "name": p.brand
          },
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
     11. RENDER PRODUCT GRID
  ============================================================ */
  function renderCatalogue() {

    let search = searchBox.value.toLowerCase();
    let catVal = categoryFilter.value;

    grid.innerHTML = "";

    products.forEach(p => {

      /* BRAND FILTER from index.html */
      if (selectedBrand &&
          p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return;
      }

      /* SEARCH FILTER */
      if (search &&
          !p.name.toLowerCase().includes(search) &&
          !p.brand.toLowerCase().includes(search)) {
        return;
      }

      /* CATEGORY FILTER */
      if (catVal !== "all" && !p.categories.includes(catVal)) {
        return;
      }

      /* CARD */
      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="products/${p.file}"
             alt="${p.name} | ${p.brand}"
             loading="lazy">

        <h2 class="title">${p.name}</h2>
        <div class="brand">${p.brand}</div>
        <div class="price">₹ ${p.price.toFixed(2)}</div>

        <div class="qty-controls">
          <button class="minus">−</button>
          <input class="qty-input" type="number" value="${p.qty}">
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
        p.qty = parseInt(qtyInput.value) || 0;
        updateCart();
      };

      grid.appendChild(card);
    });

    injectSchema();

    /* AUTO SCROLL TO BRAND */
    if (selectedBrand) {
      setTimeout(() => {
        let first = document.querySelector(".card");
        if (first) first.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }


if (selectedBrand) {
  setTimeout(() => {
    let firstCard = document.querySelector(".card");
    if (firstCard) {
      firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 500);
}

  /* ============================================================
     12. BUTTON ACTIONS
  ============================================================ */
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
      "https://wa.me/919074964418?text=" + encodeURIComponent(text),
      "_blank"
    );
  };

  /* ============================================================
     13. INIT
  ============================================================ */
  buildCategoryFilter();
  renderCatalogue();
  updateCart();

  searchBox.addEventListener("input", renderCatalogue);
  categoryFilter.addEventListener("change", renderCatalogue);

});
