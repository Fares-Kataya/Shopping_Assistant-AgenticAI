import json
from pathlib import Path

MEMORY_DIR = Path("memory")
MEMORY_DIR.mkdir(exist_ok=True)

def update_buyer_history(user_id: str, product: dict):
    mem_file = MEMORY_DIR / f"{user_id}_history.json"
    if mem_file.exists():
        data = json.loads(mem_file.read_text())
    else:
        data = {"user_id": user_id, "history": []}

    data["history"].append(product)
    mem_file.write_text(json.dumps(data, indent=2))
