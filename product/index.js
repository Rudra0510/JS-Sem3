import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

const PORT = 8000;
const file = "./product.json";

// Read products from JSON file
function getProducts() {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// Save products to JSON file
function saveProducts(products) {
    fs.writeFileSync(file, JSON.stringify(products, null, 2));
}

// Home
app.get("/", (req, res) => {
    res.send("Product REST API is running");
});

// GET - Get all products
app.get("/products", (req, res) => {
    const products = getProducts();
    res.json(products);
});

// GET - Get product by ID
app.get("/products/:id", (req, res) => {
    const products = getProducts();

    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// POST - Add a new product
app.post("/products", (req, res) => {
    const products = getProducts();

    const newProduct = {
        id: products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,

        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    };

    products.push(newProduct);

    saveProducts(products);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// PUT - Update complete product
app.put("/products/:id", (req, res) => {
    const products = getProducts();

    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products[index] = {
        id: id,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    };

    saveProducts(products);

    res.json({
        message: "Product updated successfully",
        product: products[index]
    });
});

// PATCH - Partially update product
app.patch("/products/:id", (req, res) => {
    const products = getProducts();

    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    if (req.body.name !== undefined) {
        product.name = req.body.name;
    }

    if (req.body.category !== undefined) {
        product.category = req.body.category;
    }

    if (req.body.price !== undefined) {
        product.price = req.body.price;
    }

    if (req.body.quantity !== undefined) {
        product.quantity = req.body.quantity;
    }

    saveProducts(products);

    res.json({
        message: "Product partially updated",
        product: product
    });
});

// DELETE - Delete product
app.delete("/products/:id", (req, res) => {
    const products = getProducts();

    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1)[0];

    saveProducts(products);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});