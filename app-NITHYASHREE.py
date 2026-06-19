import os
import sys
import json
from datetime import datetime

# Ensure backend module imports work when starting app from the workspace root.
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from database import get_connection, init_database, get_cursor
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'pressmart_super_secure_session_secret')
CORS(app, supports_credentials=True, resources={
  r"/api/*": {
    "origins": ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:5000", "http://127.0.0.1:5000"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
  }
})
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

@app.after_request
def after_request(response):
  origin = request.headers.get('Origin')
  if origin in ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:5000", "http://127.0.0.1:5000"]:
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

# Initialize database on startup
init_database()

# ==================== PRODUCTS ====================

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(products)

@app.route('/api/products', methods=['POST'])
def add_product():
    """Add a new product."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """INSERT INTO products (name, category, price, stock, tags, image_url, description, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        data.get('name'),
        data.get('category'),
        data.get('price'),
        data.get('stock'),
        data.get('tags'),
        data.get('image'),
        data.get('description'),
        data.get('status', 'Active')
    )
    
    cursor.execute(query, values)
    conn.commit()
    product_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': product_id, 'message': 'Product added successfully'}), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """UPDATE products SET name=%s, category=%s, price=%s, stock=%s, tags=%s, 
               image_url=%s, description=%s, status=%s WHERE id=%s"""
    
    values = (
        data.get('name'),
        data.get('category'),
        data.get('price'),
        data.get('stock'),
        data.get('tags'),
        data.get('image'),
        data.get('description'),
        data.get('status', 'Active'),
        product_id
    )
    
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Product updated successfully'})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id=%s", (product_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Product deleted successfully'})

# ==================== BANNERS ====================

@app.route('/api/banners', methods=['GET'])
def get_banners():
    """Get all banners."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT * FROM banners ORDER BY display_order ASC")
    banners = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(banners)


# ----------------- ADMIN CREDENTIALS -----------------
@app.route('/api/admin', methods=['GET'])
def get_admin():
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT id, username, active, created_at, updated_at FROM admin_users ORDER BY id LIMIT 1")
    admin = cursor.fetchone()
    cursor.close()
    conn.close()
    if not admin:
        return jsonify({'error': 'No admin user found'}), 404
    return jsonify(admin)


@app.route('/api/admin', methods=['PUT'])
def update_admin():
    data = request.json or {}
    current = data.get('current_password')
    new_password = data.get('new_password')
    new_username = data.get('username')

    if not current or not new_password:
        return jsonify({'error': 'current_password and new_password are required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT id, username, password_hash FROM admin_users ORDER BY id LIMIT 1")
    admin = cursor.fetchone()
    if not admin:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No admin user found'}), 404

    stored_hash = admin.get('password_hash') or admin.get('password')
    try:
        if not check_password_hash(stored_hash, current):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Current password is incorrect'}), 403
    except Exception:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Password verification failed'}), 500

    # update
    new_hash = generate_password_hash(new_password)
    update_values = (new_username or admin.get('username'), new_hash, admin.get('id'))
    try:
        cursor.execute("UPDATE admin_users SET username=%s, password_hash=%s, active=1 WHERE id=%s", update_values)
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        if 'duplicate' in str(e).lower() or 'unique' in str(e).lower():
            return jsonify({'error': 'Username already exists'}), 409
        return jsonify({'error': 'Failed to update admin credentials'}), 500

    cursor.close()
    conn.close()

    return jsonify({'message': 'Admin credentials updated successfully'})


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'username and password required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT id, username, password_hash, active FROM admin_users WHERE username=%s LIMIT 1", (username,))
    admin = cursor.fetchone()
    cursor.close()
    conn.close()

    if not admin:
        return jsonify({'error': 'Invalid credentials'}), 401

    try:
        if not check_password_hash(admin.get('password_hash'), password):
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception:
        return jsonify({'error': 'Password verification error'}), 500

    if not admin.get('active'):
        return jsonify({'error': 'Admin account is inactive'}), 403

    return jsonify({'id': admin.get('id'), 'username': admin.get('username')})

@app.route('/api/banners', methods=['POST'])
def add_banner():
    """Add a new banner."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """INSERT INTO banners (title, subtext, description, image_url, cta_label, cta_link, type, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        data.get('title'),
        data.get('subtext'),
        data.get('description'),
        data.get('image'),
        data.get('cta'),
        data.get('link'),
        data.get('type'),
        data.get('status', 'Active')
    )
    
    cursor.execute(query, values)
    conn.commit()
    banner_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': banner_id, 'message': 'Banner added successfully'}), 201

@app.route('/api/banners/<int:banner_id>', methods=['PUT'])
def update_banner(banner_id):
    """Update a banner."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """UPDATE banners SET title=%s, subtext=%s, description=%s, image_url=%s, 
               cta_label=%s, cta_link=%s, type=%s, status=%s WHERE id=%s"""
    
    values = (
        data.get('title'),
        data.get('subtext'),
        data.get('description'),
        data.get('image'),
        data.get('cta'),
        data.get('link'),
        data.get('type'),
        data.get('status'),
        banner_id
    )
    
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Banner updated successfully'})

@app.route('/api/banners/<int:banner_id>', methods=['DELETE'])
def delete_banner(banner_id):
    """Delete a banner."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM banners WHERE id=%s", (banner_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Banner deleted successfully'})

# ==================== PROMOS ====================

@app.route('/api/promos', methods=['GET'])
def get_promos():
    """Get all promos."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT * FROM promos ORDER BY created_at DESC")
    promos = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(promos)

@app.route('/api/promos', methods=['POST'])
def add_promo():
    """Add a new promo."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """INSERT INTO promos (title, description, discount_percent, start_date, end_date, image_url, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        data.get('title'),
        data.get('description'),
        data.get('discount'),
        data.get('start_date'),
        data.get('end_date'),
        data.get('image'),
        data.get('status', 'Active')
    )
    
    cursor.execute(query, values)
    conn.commit()
    promo_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': promo_id, 'message': 'Promo added successfully'}), 201

# ==================== BLOG ====================

@app.route('/api/blog', methods=['GET'])
def get_blog_posts():
    """Get all blog posts."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = get_cursor(conn, dictionary=True)
    cursor.execute("SELECT * FROM blog_posts ORDER BY created_at DESC")
    posts = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(posts)

@app.route('/api/blog', methods=['POST'])
def add_blog_post():
    """Add a new blog post."""
    data = request.json
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    query = """INSERT INTO blog_posts (title, content, author, image_url, status)
               VALUES (%s, %s, %s, %s, %s)"""
    
    values = (
        data.get('title'),
        data.get('content'),
        data.get('author'),
        data.get('image'),
        data.get('status', 'Draft')
    )
    
    cursor.execute(query, values)
    conn.commit()
    post_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({'id': post_id, 'message': 'Blog post added successfully'}), 201

# ==================== ORDERS ====================

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders."""
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = get_cursor(conn, dictionary=True)
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        
        orders = []
        for row in rows:
            orders.append({
                'id': row.get('order_number') or str(row.get('id')),
                'db_id': row.get('id'),
                'customer_name': row.get('customer_name'),
                'customer_email': row.get('customer_email'),
                'items': json.loads(row.get('items')) if isinstance(row.get('items'), str) else row.get('items') or [],
                'total': float(row.get('total') or 0),
                'payment_status': row.get('payment_status') or 'Paid',
                'status': row.get('order_status') or 'Confirmed',
                'created_at': row.get('created_at').isoformat() if hasattr(row.get('created_at'), 'isoformat') else str(row.get('created_at'))
            })
        return jsonify(orders)
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order."""
    data = request.json or {}
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        order_number = data.get('id')
        customer = data.get('customer', {})
        customer_name = customer.get('name')
        customer_email = customer.get('email')
        items = data.get('items', [])
        summary = data.get('summary', {})
        total = summary.get('total')
        payment_status = 'Paid'
        order_status = data.get('status', 'Confirmed')
        
        items_json = json.dumps(items)
        
        query = """INSERT INTO orders (order_number, customer_name, customer_email, items, total, payment_status, order_status)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (order_number, customer_name, customer_email, items_json, total, payment_status, order_status))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({'message': 'Order created successfully'}), 201
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<string:order_number>/status', methods=['PUT'])
def update_order_status(order_number):
    """Update order status."""
    data = request.json or {}
    status = data.get('status')
    if not status:
        return jsonify({'error': 'Status is required'}), 400
    
    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE orders SET order_status=%s WHERE order_number=%s", (status, order_number))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Order status updated successfully'})
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    conn = get_connection()
    if conn:
        conn.close()
        return jsonify({'status': 'ok', 'database': 'connected'}), 200
    return jsonify({'status': 'error', 'database': 'disconnected'}), 500

# ==================== USERS & AUTHENTICATION ====================

@app.route('/api/users/register', methods=['POST'])
def register_user():
    """Register a new user."""
    data = request.json or {}
    name = data.get('name')
    email = data.get('email')
    mobile = data.get('mobile')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = get_cursor(conn, dictionary=True)
        # Check if email is already taken
        cursor.execute("SELECT id FROM users WHERE email=%s LIMIT 1", (email,))
        existing = cursor.fetchone()
        if existing:
            cursor.close()
            conn.close()
            return jsonify({'error': 'An account with this email already exists.'}), 409

        password_hash = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (name, email, mobile, password_hash) VALUES (%s, %s, %s, %s)",
            (name, email, mobile, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()

        # Set user session variables
        session['user'] = {
            'id': user_id,
            'name': name,
            'email': email,
            'mobile': mobile
        }

        return jsonify({'id': user_id, 'name': name, 'email': email, 'mobile': mobile, 'message': 'User registered successfully'}), 201
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/login', methods=['POST'])
def login_user():
    """Login a user."""
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = get_cursor(conn, dictionary=True)
        cursor.execute("SELECT id, name, email, mobile, password_hash FROM users WHERE email=%s LIMIT 1", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({'error': 'No account found with this email.'}), 401

        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Incorrect password.'}), 401

        # Set user session variables
        session['user'] = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'mobile': user['mobile']
        }

        return jsonify({
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'mobile': user['mobile']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['PUT'])
def update_user_profile():
    """Update user profile details."""
    data = request.json or {}
    email = data.get('email')
    name = data.get('name')
    mobile = data.get('mobile')
    password = data.get('password')  # optional new password

    if not email:
        return jsonify({'error': 'Email is required to identify the user'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = get_cursor(conn, dictionary=True)
        
        # Check if user exists
        cursor.execute("SELECT id, password_hash FROM users WHERE email=%s LIMIT 1", (email,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'User not found.'}), 404

        if password:
            pwd_hash = generate_password_hash(password)
            cursor.execute(
                "UPDATE users SET name=%s, mobile=%s, password_hash=%s WHERE email=%s",
                (name, mobile, pwd_hash, email)
            )
        else:
            cursor.execute(
                "UPDATE users SET name=%s, mobile=%s WHERE email=%s",
                (name, mobile, email)
            )
        
        conn.commit()
        cursor.close()
        conn.close()

        # Update user session variables
        session['user'] = {
            'id': user['id'],
            'name': name,
            'email': email,
            'mobile': mobile
        }
        
        return jsonify({'message': 'Profile updated successfully', 'name': name, 'email': email, 'mobile': mobile})
    except Exception as e:
        if conn:
            conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/session', methods=['GET'])
def get_user_session_route():
    """Get active session details."""
    if 'user' in session:
        return jsonify(session['user']), 200
    return jsonify(None), 200

@app.route('/api/users/logout', methods=['POST'])
def logout_user_route():
    """Clear session data."""
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(debug=True, port=port)

