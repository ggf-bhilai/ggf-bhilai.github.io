document.addEventListener("DOMContentLoaded", function () {

	function updateSEO(titleText, descriptionText) {
		document.title = titleText;

		var meta = document.querySelector("meta[name='description']");
		if (!meta) {
		meta = document.createElement("meta");
		meta.name = "description";
		document.head.appendChild(meta);
		}
		meta.setAttribute("content", descriptionText);
	}


  if (typeof images === "undefined") {
    alert("images.js not loaded");
    return;
  }

  var grid = document.getElementById("catalogGrid");
  var searchInput = document.getElementById("searchBox");
  var categoryFilter = document.getElementById("categoryFilter");
  var cartQtySpan = document.getElementById("cartQty");
  var cartValueEl = document.getElementById("cartValue");
  var copyOrderBtn = document.getElementById("copyOrder");
  var whatsappBtn = document.getElementById("sendWhatsapp");

  var products = [];

  /* ===== BUILD PRODUCTS ===== */
  images.forEach(function (file) {

    var clean = file
      .replace(/\.(png|jpg|jpeg)$/i, "")
      .replace(/_/g, " ");

    var parts = clean.split(",");
    var namePricePart = parts[0].trim();
    var category = parts[1] ? parts[1].trim() : "Others";

    var name = namePricePart;
    var price = 0;

    var priceMatch = namePricePart.match(/-\s*Rs\.?\s*([0-9]+(?:\.[0-9]{1,2})?)/i);

		if (priceMatch) {
		price = parseFloat(priceMatch[1]);

		// Remove "- Rs. xxx" part from name
		name = namePricePart
		.replace(/-\s*Rs\.?\s*[0-9]+(?:\.[0-9]{1,2})?/i, "")
		.trim();
		}


    products.push({
      file: file,
      name: name,
      category: category,
      price: price,
      qty: 0
	  brand: name.split(" ")[0].toLowerCase()   // 👈 BRAND
    });
  });

  products.sort(function (a, b) {
  if (a.brand !== b.brand) {
    return a.brand.localeCompare(b.brand);
  }
  return a.name.localeCompare(b.name);
});

var seoByCategory = {
		"Frozen Vegetables":
			"Buy premium frozen vegetables wholesale from Geetanjali Good Foods, Bhilai. Frozen peas, sweet corn & more.",
		"Frozen Veg Snacks":
			"Wholesale frozen snacks for hotels, cafes & restaurants. Quality frozen food by VeggieFresh.",
		"Sauce":
			"Bulk food sauces for restaurants & catering. VeggieFresh by Geetanjali Good Foods.",
		"Kethup":
			"Wholesale tomato ketchup & condiments for food businesses in Bhilai.",
		"Mayonnaise":
			"Premium mayonnaise in bulk for hotels & food outlets.",
		"Seasoning":
			"Food seasoning & spices wholesale supply by Geetanjali Good Foods.",
		"Masale":
			"Quality masale & spices for commercial kitchens & distributors.",
		"Disposable":
			"Food-grade disposable items for hotels & food businesses.",
		"Others":
			"Wholesale food products by Geetanjali Good Foods, Bhilai.",
		"Pasta & Noodles":
			"Wholesale Pasta & Noodles by Geetanjali Good Foods, Bhilai.",
		"Tortila":
			"Wholesale Tortila by Geetanjali Good Foods, Bhilai.",
		"Canned & Imported Items":
			"Wholesale Canned & Imported Items by Geetanjali Good Foods, Bhilai.",
		"Italian & European Food Ingredients":
			"Wholesale Italian & European Food Ingredients by Geetanjali Good Foods, Bhilai.",
		"Japanese Thai & Oriental":
			"Wholesale Japanese Thai & Oriental Food Ingredients by Geetanjali Good Foods, Bhilai.",
		"Imported Bakery & Cheese":
			"Wholesale Imported Bakery & Cheese by Geetanjali Good Foods, Bhilai.",
		"Frozen Raw Chicken":
			"Wholesale Frozen Raw Chicken by Geetanjali Good Foods, Bhilai.",
		"Frozen Chicken Cold Cut":
			"Wholesale Frozen Chicken Cold Cut by Geetanjali Good Foods, Bhilai.",
		"Frozen Non-Veg Snacks":
			"Wholesale Frozen Non-Veg Snacks by Geetanjali Good Foods, Bhilai.",
		"Olives Jalapenoes & Canned Products":
			"Wholesale Olives Jalapenoes & Canned Products by Geetanjali Good Foods, Bhilai.",
		"Spread":
			"Wholesale Spread by Geetanjali Good Foods, Bhilai.",
		"Bakery Fillings":
			"Wholesale Bakery Fillings by Geetanjali Good Foods, Bhilai.",
		"Butter and Fat Spreds":
			"Wholesale Butter and Fat Spreds by Geetanjali Good Foods, Bhilai.",
		"Syrup and Crushes":
			"Wholesale Syrup and Crushes by Geetanjali Good Foods, Bhilai.",
		"disposable cutlery and more":
			"High-quality disposable supplies for HoReCa. Shop bulk eco-friendly containers, cutlery, napkins, and takeaway packaging. Fast delivery and competitive wholesale pricing.",
	};


  /* ===== CATEGORY FILTER ===== */
  var cats = [];
  products.forEach(function (p) {
    if (cats.indexOf(p.category) === -1) {
      cats.push(p.category);
    }
  });

  categoryFilter.innerHTML =
    '<option value="all">All Categories</option>' +
    cats.map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join("");

  /* ===== RENDER ===== */
  function render() {

    var s = searchInput.value.toLowerCase();
    var c = categoryFilter.value;

    // 🔥 SEO: dynamic page title
    if (s) {
      document.title = s + " | Veggie Fresh Catalogue – Geetanjali Good Foods";
    } else if (c !== "all") {
      document.title = c + " | Veggie Fresh Catalogue – Geetanjali Good Foods";
    } else {
      document.title = "Veggie Fresh Product Catalogue | Geetanjali Good Foods";
    }

    grid.innerHTML = "";

    products.forEach(function (p) {

      if (
        (p.name.toLowerCase().indexOf(s) === -1 &&
         p.category.toLowerCase().indexOf(s) === -1) ||
        (c !== "all" && p.category !== c)
      ) {
        return;
      }

      var card = document.createElement("div");
      card.className = "card";

var brandId = "brand-" + p.brand;
var prev = grid.lastElementChild;

if (!prev || prev.getAttribute("data-brand") !== p.brand) {
  card.setAttribute("id", brandId);
}
card.setAttribute("data-brand", p.brand);
		
      card.innerHTML =
        '<img src="products/' + p.file + '" ' +
        'alt="' + p.name + ' | Veggie Fresh by Geetanjali Good Foods" ' +
        'loading="lazy">' +

        '<div class="controls-row">' +
          '<div class="qty-controls">' +
            '<button class="minus" aria-label="Decrease quantity">-</button>' +
            '<span class="qty">' + String(p.qty).padStart(2, "0") + '</span>' +
            '<button class="plus" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button class="share-btn" aria-label="Share product on WhatsApp">Share</button>' +
        '</div>' +

        '<h2 class="title">' + p.name + '</h2>' +
        '<div class="price">Rs. ' + p.price.toFixed(2) + '</div>';

      var imgEl = card.querySelector("img");
      var titleEl = card.querySelector(".title");
      var minusBtn = card.querySelector(".minus");
      var plusBtn = card.querySelector(".plus");
      var qtySpan = card.querySelector(".qty");
      var shareBtn = card.querySelector(".share-btn");

      function copyName() {
        navigator.clipboard.writeText(p.name);
      }

      imgEl.style.cursor = "pointer";
      titleEl.style.cursor = "pointer";
      imgEl.title = "Click to copy product name";
      titleEl.title = "Click to copy product name";

      imgEl.onclick = copyName;
      titleEl.onclick = copyName;

      minusBtn.onclick = function () {
        if (p.qty > 0) {
          p.qty--;
          qtySpan.textContent = String(p.qty).padStart(2, "0");
          updateCart();
        }
      };

      plusBtn.onclick = function () {
        p.qty++;
        qtySpan.textContent = String(p.qty).padStart(2, "0");
        updateCart();
      };

      shareBtn.onclick = function () {

        var message =
          "Hi,\n" +
          "Order \"" + p.name + "\"\n\n" +
          "From\n" +
          "*Geetanjali Good Foods*\n" +
          "Call Now 9074964418\n\n" +
          "*Visit our catalog*\n" +
          "https://veggiefresh.in/catalogue.html";

        var waUrl =
          "https://wa.me/?text=" + encodeURIComponent(message);

        window.open(waUrl, "_blank");
      };

      grid.appendChild(card);
    });
	
	// ===== SEO UPDATE =====
	if (searchInput.value.trim() !== "") {
		updateSEO(
		"Search Results for \"" + searchInput.value + "\" | VeggieFresh Catalogue",
		"Search results for " + searchInput.value +
		" at VeggieFresh by Geetanjali Good Foods, Bhilai."
		);
		} else if (categoryFilter.value !== "all") {
			var cat = categoryFilter.value;
			updateSEO(
				cat + " Wholesale in Bhilai | VeggieFresh – Geetanjali Good Foods",
				seoByCategory[cat] || "Wholesale food products by Geetanjali Good Foods."
			);
		} else {
			updateSEO(
			"VeggieFresh Product Catalogue | Geetanjali Good Foods Bhilai",
			"Wholesale HoReCa food products by Geetanjali Good Foods, Bhilai. Frozen vegetables, snacks, sauces & more."
			);
	}

	function injectProductSchema(products) {

  // Purana schema remove (duplicate se bachne ke liye)
  var old = document.getElementById("product-schema");
  if (old) old.remove();

  var schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": []
  };

  products.forEach(function (p, index) {

    if (!p.price || p.price <= 0) return;

    schema.itemListElement.push({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "category": p.category,
        "brand": {
          "@type": "Brand",
          "name": "VeggieFresh"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": p.price,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Geetanjali Good Foods"
          }
        }
      }
    });
  });

  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "product-schema";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

	injectProductSchema(products);

	
  }

  function updateCart() {
    var totalQty = 0;
    var totalValue = 0;

    products.forEach(function (p) {
      totalQty += p.qty;
      totalValue += p.qty * p.price;
    });

    cartQtySpan.textContent = totalQty;
    if (cartValueEl) {
      cartValueEl.textContent = "Rs. " + totalValue.toFixed(2);
    }
  }

  function buildOrderText() {
    var list = products.filter(function (p) {
      return p.qty > 0;
    });

    if (list.length === 0) return null;

    var text = "Order List:\n\n";
    var totalQty = 0;
    var totalValue = 0;

    list.forEach(function (p, i) {
      totalQty += p.qty;
      totalValue += p.qty * p.price;
      text += (i + 1) + ". " + p.name + " x " + p.qty + "\n";
    });

    text += "\nTotal Quantity: " + totalQty;
    text += "\nTotal Value: Rs. " + totalValue.toFixed(2);

    return text;
  }

  copyOrderBtn.onclick = function () {
    var text = buildOrderText();
    if (!text) {
      alert("No items selected");
      return;
    }
    navigator.clipboard.writeText(text);
  };

  whatsappBtn.onclick = function () {
    var text = buildOrderText();
    if (!text) {
      alert("No items selected");
      return;
    }
    window.open(
      "https://wa.me/919074964418?text=" + encodeURIComponent(text),
      "_blank"
    );
  };

  searchInput.oninput = render;
  categoryFilter.onchange = render;

  render();
});

