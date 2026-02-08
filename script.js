// Updated script.js to support multiple categories

const products = [
    { name: 'Product 1', categories: 'category1, category2' },
    { name: 'Product 2', categories: 'category2, category3' },
    { name: 'Product 3', categories: 'category1' },
    // ... other products
];

function getProductsByCategory(category) {
    return products.filter(product => product.categories.split(', ').includes(category));
}

// Example Usage:
console.log(getProductsByCategory('category2')); // Will return products belonging to category2
