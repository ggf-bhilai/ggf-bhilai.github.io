// Updated script.js to support multiple categories per product

const products = [
    // Example product structure
    {
        name: 'Product 1',
        categories: 'electronics, gadgets',
        price: 29.99,
    },
    {
        name: 'Product 2',
        categories: 'home, furniture',
        price: 99.99,
    }
];

function displayProducts() {
    products.forEach(product => {
        console.log(`Name: ${product.name}`);
        console.log(`Categories: ${product.categories}`);
        console.log(`Price: $${product.price}`);
    });
}

displayProducts();