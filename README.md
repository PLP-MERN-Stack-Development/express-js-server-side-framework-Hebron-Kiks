v
# 🚀 Express.js RESTful API – Week 2 Assignment

## 🧩 Overview
This project is a **RESTful API** built using **Express.js** that manages a collection of `products`.  
It includes full **CRUD functionality**, middleware for logging, authentication, and validation, as well as global error handling.  
Advanced features like **filtering, pagination, search, and product statistics** are also implemented.

---

## ⚙️ How to Run the Server

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd express-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create environment files
Duplicate `.env.example` and rename it to `.env`.  

**Example:**
```env
PORT=3000
API_KEY=mysecretapikey
MONGO_URI=mongodb://localhost:27017/productsdb
```

### 4️⃣ Start the server
```bash
npm start
```

By default, the server runs at:

```
http://localhost:3000
```

You should see:

```
Server running on port 3000
```

---

## 📦 API Documentation

**Base URL:**  
```
http://localhost:3000/api/products
```

### 🧾 1️⃣ GET /api/products
Fetch all products. Supports filtering and pagination.

**Query Parameters:**
| Parameter | Description       | Example                       |
|-----------|-----------------|-------------------------------|
| category  | Filter by category | `/api/products?category=Electronics` |
| page      | Page number        | `/api/products?page=2`       |
| limit     | Items per page     | `/api/products?limit=5`      |

**Example Request:**
```bash
GET /api/products
x-api-key: mysecretapikey
```

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1200,
    "category": "Electronics",
    "inStock": true
  }
]
```

### 🧾 2️⃣ GET /api/products/:id
Fetch a single product by ID.

**Example Request:**
```bash
GET /api/products/1
x-api-key: mysecretapikey
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "Electronics",
  "inStock": true
}
```

### 🧾 3️⃣ POST /api/products
Create a new product. Requires an API key in the headers.

**Headers:**
```text
x-api-key: mysecretapikey
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Smartphone",
  "description": "Latest model with fast processor",
  "price": 950,
  "category": "Electronics",
  "inStock": true
}
```

**Example Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "a1b2c3",
    "name": "Smartphone",
    "description": "Latest model with fast processor",
    "price": 950,
    "category": "Electronics",
    "inStock": true
  }
}
```

### 🧾 4️⃣ PUT /api/products/:id
Update an existing product.

**Request Body:**
```json
{
  "price": 899,
  "inStock": false
}
```

**Example Response:**
```json
{
  "message": "Product updated successfully",
  "updatedProduct": {
    "id": "1",
    "name": "Smartphone",
    "price": 899,
    "inStock": false
  }
}
```

### 🧾 5️⃣ DELETE /api/products/:id
Delete a product by ID.

**Example Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### 🧾 6️⃣ GET /api/products/search?name=<keyword>
Search for products by name.

**Example Response:**
```json
[
  {
    "id": "2",
    "name": "Smartphone",
    "description": "Latest model with fast processor",
    "price": 950,
    "category": "Electronics",
    "inStock": true
  }
]
```

### 🧾 7️⃣ GET /api/products/stats
Retrieve product statistics such as count by category.

**Example Response:**
```json
{
  "Electronics": 12,
  "Home Appliances": 5,
  "Clothing": 8
}
```

---

## 🔐 Authentication
Some routes (POST, PUT, DELETE) require an API key in the header:

```text
x-api-key: your_api_key_here
```

If the key is invalid or missing, the server responds with:

```json
{
  "message": "Unauthorized: Invalid API Key"
}
```

---

## 🧪 Example Test with curl
```bash
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-api-key: mysecretapikey" -d '{"name":"Headphones","description":"Noise cancelling","price":120,"category":"Electronics","inStock":true}'
```

---

## 🧱 Project Structure
```text
express-api/
├── config/
│   └── db.js
├── models/
│   └── products.js
├── routes/
│   └── routes.js
├── .env
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── Week2-Assignment.md

---


