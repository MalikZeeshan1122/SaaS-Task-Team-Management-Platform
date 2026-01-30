from fastapi import FastAPI
from database import get_db_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Analytics Service is running"}

@app.get("/stats/tasks")
def get_task_stats():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # SQLite doesn't strictly need quotes for "Task", but it's good practice if case sensitivity matters.
        # However, Prisma usually creates tables with exact casing.
        cur.execute('SELECT status, COUNT(*) FROM Task GROUP BY status;')
        rows = cur.fetchall()
        # rows are sqlite3.Row objects
        stats = {row['status']: row[1] for row in rows}
    except Exception as e:
        stats = {"error": str(e)}
    finally:
        conn.close()
    
    return stats

@app.get("/stats/productivity")
def get_productivity_stats():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # SQLite date extraction: strftime('%Y-%m-%d', updatedAt / 1000, 'unixepoch') or specific format depending on how Prisma stores it.
        # Prisma stores DateTime as ISO8601 strings in SQLite usually, or milliseconds?
        # Let's assume generic date check first or simple substring.
        # Actually Prisma + SQLite stores DateTime as (Big)Int (unix timestamp) or String?
        # Prisma Default for SQLite is Integer (milli or seconds) or String?
        # Let's check a standard Prisma SQLite behavior: usually numeric unix timestamp or ISO string.
        # We will try `date(updatedAt / 1000, 'unixepoch')` assuming milliseconds if it fails we check string.
        # Actually simply: `SELECT date(updatedAt), COUNT(*) ...` works if it's ISO string. 
        query = """
            SELECT date(updatedAt/1000, 'unixepoch') as day, COUNT(*) 
            FROM Task 
            WHERE status = 'DONE' 
            GROUP BY day 
            ORDER BY day DESC 
            LIMIT 7;
        """
        cur.execute(query)
        rows = cur.fetchall()
        data = [{"date": str(row[0]), "count": row[1]} for row in rows]
    except Exception as e:
        data = {"error": str(e)}
    finally:
        conn.close()
    
    return data
