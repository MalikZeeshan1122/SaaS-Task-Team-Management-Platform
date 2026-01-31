import os
import sqlite3
import dotenv

dotenv.load_dotenv()

# Point to the backend's SQLite database
DB_PATH = os.path.join(os.path.dirname(__file__), "../backend/prisma/dev.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Allow accessing columns by name
    return conn

