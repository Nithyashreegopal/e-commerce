import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'pressmart')

try:
    import pymysql
    from pymysql.cursors import DictCursor
    _DB_DRIVER = 'pymysql'
except ImportError:
    try:
        import mysql.connector
        from mysql.connector import Error as MySQLError
        _DB_DRIVER = 'mysqlconnector'
    except ImportError:
        _DB_DRIVER = None


def get_connection():
    """Create and return a MySQL connection using the available driver."""
    if _DB_DRIVER == 'pymysql':
        try:
            return pymysql.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME,
                cursorclass=DictCursor
            )
        except Exception as e:
            print(f"PyMySQL connection error: {e}")
            return None
    elif _DB_DRIVER == 'mysqlconnector':
        try:
            return mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
        except MySQLError as e:
            print(f"mysql-connector connection error: {e}")
            return None
    else:
        print('No suitable MySQL driver installed (PyMySQL or mysql-connector).')
        return None


def get_cursor(connection, dictionary=False):
    """Return a cursor for the given connection."""
    if _DB_DRIVER == 'pymysql':
        return connection.cursor(DictCursor if dictionary else None)
    if dictionary and _DB_DRIVER == 'mysqlconnector':
        return connection.cursor(dictionary=True)
    return connection.cursor()


def init_database():
    """Initialize database tables."""
    try:
        if _DB_DRIVER == 'pymysql':
            connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)
        elif _DB_DRIVER == 'mysqlconnector':
            connection = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)
        else:
            print('No suitable MySQL driver installed (PyMySQL or mysql-connector).')
            return

        cursor = connection.cursor()

        # Create database
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.execute(f"USE {DB_NAME}")

        # Products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                price DECIMAL(10, 2),
                stock INT DEFAULT 0,
                tags VARCHAR(255),
                image_url LONGTEXT,
                description TEXT,
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Banners table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subtext VARCHAR(255),
                description TEXT,
                image_url LONGTEXT,
                cta_label VARCHAR(100),
                cta_link VARCHAR(500),
                type VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Active',
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Promos table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS promos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                discount_percent DECIMAL(5, 2),
                start_date DATE,
                end_date DATE,
                image_url VARCHAR(500),
                status VARCHAR(50) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Blog table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                author VARCHAR(100),
                image_url VARCHAR(500),
                status VARCHAR(50) DEFAULT 'Draft',
                published_at DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Orders table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE,
                customer_name VARCHAR(255),
                customer_email VARCHAR(255),
                items JSON,
                total DECIMAL(10, 2),
                payment_status VARCHAR(50),
                order_status VARCHAR(50) DEFAULT 'Confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Alter tables to ensure LONGTEXT for image_url if they existed with TEXT
        try:
            cursor.execute("ALTER TABLE products MODIFY COLUMN image_url LONGTEXT")
            cursor.execute("ALTER TABLE banners MODIFY COLUMN image_url LONGTEXT")
            connection.commit()
        except Exception:
            pass

        # Ensure default banners exist
        try:
            cursor.execute("SELECT COUNT(*) as cnt FROM banners")
            row = cursor.fetchone()
            count = row[0] if isinstance(row, tuple) else row['cnt']
            if count == 0:
                default_banners = [
                    ("Women's Collection", "Discover the Latest Styles", "Check out our latest premium outfits and accessories for women.", "IMAGES/WOMEN.webp", "SHOP NOW", "shop.html", "homepage", "Active", 0),
                    ("Men's Fashion", "Premium Quality Products", "Explore the new seasonal designs and comfort styles for men.", "IMAGES/fashion men.webp", "SHOP NOW", "shop.html", "homepage", "Active", 1),
                    ("Exclusive Handbags", "Elegant & Timeless Designs", "Curated bags that are both durable and elegant for every occasion.", "IMAGES/HANDBAG.webp", "SHOP NOW", "shop.html", "homepage", "Active", 2),
                    ("Shoes Collection", "Comfort Meets Style", "Walk with ease and comfort with our top quality sneakers and casual footwear.", "IMAGES/shoes.webp", "SHOP NOW", "shop.html", "homepage", "Active", 3),
                    ("Travel Essentials", "Durable & Stylish Backpacks", "Prepare for your journey with backpacks made of premium material.", "IMAGES/BACKPACK.webp", "SHOP NOW", "shop.html", "homepage", "Active", 4)
                ]
                cursor.executemany("""
                    INSERT INTO banners (title, subtext, description, image_url, cta_label, cta_link, type, status, display_order)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, default_banners)
                connection.commit()
        except Exception as seed_err:
            print(f"Error seeding default banners: {seed_err}")

        connection.commit()

        # Admin users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                active TINYINT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                mobile VARCHAR(50),
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)

        # Ensure a default admin exists
        try:
            from werkzeug.security import generate_password_hash
            default_username = 'admin'
            default_password = 'admin123'
            cursor.execute("SELECT COUNT(*) as cnt FROM admin_users")
            row = cursor.fetchone()
            count = row[0] if isinstance(row, tuple) else row['cnt']
            if count == 0:
                pwd_hash = generate_password_hash(default_password)
                cursor.execute("INSERT INTO admin_users (username, password_hash) VALUES (%s, %s)", (default_username, pwd_hash))
        except Exception:
            # If werkzeug isn't available or insert fails, skip silently
            pass

        connection.commit()
        print(f"Database '{DB_NAME}' initialized successfully!")
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
