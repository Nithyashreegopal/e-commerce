# PressMart Admin Backend

Flask backend API for managing e-commerce products, banners, promos, and blog posts with MySQL database.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

Edit `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=pressmart
FLASK_PORT=5000
```

### 3. Create Database Tables

The database and tables are automatically created on first run.

### 4. Run the Server

```bash
python app.py
```

Server will start on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/<id>` - Update product
- `DELETE /api/products/<id>` - Delete product

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Add new banner
- `PUT /api/banners/<id>` - Update banner
- `DELETE /api/banners/<id>` - Delete banner

### Promos
- `GET /api/promos` - Get all promos
- `POST /api/promos` - Add new promo

### Blog
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Add new blog post

### Orders
- `GET /api/orders` - Get all orders

### Health
- `GET /api/health` - API health check

## Testing

Use Postman or curl to test endpoints:

```bash
# Get all products
curl http://localhost:5000/api/products

# Add a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","category":"Electronics","price":99.99,"stock":50,"image":"url","description":"desc","status":"Active"}'
```
