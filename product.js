<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Details | VeggieFresh</title>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">

  <!-- Load images list -->
  <script src="images.js" defer></script>

  <!-- Product page script -->
  <script src="product.js" defer></script>
</head>

<body>

<header class="header">
  <div class="logo">
    <a href="index.html">
      <span class="brand-red">Veggie</span>
      <span class="brand-green">Fresh</span>
    </a>
  </div>

  <a class="whatsapp-btn"
     href="catalogue.html">
     ← Back to Catalogue
  </a>
</header>

<!-- PRODUCT DETAILS -->
<div class="product-page">

  <img id="productImage" class="product-image" src="" alt="">

  <h1 id="productName">Loading...</h1>

  <p><b>Brand:</b> <span id="productBrand"></span></p>
  <p><b>Category:</b> <span id="productCategory"></span></p>
  <p><b>Price:</b> ₹ <span id="productPrice"></span></p>

  <!-- ORDER BUTTON -->
  <button id="orderBtn" class="order-btn">
    Order This Product
  </button>

</div>

<hr>

<!-- RELATED PRODUCTS -->
<h2 style="text-align:center;">More From This Brand</h2>

<div id="relatedGrid" class="catalog-grid"></div>

</body>
</html>
