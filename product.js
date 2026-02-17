document.addEventListener("DOMContentLoaded", function () {

  // ==============================
  // GET FILE PARAM
  // ==============================
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");

  if (!file) {
    document.getElementById("productName").textContent =
      "❌ Product Not Found";
    return;
  }

  // ==============================
  // PARSE PRODUCT FROM FILENAME
  // ==============================
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
      categories
    };
  }

  // ==============================
  // CURRENT PRODUCT DATA
  // ==============================
  let product = parseFilename(file);

  if (!product) {
    document.getElementById("productName").textContent =
      "❌ Invalid Product File";
    return;
  }

  // ==============================
  // FILL PRODUCT DETAILS
  // ==============================
  document.getElementById("productImage").src =
    "products/" + product.file;

  document.getElementById("productName").textContent =
    product.name;

  document.getElementById("productBrand").textContent =
    product.brand;

  document.getElementById("productCategory").textContent =
    product.categories.join(", ");

  document.getElementById("productPrice").textContent =
    product.price.toFixed(2);

  // ==============================
  // ORDER BUTTON WHATSAPP
  // ==============================
  document.getElementById("orderBtn").onclick = function () {

    let message =
      `Hi,\n\nI want to order:\n` +
      `"${product.brand} ${product.name}"\n\n` +
      `From Geetanjali Good Foods\n\n` +
      `Product Link:\nhttps://veggiefresh.in/product.html?file=${encodeURIComponent(product.file)}`;

    window.open(
      "https://wa.me/919074964418?text=" +
      encodeURIComponent(message),
      "_blank"
    );
  };

  // ==============================
  // RELATED PRODUCTS SLIDER
  // ==============================
  let relatedGrid = document.getElementById("relatedGrid");

  if (typeof images === "undefined") return;

  let related = [];

  images.forEach(f => {
    let p2 = parseFilename(f);

    if (
      p2 &&
      p2.brand.toLowerCase() === product.brand.toLowerCase() &&
      p2.file !== product.file
    ) {
      related.push(p2);
    }
  });

  if (related.length === 0) {
    relatedGrid.innerHTML =
      "<p style='text-align:center;'>No more products from this brand.</p>";
    return;
  }

  // ==============================
  // BUILD SLIDER + SHOW ALL BUTTON
  // ==============================
  relatedGrid.innerHTML = `
    <div class="slider-top">
      <h2>More From This Brand</h2>
      <button class="show-all-btn" id="showAllBtn">
        Show All →
      </button>
    </div>

    <div class="slider-wrap">
      <button class="slide-btn left">‹</button>

      <div class="slider" id="sliderTrack"></div>

      <button class="slide-btn right">›</button>
    </div>
  `;

  let sliderTrack = document.getElementById("sliderTrack");

  // ==============================
  // ADD PRODUCT CARDS + SHARE ICON
  // ==============================
  related.slice(0, 15).forEach(item => {

    let card = document.createElement("div");
    card.className = "slide-card";

    card.innerHTML = `
      <img src="products/${item.file}" loading="lazy">

      <h3>${item.name}</h3>
      <p class="price">₹ ${item.price.toFixed(2)}</p>

      <button class="wa-mini-share">
        <img src="whatsapp.svg">
      </button>
    `;

    // Card click → open product
    card.onclick = () => {
      window.location.href =
        "product.html?file=" + encodeURIComponent(item.file);
    };

    // Share button click stop card click
    card.querySelector(".wa-mini-share").onclick = (e) => {
      e.stopPropagation();

      let msg =
        `Order "${item.brand} ${item.name}" from Geetanjali Good Foods\n\n` +
        `Product Link:\nhttps://veggiefresh.in/product.html?file=${encodeURIComponent(item.file)}`;

      window.open(
        "https://wa.me/?text=" + encodeURIComponent(msg),
        "_blank"
      );
    };

    sliderTrack.appendChild(card);
  });

  // ==============================
  // SLIDER BUTTONS
  // ==============================
  let leftBtn = document.querySelector(".slide-btn.left");
  let rightBtn = document.querySelector(".slide-btn.right");

  rightBtn.onclick = () => {
    sliderTrack.scrollBy({ left: 280, behavior: "smooth" });
  };

  leftBtn.onclick = () => {
    sliderTrack.scrollBy({ left: -280, behavior: "smooth" });
  };

  // ==============================
  // LOOP FEEL (End → Start)
  // ==============================
  sliderTrack.addEventListener("scroll", () => {

    if (
      sliderTrack.scrollLeft + sliderTrack.clientWidth >=
      sliderTrack.scrollWidth - 5
    ) {
      // End reached → back to start
      setTimeout(() => {
        sliderTrack.scrollTo({ left: 0, behavior: "smooth" });
      }, 800);
    }
  });

  // ==============================
  // AUTO SCROLL (Optional)
  // ==============================
  let autoScroll = setInterval(() => {
    sliderTrack.scrollBy({ left: 220, behavior: "smooth" });
  }, 4000);

  // Stop auto scroll when user touches slider
  sliderTrack.addEventListener("touchstart", () => {
    clearInterval(autoScroll);
  });

  // ==============================
  // SHOW ALL BUTTON
  // ==============================
  document.getElementById("showAllBtn").onclick = () => {

  // Brand name encode karo
  let brandParam = encodeURIComponent(product.brand);

  // Catalogue page open with brand filter
  window.location.href =
    "catalogue.html?brand=" + brandParam;
};

});
