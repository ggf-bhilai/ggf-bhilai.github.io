// ===============================
// 🛒 CART SYSTEM
// ===============================

let cart = {};

function addToCart(name, price) {
  if (!cart[name]) {
    cart[name] = { qty: 1, price: price };
  } else {
    cart[name].qty++;
  }
  updateCartUI();
}

function removeFromCart(name) {
  if (cart[name]) {
    cart[name].qty--;
    if (cart[name].qty <= 0) delete cart[name];
  }
  updateCartUI();
}

function updateCartUI() {
  let qty = 0;
  let total = 0;

  for (let item in cart) {
    qty += cart[item].qty;
    total += cart[item].qty * cart[item].price;
  }

  document.getElementById("cartQty").innerText = qty;
  document.getElementById("cartValue").innerText = "₹ " + total.toFixed(2);
}

// ===============================
// 🧾 BUILD ORDER TEXT
// ===============================

function buildOrderText() {
  let text = "";
  let i = 1;

  for (let item in cart) {
    text += `${i}. ${item} x ${cart[item].qty}\n`;
    i++;
  }

  return text;
}

// ===============================
// 📦 CHECKOUT MODAL LOGIC
// ===============================

const whatsappBtn = document.getElementById("sendWhatsapp");
const modal = document.getElementById("checkoutModal");
const orderPreview = document.getElementById("orderPreview");

// 👉 OPEN CHECKOUT
whatsappBtn.onclick = () => {
  let text = buildOrderText();
  if (!text) return alert("❌ No items selected");

  orderPreview.textContent = text;
  modal.style.display = "flex";
};

// 👉 CLOSE CHECKOUT
document.getElementById("closeCheckout").onclick = () => {
  modal.style.display = "none";
};

// 👉 PLACE ORDER
document.getElementById("placeOrder").onclick = () => {

  let name = document.getElementById("custName").value;
  let mobile = document.getElementById("custMobile").value;
  let address = document.getElementById("custAddress").value;

  let text = buildOrderText();

  if (!name || !mobile) {
    return alert("⚠️ Please fill Name & Mobile");
  }

  let orderId = "ORD" + Date.now();

  let finalMessage =
`🛒 *New Order - VeggieFresh*

🆔 Order ID: ${orderId}

👤 Name: ${name}
📞 Mobile: ${mobile}
📍 Address: ${address}

-------------------------
${text}`;

  window.open(
    "https://wa.me/919074964418?text=" +
    encodeURIComponent(finalMessage),
    "_blank"
  );
};

// ===============================
// 💾 AUTO SAVE CUSTOMER DETAILS
// ===============================

if (document.getElementById("custName")) {

  // Load saved data
  document.getElementById("custName").value =
    localStorage.getItem("name") || "";

  document.getElementById("custMobile").value =
    localStorage.getItem("mobile") || "";

  document.getElementById("custAddress").value =
    localStorage.getItem("address") || "";

  // Save on input
  ["custName", "custMobile", "custAddress"].forEach(id => {
    document.getElementById(id).addEventListener("input", function () {

      localStorage.setItem(
        "name",
        document.getElementById("custName").value
      );

      localStorage.setItem(
        "mobile",
        document.getElementById("custMobile").value
      );

      localStorage.setItem(
        "address",
        document.getElementById("custAddress").value
      );

    });
  });
}

// ===============================
// 📋 COPY ORDER BUTTON
// ===============================

const copyBtn = document.getElementById("copyOrder");

if (copyBtn) {
  copyBtn.onclick = () => {
    let text = buildOrderText();
    if (!text) return alert("❌ No items");

    navigator.clipboard.writeText(text);
    alert("✅ Order copied!");
  };
}
