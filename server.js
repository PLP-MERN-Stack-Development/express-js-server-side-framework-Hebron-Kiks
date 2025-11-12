// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./config/db');

// Custom Error Classes
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(bodyParser.json());


// -------------------- CUSTOM MIDDLEWARE --------------------

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Authentication middleware (API key)
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized. Invalid API Key.' });
    }

    next();
});

// Validation middleware for product creation + updates
function validateProduct(req, res, next) {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !price || !category) {
        return next(new ValidationError("Name, price, and category are required."));
    }

    if (typeof price !== 'number') {
        return next(new ValidationError("Price must be a number."));
    }

    next();
}


// -------------------- SAMPLE IN-MEMORY DB --------------------
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];


// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Product API! Go to /api/products to see all products.');
});


// -------------------- ROUTES --------------------

// GET /api/products (with filtering, search, pagination)
app.get('/api/products', (req, res) => {
    let result = [...products];

    const { category, search, page = 1, limit = 10 } = req.query;

    // Filtering
    if (category) {
        result = result.filter(p => p.category === category);
    }

    // Search by name
    if (search) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginated = result.slice(startIndex, endIndex);

    res.json({
        total: result.length,
        page: Number(page),
        limit: Number(limit),
        data: paginated
    });
});


// GET /api/products/:id
app.get('/api/products/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return next(new NotFoundError("Product not found"));
    }

    res.json(product);
});


// POST /api/products
app.post('/api/products', validateProduct, (req, res) => {
    const newProduct = {
        id: uuidv4(),
        ...req.body
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});


// PUT /api/products/:id
app.put('/api/products/:id', validateProduct, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return next(new NotFoundError("Product not found"));
    }

    products[index] = { ...products[index], ...req.body };

    res.json(products[index]);
});


// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return next(new NotFoundError("Product not found"));
    }

    const deleted = products.splice(index, 1);

    res.json({ message: "Product deleted", deleted });
});


// Product statistics route
app.get('/api/products/stats', (req, res) => {
    const stats = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    res.json(stats);
});


// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: err.name,
        message: err.message
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing
module.exports = app;
