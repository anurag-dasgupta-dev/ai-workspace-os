from app.database import get_connection


def save_message(role: str, content: str, conversation_id: int) -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (role, content, conversation_id) VALUES (?, ?, ?)",
        (role, content, conversation_id),
    )
    conn.commit()
    msg_id = cursor.lastrowid
    cursor.execute("SELECT * FROM messages WHERE id = ?", (msg_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row)


def get_messages(conversation_id: int) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC",
        (conversation_id,),
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
