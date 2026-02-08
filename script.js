// Assume this is the new script content that includes multiple categories functionality. 
function parseProducts(products) {
    // Code to parse products 
}

function filterProductsByCategories(products, categories) {
    const categoryArray = categories.split(',').map(category => category.trim());
    return products.filter(product => 
        categoryArray.some(category => product.categories.includes(category))
    );
}

// original functionality code here... 
// Ensure you maintain all previous features while adding new functionality.