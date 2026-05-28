from app.database import get_connection

def save_message(role: str, content: str):
    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO messages (role, content) VALUES (?, ?)",
        (role, content)
    )

    conn.commit()
    conn.close()

def get_messages():
    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        "SELECT role, content FROM messages ORDER BY id ASC"
    )

    rows = cursor.fetchall()

    conn.close()

    return [
        {
            "role": row["role"],
            "content": row["content"]
        }
        for row in rows
    ]