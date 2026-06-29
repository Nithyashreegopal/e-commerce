# Flask Backend Setup Guide

## Quick Start

### Step 1: Install Dependencies

Open Terminal/PowerShell and navigate to the backend folder:

```bash
cd E-commerce\backend
pip install -r requirements.txt
```

### Step 2: Create MySQL Database

The database is automatically created on first run. Just make sure MySQL is running:

**On Windows:**
```bash
# MySQL should be running as a service
# Or start it manually if needed
```

### Step 3: Update .env Configuration

Edit `backend\.env` with your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=pressmart
FLASK_PORT=5000
```

### Step 4: Run Flask Server

From the backend folder:

```bash
python app.py
```

You should see:
```
Database 'pressmart' initialized successfully!
 * Running on http://localhost:5000
```

### Step 5: Test the API

Open a new browser tab and visit:
```
http://localhost:5000/api/health
```

Should return:
```json
{"status": "ok", "database": "connected"}
```

## Admin Panel Integration

Once the Flask server is running:

1. Open [adminpanel.html](../adminpanel.html) in your browser
2. Login with credentials: **admin / admin123**
3. Add products and banners - they will be saved to the MySQL database!

## Features

✅ **Products** - Add, Edit, Delete products with image, category, price, stock
✅ **Banners** - Create hero banners for homepage
✅ **Real Database** - All data stored in MySQL
✅ **API Endpoints** - RESTful API for all operations
✅ **CORS Enabled** - Frontend can communicate with backend

## Troubleshooting

**Error: "Can't connect to MySQL"**
- Make sure MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env

**Error: "Connection refused on localhost:5000"**
- Flask server might not be running
- Run: `python app.py` from backend folder

**Port 5000 already in use**
- Change FLASK_PORT in .env to another port (e.g., 5001)
- Update API_BASE_URL in admin-panel.js

## Database Structure

### Products Table
- id, name, category, price, stock, tags, image_url, description, status
- created_at, updated_at

### Banners Table
- id, title, subtext, description, image_url, cta_label, cta_link, type, status
- display_order, created_at, updated_at

### Promos Table
- id, title, description, discount_percent, start_date, end_date, image_url, status
- created_at, updated_at

### Blog Posts Table
- id, title, content, author, image_url, status
- published_at, created_at, updated_at

### Orders Table
- id, order_number, customer_name, customer_email, items (JSON), total
- payment_status, order_status, created_at, updated_at

## Next Steps

- [x] Setup Flask backend
- [ ] Connect frontend forms to API
- [ ] Add image upload functionality
- [ ] Add edit product/banner functionality
- [ ] Create customer-facing product page with database integration
- [ ] Setup order management system

Happy coding! 🚀
