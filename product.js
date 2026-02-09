document.addEventListener("DOMContentLoaded", function () {

  /* ============================================
     STEP 1: CHECK images.js loaded
  ============================================ */
  if (typeof images === "undefined") {
    alert("images.js not loaded");
    return;
  }

  /* ============================================
     STEP 2: GET PRODUCT NAME FROM URL
     Example:
     product.html?name=Amul Butter 100gm
  ============================================ */
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("name");

  if (!productName) {
    document.getElementById("productDetails").innerHTML =
      "<h2>No Product Selected</h2>";
    return;
  }

  /* ============================================
     STEP 3: FIND MATCHING PRODUCT FILE
  ============================================ */
  const file = images.find(f =>
    f.toLowerCase().includes(productName.toLowerCase())
  );

  if (!file) {
    document.getElementById("productDetails").innerHTML =
      "<h2>Product Not Found</h2>";
    return;
  }

  /* ============================================
     STEP 4: EXTRACT DETAILS FROM FILENAME
     Format:
     Brand Product - Rs. Price, Category1, Category2.jpg
  ============================================ */
  const clean = file.replace(/\.(jpg|png|jpeg)$/i, "");
  const parts = clean.split(",");

  const namePricePart = parts[0].trim();
  const categories = parts.slice(1).map(c => c.trim());

  // Price Extract
  let price = 0;
  let name = namePricePart;

  const match = namePricePart.match(/Rs\.?\s*([0-9]+(\.[0-9]+)?)/i);

  if (match) {
    price = parseFloat(match[1]);
    name = namePricePart.replace(match[0], "").replace("-", "").trim();
  }

  // Brand = first word
  const brand = name.split(" ")[0];

  /* ============================================
     STEP 5: RENDER PRODUCT DETAILS
  ============================================ */
  const productBox = document.getElementById("productDetails");

  productBox.innerHTML = `
    <div class="product-card">

      <img class="product-image"
           src="products/${file}"
           alt="${name} wholesale in Bhilai">

      <div class="product-info">
        <h1>${name}</h1>

        <p class="brand-line">
          Brand: <strong>${brand}</strong>
        </p>

        <p class="price-line">
          Price: ₹ ${price.toFixed(2)}
        </p>

        <p class="category-line">
          Categories: ${categories.join(", ")}
        </p>

        <a class="order-btn"
           target="_blank"
           href="https://wa.me/919074964418?text=${encodeURIComponent(
             "Hi, I want to order: " + name
           )}">
           Order on WhatsApp
        </a>
      </div>

    </div>
  `;

  /* ============================================
     STEP 6: SEO META + TITLE UPDATE
  ============================================ */
  document.title = `${name} | VeggieFresh Bhilai`;

  let meta = document.querySelector("meta[name='description']");
  meta.setAttribute(
    "content",
    `${name} by ${brand}. Wholesale HoReCa supply in Bhilai & Durg.`
  );

  /* ============================================
     STEP 7: GOOGLE MERCHANT PRODUCT SCHEMA
  ============================================ */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": categories.join(", "),
    "image": `https://veggiefresh.in/products/${encodeURIComponent(file)}`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Geetanjali Good Foods"
      }
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);

  /* ============================================
     STEP 8: RELATED PRODUCTS (Same Brand Grid)
  ============================================ */
  const relatedGrid = document.getElementById("relatedGrid");

  images.forEach(f => {

    if (f === file) return;

    if (!f.toLowerCase().startsWith(brand.toLowerCase())) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="product.html?name=${encodeURIComponent(
        f.split("-")[0].trim()
      )}">
        <img src="products/${f}" loading="lazy">
        <div class="title">${f.split("-")[0]}</div>
      </a>
    `;

    relatedGrid.appendChild(card);
  });

});
