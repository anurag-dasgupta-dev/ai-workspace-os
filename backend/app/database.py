import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "chat.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL DEFAULT 'New Chat',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Check whether messages table already exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='messages'")
    messages_exists = cursor.fetchone() is not None

    if messages_exists:
        cursor.execute("PRAGMA table_info(messages)")
        columns = [row[1] for row in cursor.fetchall()]

        if "conversation_id" not in columns:
            # Migrate old schema: create a default conversation and relink messages
            cursor.execute("INSERT INTO conversations (title) VALUES ('General')")
            default_id = cursor.lastrowid

            cursor.execute("ALTER TABLE messages RENAME TO messages_old")
            cursor.execute("""
                CREATE TABLE messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
                )
            """)
            cursor.execute(f"""
                INSERT INTO messages (conversation_id, role, content)
                SELECT {default_id}, role, content FROM messages_old
            """)
            cursor.execute("DROP TABLE messages_old")
    else:
        cursor.execute("""
            CREATE TABLE messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
            )
        """)

    conn.commit()
    conn.close()
