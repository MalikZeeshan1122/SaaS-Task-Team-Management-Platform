import sqlite3
import os

DB_PATH = "backend/dev.db"

if not os.path.exists(DB_PATH):
    print(f"ERROR: {DB_PATH} not found!")
    exit(1)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", [t[0] for t in tables])
conn.close()
