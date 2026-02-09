document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================
     STEP 1: Get File Name from URL
  ========================================== */
  var params = new URLSearchParams(window.location.search);
  var file = params.get("file");

  if (!file) {
    document.getElementById("productPage").innerHTML =
      "<h2>Product not found</h2>";
    return;
  }


  /* ==========================================
     STEP 2: Extract Product Info from Filename
     Format:
     Brand Product - Rs. Price, Category1, Category2.jpg
  ========================================== */
  var clean = file.replace(/\.(jpg|jpeg|png)$/i, "");

  var parts = clean.split(",");

  var namePricePart = parts[0].trim();
  var categories = parts.slice(1).map(c => c.trim());

  var priceMatch =
    namePricePart.match(/Rs\.?\s*([0-9]+(?:\.[0-9]{1,2})?)/i);

  var price = priceMatch ? parseFloat(priceMatch[1]) : 0;

  var name = namePricePart
    .replace(/-\s*Rs\.?\s*[0-9]+(?:\.[0-9]{1,2})?/i, "")
    .trim();

  var brand = name.split(" ")[0];


  /* ==========================================
     STEP 3: Render Product Page
  ========================================== */
  var container = document.getElementById("productPage");

  container.innerHTML = `
    <div class="product-detail-card">

      <img class="product-image"
           src="products/${file}"
           alt="${name}">

      <div class="product-info">

        <h1>${name}</h1>

        <p class="brand-line">
          Brand: <b>${brand}</b>
        </p>

        <p class="price-line">
          Price: ₹ ${price.toFixed(2)}
        </p>

        <p class="category-line">
          Categories: ${categories.join(", ")}
        </p>

        <a class="whatsapp-btn"
           href="https://wa.me/919074964418?text=${encodeURIComponent(
             "Hi, I want to order: " + name
           )}"
           target="_blank">
           Order This Product
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
  
  /* ==========================================
     STEP 4: Inject Google Merchant JSON-LD Schema
  ========================================== */
  injectSchema(name, brand, price, file);


  /* ==========================================
     STEP 5: Related Products (Same Brand)
  ========================================== */
  showRelatedProducts(brand, file);

});


/* ==========================================
   FUNCTION: Inject Schema
========================================== */
function injectSchema(name, brand, price, file) {

  var schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "image": "https://veggiefresh.in/products/" + file,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": price,
      "availability": "https://schema.org/InStock",
      "url": window.location.href
    }
  };

  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);

  document.head.appendChild(script);
}


/* ==========================================
   FUNCTION: Related Products Grid
========================================== */
function showRelatedProducts(brand, currentFile) {

  var grid = document.getElementById("relatedGrid");

  var related = images.filter(f =>
    f.toLowerCase().startsWith(brand.toLowerCase()) &&
    f !== currentFile
  );

  related.slice(0, 8).forEach(file => {

    var card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <a href="product.html?file=${encodeURIComponent(file)}">
        <img src="products/${file}" loading="lazy">
      </a>
    `;

    grid.appendChild(card);
  });
}
