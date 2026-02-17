document.addEventListener("DOMContentLoaded", function () {

  // URL se file param lo
  const params = new URLSearchParams(window.location.search);
  const file = params.get("file");

  if (!file) {
    document.getElementById("productName").textContent =
      "❌ Product Not Found";
    return;
  }

  // Filename parse function
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

  // Product Data Extract
  let product = parseFilename(file);

  if (!product) {
    document.getElementById("productName").textContent =
      "❌ Invalid Product File";
    return;
  }

  // DOM Elements Fill
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

  // Order Button
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

});
