import json
from datetime import datetime
from pathlib import Path

LOG_PATH = "logs/purchase_log.json"

def log_purchase(user_id: str, product: dict) -> dict:
    entry = {
        "user_id": user_id,
        "product": product,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    Path("logs").mkdir(exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return {"status": "success", "message": f"Purchased {product.get('product')}"}
