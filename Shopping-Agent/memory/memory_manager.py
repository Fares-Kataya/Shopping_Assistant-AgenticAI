import json
from pathlib import Path

MEMORY_DIR = Path("memory")
MEMORY_DIR.mkdir(exist_ok=True)

def update_buyer_history(user_id: str, product: dict):
    mem_file = MEMORY_DIR / f"{user_id}_history.json"
    if mem_file.exists():
        content = mem_file.read_text().strip()
        try:
            data = json.loads(content) if content else {"user_id": user_id, "history": []}
        except json.JSONDecodeError:
            data = {"user_id": user_id, "history": []}
    else:
        data = {"user_id": user_id, "history": []}

    data.setdefault("history", []).append(product)
    mem_file.write_text(json.dumps(data, indent=2))