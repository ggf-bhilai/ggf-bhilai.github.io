document.addEventListener("DOMContentLoaded", function () {

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

    var clean = file.replace(/\.(png|jpg|jpeg)$/i, "");
    var parts = clean.split(",");

    var namePricePart = parts[0].trim();
    var category = parts[1] ? parts[1].trim() : "Others";

    var name = namePricePart;
    var price = 0;

    var priceMatch = namePricePart.match(/Rs\.?\s*([0-9]+(\.[0-9]+)?)/i);
    if (priceMatch) {
      price = Number(priceMatch[1]);
      name = namePricePart.split("-")[0].trim();
    }

    products.push({
      file: file,
      name: name,
      category: category,
      price: price,
      qty: 0
    });
  });

  products.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

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

      card.innerHTML =
        '<img src="products/' + p.file + '" alt="' + p.name + '">' +
        '<div class="controls-row">' +
          '<div class="qty-controls">' +
            '<button class="minus">-</button>' +
            '<span class="qty">' + String(p.qty).padStart(2, "0") + '</span>' +
            '<button class="plus">+</button>' +
          '</div>' +
          '<button class="share-btn">Share</button>' +
        '</div>' +
        '<div class="title">' + p.name + '</div>' +
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
      imgEl.title = "Click to copy";
      titleEl.title = "Click to copy";

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
        var text =
          "Product: " + p.name +
          "\nOrder Now from Geetanjali Good Foods" +
          "\nPhone: 9074964418";

        var url =
          window.location.origin + "/products/" + p.file;

        window.open(
          "https://wa.me/?text=" +
          encodeURIComponent(text + "\n" + url),
          "_blank"
        );
      };

      grid.appendChild(card);
    });
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
